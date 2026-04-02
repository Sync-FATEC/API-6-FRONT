import { BaseService } from "./BaseService";

export interface IScheduleUpdateRequest {
  data: string;
  hora: string;
}

export interface IScheduleUpdateResponse {
  mensagem: string;
  agendado_para: string;
}

export const ScheduleService = {
  scheduleUpdate(data: IScheduleUpdateRequest): Promise<IScheduleUpdateResponse> {
    return BaseService.post<IScheduleUpdateResponse>("/agendar-atualizacao", data);
  },
};
