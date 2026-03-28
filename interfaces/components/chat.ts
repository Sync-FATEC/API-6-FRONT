import { IGeoJSONFeatureCollection } from "../geojson";

export interface ChatMessage {
  id: string;
  role: "user" | "bot";
  content: string;
  status?: "thinking" | "typing" | "done";
  thinkingTime?: number;
  source?: string;
  year?: number;
  intention?: string;
  geojson?: IGeoJSONFeatureCollection;
}
