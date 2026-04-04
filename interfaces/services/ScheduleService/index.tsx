export interface IScheduleUpdateRequest {
  data?: string;
  hora?: string;
  data_inicio?: string;
  horario?: string;
  intervalo?: number;
  unidade?: "minuto" | "hora" | "dia" | "semana" | "mes";
}

export interface IScheduleUpdateResponse {
  mensagem: string;
  agendado_para: string;
}

export interface ICreatedScheduleResponse {
  id: number;
  intervalo: number;
  unidade: string;
  horario: string;
  cron_expressao: string;
}