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

export const AuthService = {
  async login(credentials: ILoginCredentials): Promise<IAuthResponse> {
    return BaseService.post<IAuthResponse>("/auth/login", credentials);
  },
};
