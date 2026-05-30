import { IAgendamentoResponse, ICreatedScheduleResponse, IScheduleUpdateRequest, IScheduleUpdateResponse } from "@/interfaces/services/ScheduleService";
import { BaseService } from "./BaseService";
import { TOKEN_KEY } from "@/constants/auth";

export const ScheduleService = {
  list(): Promise<IAgendamentoResponse[]> {
    const token = localStorage.getItem(TOKEN_KEY) ?? "";
    return BaseService.getWithAuth<IAgendamentoResponse[]>("/v1/agendamentos/", token);
  },

  cancelarComRecorrencias(id: number): Promise<IAgendamentoResponse> {
    const token = localStorage.getItem(TOKEN_KEY) ?? "";
    return BaseService.postWithAuth<IAgendamentoResponse>(`/v1/agendamentos/${id}/cancelar`, token, {});
  },

  scheduleUpdate(data: IScheduleUpdateRequest): Promise<IScheduleUpdateResponse> {
    const token = localStorage.getItem(TOKEN_KEY) ?? "";
    const horario = data.horario ?? data.hora ?? "02:00";
    const dataInicio = data.data_inicio ?? data.data;
    const payload = {
      intervalo: data.intervalo ?? 1,
      unidade: data.unidade ?? "semana",
      horario,
      etapa: data.etapa ?? "full",
      ...(dataInicio ? { data_inicio: dataInicio } : {}),
    };

    return BaseService.postWithAuth<ICreatedScheduleResponse>("/v1/agendamentos", token, payload).then(
      (resp) => ({
        mensagem: `Agendamento ${resp.id} criado com sucesso.`,
        agendado_para: dataInicio ? `${dataInicio}T${horario}` : horario,
      }),
    );
  },
};
