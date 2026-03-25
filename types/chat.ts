interface BaseMessage {
  id: string;
  content: string;
}

type BotStatus = "thinking" | "typing" | "done";

export interface UserMessage extends BaseMessage {
  role: "user";
}

export interface BotMessage extends BaseMessage {
  role: "bot";
  source?: string;
  year?: number;
  status: BotStatus;
  intention?: string;
  thinkingTime?: number;
}

export type Message = UserMessage | BotMessage;
