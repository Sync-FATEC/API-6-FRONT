import { IScheduleUpdateRequest, IScheduleUpdateResponse } from "@/interfaces/services/ScheduleService";
import { BaseService } from "./BaseService";

export const ScheduleService = {
  scheduleUpdate(data: IScheduleUpdateRequest): Promise<IScheduleUpdateResponse> {
    return BaseService.post<IScheduleUpdateResponse>("/agendar-atualizacao", data);
  },
};
