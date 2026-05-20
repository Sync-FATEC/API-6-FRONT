import { BaseService } from "./BaseService";
import { TOKEN_KEY } from "@/constants/auth";
export interface ILoginCredentials {
  email: string;
  senha: string;
}

export interface IAuthUser {
  id: number;
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

export interface ICadastroUsuarioPayload {
  nome: string;
  cargo: string;
  email: string;
  senha: string;
  papel: "ADMIN" | "USER";
}

export const AuthService = {
  async login(credentials: ILoginCredentials): Promise<IAuthResponse> {
    return BaseService.post<IAuthResponse>(
      "/v1/auth/login",
      credentials
    );
  },

  async cadastrarUsuario(
    payload: ICadastroUsuarioPayload
  ): Promise<IAuthResponse> {
    const token = localStorage.getItem(TOKEN_KEY) ?? "";

    return BaseService.postWithAuth<IAuthResponse>(
      "/v1/auth/cadastro",
      token,
      payload
    );
  },

  async alterarSenha(
    senhaAtual: string,
    novaSenha: string
  ): Promise<string> {
    const token = localStorage.getItem(TOKEN_KEY) ?? "";

    const data = await BaseService.postWithAuth<{ mensagem: string }>(
      "/v1/auth/alterar-senha",
      token,
      {
        senha_atual: senhaAtual,
        nova_senha: novaSenha,
      }
    );

    return data.mensagem;
  },

  async excluirUsuario(usuarioId: number): Promise<string> {
    const token = localStorage.getItem(TOKEN_KEY) ?? "";

    const data = await BaseService.deleteWithAuth<{ mensagem: string }>(
      `/v1/auth/usuarios/${usuarioId}`,
      token
    );

    return data.mensagem;
  },
};