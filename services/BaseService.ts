const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const BaseService = {
  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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
  }
};