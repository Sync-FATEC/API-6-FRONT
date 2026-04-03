export interface IScheduleUpdateRequest {
  data: string;
  hora: string;
}

export interface IScheduleUpdateResponse {
  mensagem: string;
  agendado_para: string;
}
