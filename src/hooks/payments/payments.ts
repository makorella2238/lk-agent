import {useQuery} from "@tanstack/react-query";
import {mainService} from "@/services/main.service";
import {IPaymentsAgent} from "@/interfaces/types";

export const useGetPaymentsAgent = (agentId: number) => {
    debugger
    return useQuery<IPaymentsAgent>({
        queryKey: ['getPaymentsAgent'],
        queryFn: async () => {
            return mainService.getPaymentsAgent(agentId);
        },
    })
}