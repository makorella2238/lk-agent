import {useQuery} from "@tanstack/react-query";
import {mainService} from "@/services/main.service";
import {IPaymentsAgent} from "@/interfaces/types";
import {useGetAllDriversForFiltration} from "@/hooks/drivers/drivers";

export const useGetPaymentsAgent = () => {
    return useQuery<IPaymentsAgent>({
        queryKey: ['getPaymentsAgent'],
        queryFn: async () => {
            return mainService.getPaymentsAgent();
        },
    })
}
export const useGetPaymentsAgentForFiltration = (enabledFilter: boolean, filter_dateRequestPayment1?: string, filter_dateRequestPayment2?: string, filter_status?: string) => {
    return useQuery<IPaymentsAgent>({
        queryKey: ['getPaymentsAgentWithFiltration', filter_dateRequestPayment1, filter_dateRequestPayment2, filter_status],
        queryFn: async () => {
            return mainService.getPaymentsAgent(filter_dateRequestPayment1, filter_dateRequestPayment2, filter_status);
        },
        enabled: enabledFilter
    })
}