# Artifacts（工件）

Artifacts 是一种特殊的用户界面模式，允许你在聊天界面的基础上拥有类似工作区的界面。这类似于 [ChatGPT 的 Canvas](https://openai.com/index/introducing-canvas) 和 [Claude 的 Artifacts](https://www.anthropic.com/news/artifacts)。

该模板已经自带了以下几种工件：

- **文本工件**：允许你处理文本内容，比如起草文章和电子邮件。
- **代码工件**：允许你编写和执行代码（如 Python）。
- **图像工件**：允许你处理图像，比如编辑、注释和处理图像。
- **表格工件**：允许你处理表格数据，如创建、编辑和分析数据。

## 添加自定义工件

要添加自定义工件，你需要在 `artifacts` 目录下创建一个以工件名称命名的文件夹。该文件夹应包含以下文件：

- `client.tsx`：工件的客户端代码。
- `server.ts`：工件的服务器端代码。

以下是一个名为 `CustomArtifact` 的自定义工件示例：

```bash
artifacts/
  custom/
    client.tsx
    server.ts
```

### 客户端示例（client.tsx）

该文件负责渲染你的自定义工件。你可以用自己的组件替换内部 UI，但整体模式（初始化、处理流式数据、渲染内容）保持不变。例如：

```tsx
import { Artifact } from "@/components/create-artifact"
import { ExampleComponent } from "@/components/example-component"
import { toast } from "sonner"

interface CustomArtifactMetadata {
  // 定义自定义工件可能需要的元数据，以下示例较为简单。
  info: string
}

export const customArtifact = new Artifact<"custom", CustomArtifactMetadata>({
  kind: "custom",
  description: "一个展示自定义功能的工件。",
  // 初始化时可以获取额外的数据或执行副作用
  initialize: async ({ documentId, setMetadata }) => {
    // 例如，用默认元数据初始化工件。
    setMetadata({
      info: `文档 ${documentId} 已初始化。`,
    })
  },
  // 处理从服务器流式传输的部分（如果工件支持流式更新）
  onStreamPart: ({ streamPart, setMetadata, setArtifact }) => {
    if (streamPart.type === "info-update") {
      setMetadata((metadata) => ({
        ...metadata,
        info: streamPart.content as string,
      }))
    }
    if (streamPart.type === "content-update") {
      setArtifact((draftArtifact) => ({
        ...draftArtifact,
        content: draftArtifact.content + (streamPart.content as string),
        status: "streaming",
      }))
    }
  },
  // 定义工件内容的渲染方式
  content: ({
    mode,
    status,
    content,
    isCurrentVersion,
    currentVersionIndex,
    onSaveContent,
    getDocumentContentById,
    isLoading,
    metadata,
  }) => {
    if (isLoading) {
      return <div>加载自定义工件...</div>
    }

    if (mode === "diff") {
      const oldContent = getDocumentContentById(currentVersionIndex - 1)
      const newContent = getDocumentContentById(currentVersionIndex)
      return (
        <div>
          <h3>差异视图</h3>
          <pre>{oldContent}</pre>
          <pre>{newContent}</pre>
        </div>
      )
    }

    return (
      <div className="custom-artifact">
        <ExampleComponent
          content={content}
          metadata={metadata}
          onSaveContent={onSaveContent}
          isCurrentVersion={isCurrentVersion}
        />
        <button
          onClick={() => {
            navigator.clipboard.writeText(content)
            toast.success("内容已复制到剪贴板！")
          }}
        >
          复制
        </button>
      </div>
    )
  },
  // 工件工具栏中可选的操作
  actions: [
    {
      icon: <span>⟳</span>,
      description: "刷新工件信息",
      onClick: ({ appendMessage }) => {
        appendMessage({
          role: "user",
          content: "请刷新我的自定义工件信息。",
        })
      },
    },
  ],
  // 更多控制选项的工具栏操作
  toolbar: [
    {
      icon: <span>✎</span>,
      description: "编辑自定义工件",
      onClick: ({ appendMessage }) => {
        appendMessage({
          role: "user",
          content: "编辑自定义工件内容。",
        })
      },
    },
  ],
})
```

### 服务器端示例（server.ts）

服务器文件处理工件的文档。它可以流式传输更新（如果适用）并返回最终内容。例如：

```ts
import { smoothStream, streamText } from "ai"
import { myProvider } from "@/lib/ai/models"
import { createDocumentHandler } from "@/lib/artifacts/server"
import { updateDocumentPrompt } from "@/lib/ai/prompts"

export const customDocumentHandler = createDocumentHandler<"custom">({
  kind: "custom",
  // 创建文档时调用。
  onCreateDocument: async ({ title, dataStream }) => {
    let draftContent = ""
    // 例如，使用 streamText 来生成内容。
    const { fullStream } = streamText({
      model: myProvider.languageModel("artifact-model"),
      system: "根据标题生成创意内容。支持 Markdown。",
      experimental_transform: smoothStream({ chunking: "word" }),
      prompt: title,
    })

    // 将内容流式传输回客户端。
    for await (const delta of fullStream) {
      if (delta.type === "text-delta") {
        draftContent += delta.textDelta
        dataStream.writeData({
          type: "content-update",
          content: delta.textDelta,
        })
      }
    }

    return draftContent
  },
  // 当根据用户修改更新文档时调用。
  onUpdateDocument: async ({ document, description, dataStream }) => {
    let draftContent = ""
    const { fullStream } = streamText({
      model: myProvider.languageModel("artifact-model"),
      system: updateDocumentPrompt(document.content, "custom"),
      experimental_transform: smoothStream({ chunking: "word" }),
      prompt: description,
      experimental_providerMetadata: {
        openai: {
          prediction: {
            type: "content",
            content: document.content,
          },
        },
      },
    })

    for await (const delta of fullStream) {
      if (delta.type === "text-delta") {
        draftContent += delta.textDelta
        dataStream.writeData({
          type: "content-update",
          content: delta.textDelta,
        })
      }
    }

    return draftContent
  },
})
```

一旦创建了客户端和服务器文件，你可以在 `lib/artifacts/server.ts` 文件中导入该工件，并将其添加到 `documentHandlersByArtifactKind` 数组中：

```ts
export const documentHandlersByArtifactKind: Array<DocumentHandler> = [
  ...,
  customDocumentHandler,
];

export const artifactKinds = [..., "custom"] as const;
```

同时，在 `lib/db/schema.ts` 中的文档模式中指定它：

```ts
export const document = pgTable(
  "Document",
  {
    id: uuid("id").notNull().defaultRandom(),
    createdAt: timestamp("createdAt").notNull(),
    title: text("title").notNull(),
    content: text("content"),
    kind: varchar("text", { enum: [..., "custom"] }) // 在这里添加自定义工件类型
      .notNull()
      .default("text"),
    userId: uuid("userId")
      .notNull()
      .references(() => user.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.id, table.createdAt] }),
    };
  },
);
```

最后，将客户端工件添加到 `components/artifact.tsx` 文件中的 `artifactDefinitions` 数组中：

```ts
import { customArtifact } from "@/artifacts/custom/client";

export const artifactDefinitions = [..., customArtifact];
```

现在，你应该可以在工作区中看到你的自定义工件了！
