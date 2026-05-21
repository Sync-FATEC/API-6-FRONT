const BASE_URL = process.env.NEXT_PUBLIC_API_URL!.replace(/\/$/, "");

export const BaseService = {
  async postWithAuth<T>(
    endpoint: string,
    token: string,
    data?: unknown
  ): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.detail ?? `Erro: ${response.status}`);
    }

    return json as T;
  },

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.detail ?? `Erro: ${response.status}`);
    }

    return json as T;
  },

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`);

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.detail ?? `Erro: ${response.status}`);
    }

    return json as T;
  },

  async getWithAuth<T>(endpoint: string, token: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.detail ?? `Erro: ${response.status}`);
    }

    return json as T;
  },

  async getBlob(endpoint: string): Promise<Blob> {
    const response = await fetch(`${BASE_URL}${endpoint}`);

    if (!response.ok) {
      throw new Error(`Erro ao baixar arquivo: ${response.status}`);
    }

    return await response.blob();
  },

  async putWithAuth<T>(
    endpoint: string,
    token: string,
    data?: unknown
  ): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.detail ?? `Erro: ${response.status}`);
    }

    return json as T;
  },

  async deleteWithAuth<T>(
    endpoint: string,
    token: string
  ): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.detail ?? `Erro: ${response.status}`);
    }

    return json as T;
  },
};

