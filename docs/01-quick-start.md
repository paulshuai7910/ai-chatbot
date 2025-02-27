# 快速开始

聊天机器人模板是一个使用 [Next.js](https://nextjs.org) 和 [AI SDK](https://sdk.vercel.ai) 构建的 Web 应用程序，可以作为构建自己的 AI 应用程序的起点。该模板设计为易于定制和扩展，允许你根据需要添加新功能和集成。

将其部署到 [Vercel](https://vercel.com) 是启动聊天机器人模板的最快方式，因为它通过连接到集成并将其部署到云端来自动设置项目。然后，你可以在本地开发该项目，并将更改推送到 Vercel 项目。

### 前提条件：

- Vercel 账户和 [Vercel CLI](https://vercel.com/docs/cli)
- GitHub/GitLab/Bitbucket 账户
- 来自 [OpenAI](https://platform.openai.com) 的 API 密钥

### 部署到 Vercel

要将聊天机器人模板部署到 Vercel，请点击此 [链接](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fai-chatbot&env=AUTH_SECRET,OPENAI_API_KEY&envDescription=Learn%20more%20about%20how%20to%20get%20the%20API%20Keys%20for%20the%20application&envLink=https%3A%2F%2Fgithub.com%2Fvercel%2Fai-chatbot%2Fblob%2Fmain%2F.env.example&demo-title=AI%20Chatbot&demo-description=An%20Open-Source%20AI%20Chatbot%20Template%20Built%20With%20Next.js%20and%20the%20AI%20SDK%20by%20Vercel.&demo-url=https%3A%2F%2Fchat.vercel.ai&stores=%5B%7B%22type%22:%22postgres%22%7D,%7B%22type%22:%22blob%22%7D%5D) 进入一键部署流程。

在流程中，你将被提示创建并连接到一个 Postgres 数据库和 Blob 存储。你还需要为应用提供环境变量。

部署项目后，你可以通过访问 Vercel 提供的 URL 来访问聊天机器人模板。

### 本地开发

要在本地开发聊天机器人模板，你可以克隆仓库并将其链接到你的 Vercel 项目。这将允许你从 Vercel 项目中拉取环境变量并在本地使用它们。

```bash
git clone https://github.com/<username>/<repository>
cd <repository>
pnpm install

vercel link
vercel env pull
```

链接项目后，你可以通过运行以下命令启动开发服务器：

```bash
pnpm dev
```

聊天机器人模板将可通过 `http://localhost:3000` 访问。
