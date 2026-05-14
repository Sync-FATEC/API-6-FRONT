const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL;
const BASE_URL = ((rawBaseUrl ?? "").trim() || "http://127.0.0.1:8000/api").replace(/\/$/, "");

export const AuthService = {
  async alterarSenha(senhaAtual: string, novaSenha: string): Promise<string> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/v1/auth/alterar-senha`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ senha_atual: senhaAtual, nova_senha: novaSenha }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail ?? "Erro ao alterar senha.");
    }

    return data.mensagem as string;
  },
};
