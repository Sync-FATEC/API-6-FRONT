const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL;

const normalizeBaseUrl = (value?: string): string => {
  const cleaned = (value ?? "").trim();

  if (!cleaned || cleaned === "undefined" || cleaned === "null") {
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      if (host === "localhost" || host === "127.0.0.1") {
        return "http://127.0.0.1:8001/api/v1";
      }
    }
    return "/api";
  }

  return cleaned.endsWith("/") ? cleaned.slice(0, -1) : cleaned;
};

const BASE_URL = normalizeBaseUrl(rawBaseUrl);

export const BaseService = {
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar dados do servidor: ${response.status}`);
    }

    return (await response.json()) as T;
  },

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);
    return (await response.json()) as T;
  },

  async getBlob(endpoint: string): Promise<Blob> {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`Erro ao baixar arquivo: ${response.status}`);
    }
    
    return await response.blob();
  },
};
