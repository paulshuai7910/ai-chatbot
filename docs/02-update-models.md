# 更新模型

聊天机器人模板默认使用 [OpenAI](https://sdk.vercel.ai/providers/ai-sdk-providers/openai) 作为模型提供商。由于该模板由 [AI SDK](https://sdk.vercel.ai) 提供支持，而 AI SDK 默认支持 [多个提供商](https://sdk.vercel.ai/providers/ai-sdk-providers)，因此你可以轻松切换到其他你选择的提供商。

要更新模型，你需要更新位于 `/lib/ai/models.ts` 中的自定义提供商 `myProvider`，如下所示：

```ts
import { customProvider } from "ai"
import { openai } from "@ai-sdk/openai"

export const myProvider = customProvider({
  languageModels: {
    "chat-model-small": openai("gpt-4o-mini"),
    "chat-model-large": openai("gpt-4o"),
    "chat-model-reasoning": wrapLanguageModel({
      model: fireworks("accounts/fireworks/models/deepseek-r1"),
      middleware: extractReasoningMiddleware({ tagName: "think" }),
    }),
    "title-model": openai("gpt-4-turbo"),
    "artifact-model": openai("gpt-4o-mini"),
  },
  imageModels: {
    "small-model": openai.image("dall-e-3"),
  },
})
```

你可以将 `openai` 模型替换为你选择的任何其他提供商。你需要安装该提供商的库，并相应地切换模型。

例如，如果你想为 `chat-model-large` 使用 Anthropic 的 `claude-3-5-sonnet` 模型，你可以像下面这样将 `openai` 模型替换为 `anthropic` 模型：

```ts
import { customProvider } from "ai"
import { anthropic } from "@ai-sdk/anthropic"

export const myProvider = customProvider({
  languageModels: {
    "chat-model-small": openai("gpt-4o-mini"),
    "chat-model-large": anthropic("claude-3-5-sonnet"), // 将 openai 替换为 anthropic
    "chat-model-reasoning": wrapLanguageModel({
      model: fireworks("accounts/fireworks/models/deepseek-r1"),
      middleware: extractReasoningMiddleware({ tagName: "think" }),
    }),
    "title-model": openai("gpt-4-turbo"),
    "artifact-model": openai("gpt-4o-mini"),
  },
  imageModels: {
    "small-model": openai.image("dall-e-3"),
  },
})
```

你可以在 [提供商](https://sdk.vercel.ai/providers/ai-sdk-providers) 的文档中找到相应的库和模型名称。一旦你更新了模型，你就可以在聊天机器人中使用新的模型了。
