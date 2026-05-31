import {
  IAgendamentoResponse,
  ICreatedScheduleResponse,
  IScheduleUpdateRequest,
  IScheduleUpdateResponse,
} from "@/interfaces/services/ScheduleService";
import { BaseService } from "./BaseService";
import { TOKEN_KEY } from "@/constants/auth";

const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) ?? "" : "";

export const ScheduleService = {
  list(): Promise<IAgendamentoResponse[]> {
    const token = getToken();
    return BaseService.getWithAuth<IAgendamentoResponse[]>(
      `/v1/agendamentos/?_=${Date.now()}`,
      token
    );
  },

  cancelarComRecorrencias(id: number): Promise<IAgendamentoResponse> {
    const token = getToken();
    return BaseService.postWithAuth<IAgendamentoResponse>(
      `/v1/agendamentos/${id}/cancelar/?_=${Date.now()}`,
      token,
      {}
    );
  },

  scheduleUpdate(data: IScheduleUpdateRequest): Promise<IScheduleUpdateResponse> {
    const token = getToken();
    const horario = data.horario ?? data.hora ?? "02:00";
    const dataInicio = data.data_inicio ?? data.data;

    const payload = {
      intervalo: data.intervalo ?? 1,
      unidade: data.unidade ?? "semana",
      horario,
      etapa: data.etapa ?? "full",
      ...(dataInicio ? { data_inicio: dataInicio } : {}),
    };

    return BaseService.postWithAuth<ICreatedScheduleResponse>(
      `/v1/agendamentos/?_=${Date.now()}`,
      token,
      payload
    ).then((resp) => ({
      mensagem: `Agendamento ${resp.id} criado com sucesso.`,
      agendado_para: dataInicio ? `${dataInicio}T${horario}` : horario,
    }));
  },
};