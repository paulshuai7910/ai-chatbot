import { openai } from "@ai-sdk/openai"
import { deepseek } from "@ai-sdk/deepseek"
import { fireworks } from "@ai-sdk/fireworks"
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai"

export const DEFAULT_CHAT_MODEL: string = "chat-model-small"

export const myProvider = customProvider({
  languageModels: {
    "chat-model-small": openai("gpt-3.5-turbo"),
    // 'chat-model-small': openai('gpt-4o-mini'),
    "chat-model-large": deepseek("deepseek-reasoner"),
    // "chat-model-large": openai("gpt-4o"),
    "chat-model-reasoning": wrapLanguageModel({
      // model: fireworks("accounts/fireworks/models/deepseek-r1"),
      model: fireworks("accounts/fireworks/models/llama-v3p3-70b-instruct"),
      middleware: extractReasoningMiddleware({ tagName: "think" }),
    }),
    "title-model": openai("gpt-3.5-turbo"),
    "artifact-model": openai("gpt-3.5-turbo"),
  },
  imageModels: {
    "small-model": openai.image("dall-e-2"),
    "large-model": openai.image("dall-e-3"),
  },
})

interface ChatModel {
  id: string
  name: string
  description: string
}

export const chatModels: Array<ChatModel> = [
  {
    id: "chat-model-small",
    name: "Small model",
    description: "Small model for fast, lightweight tasks",
  },
  {
    id: "chat-model-large",
    name: "Large model",
    description: "Large model for complex, multi-step tasks",
  },
  {
    id: "chat-model-reasoning",
    name: "Reasoning model",
    description: "Uses advanced reasoning",
  },
]
