import { IAgendamentoResponse, ICreatedScheduleResponse, IScheduleUpdateRequest, IScheduleUpdateResponse } from "@/interfaces/services/ScheduleService";
import { BaseService } from "./BaseService";

export const ScheduleService = {
  list(): Promise<IAgendamentoResponse[]> {
    return BaseService.get<IAgendamentoResponse[]>("/v1/agendamentos/");
  },

  cancelarComRecorrencias(id: number): Promise<IAgendamentoResponse> {
    return BaseService.post<IAgendamentoResponse>(`/v1/agendamentos/${id}/cancelar`, {});
  },

  scheduleUpdate(data: IScheduleUpdateRequest): Promise<IScheduleUpdateResponse> {
    const horario = data.horario ?? data.hora ?? "02:00";
    const dataInicio = data.data_inicio ?? data.data;
    const payload = {
      intervalo: data.intervalo ?? 1,
      unidade: data.unidade ?? "semana",
      horario,
      ...(dataInicio ? { data_inicio: dataInicio } : {}),
    };

    return BaseService.post<ICreatedScheduleResponse>("/v1/agendamentos", payload).then(
      (resp) => ({
        mensagem: `Agendamento ${resp.id} criado com sucesso.`,
        agendado_para: dataInicio ? `${dataInicio}T${horario}` : horario,
      }),
    );
  },
};
