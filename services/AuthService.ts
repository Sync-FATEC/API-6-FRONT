import { BaseService } from "./BaseService";

export interface ILoginCredentials {
  email: string;
  senha: string;
}

export interface IAuthUser {
  nome: string;
  cargo: string;
  email: string;
  papel: "ADMIN" | "USER";
}

export interface IAuthResponse {
  access_token: string;
  token_type: string;
  usuario: IAuthUser;
}

const TOKEN_KEY = "visiona_auth_token";

export const AuthService = {
  async login(credentials: ILoginCredentials): Promise<IAuthResponse> {
    return BaseService.post<IAuthResponse>("/v1/auth/login", credentials);
  },

  async alterarSenha(senhaAtual: string, novaSenha: string): Promise<string> {
    const token = localStorage.getItem(TOKEN_KEY) ?? "";
    const data = await BaseService.postWithAuth<{ mensagem: string }>(
      "/v1/auth/alterar-senha",
      token,
      { senha_atual: senhaAtual, nova_senha: novaSenha }
    );
    return data.mensagem;
  },
};
