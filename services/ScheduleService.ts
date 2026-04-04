import { BaseService } from "./BaseService";

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

interface ICreateScheduleApiResponse {
  id: number;
  intervalo: number;
  unidade: string;
  horario: string;
  cron_expressao: string;
}

export const ScheduleService = {
  scheduleUpdate(data: IScheduleUpdateRequest): Promise<IScheduleUpdateResponse> {
    const horario = data.horario ?? data.hora ?? "02:00";
    const dataInicio = data.data_inicio ?? data.data;
    const payload = {
      intervalo: data.intervalo ?? 1,
      unidade: data.unidade ?? "semana",
      horario,
      ...(dataInicio ? { data_inicio: dataInicio } : {}),
    };

    return BaseService.post<ICreateScheduleApiResponse>("/v1/agendamentos", payload).then(
      (resp) => ({
        mensagem: `Agendamento ${resp.id} criado com sucesso.`,
        agendado_para: dataInicio ? `${dataInicio}T${horario}` : horario,
      }),
    );
  },
};
