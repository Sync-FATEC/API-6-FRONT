export interface IScheduleUpdateRequest {
  data?: string;
  hora?: string;
  data_inicio?: string;
  horario?: string;
  intervalo?: number;
  unidade?: "minuto" | "hora" | "dia" | "semana" | "mes";
  etapa?: string;
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

export interface IAgendamentoResponse {
  id: number;
  intervalo: number;
  unidade: string;
  horario: string;
  cron_expressao: string;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
  ultima_execucao_em: string | null;
  ultimo_status: string | null;
  ultima_mensagem: string | null;
}