import { IApiConversation } from "@/interfaces/services/ChatHistoryService";

export interface IHistoryItem {
  id: string;
  title: string;
  date: string;
}

export interface IHistoryGroup {
  label: string;
  items: IHistoryItem[];
}

export function groupConversations(conversas: IApiConversation[]): IHistoryGroup[] {
  const groups: Record<string, IApiConversation[]> = {
    Hoje: [],
    Ontem: [],
    "Últimos 7 dias": [],
    Anteriores: [],
  };

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const ontem = new Date(hoje);
  ontem.setDate(ontem.getDate() - 1);

  const seteDias = new Date(hoje);
  seteDias.setDate(seteDias.getDate() - 7);

  conversas.forEach((c) => {
    const dataAtualizacao = new Date(c.atualizado_em);

    if (dataAtualizacao >= hoje) {
      groups["Hoje"].push(c);
    } else if (dataAtualizacao >= ontem) {
      groups["Ontem"].push(c);
    } else if (dataAtualizacao >= seteDias) {
      groups["Últimos 7 dias"].push(c);
    } else {
      groups["Anteriores"].push(c);
    }
  });

  return Object.keys(groups)
    .filter((key) => groups[key].length > 0)
    .map((key) => ({
      label: key,
      items: groups[key].map((c) => ({
        id: c.id.toString(),
        title: c.titulo || "Nova conversa",
        date: new Date(c.atualizado_em).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      })),
    }));
}
