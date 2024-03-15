import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {mainService} from "@/services/main.service";
import {IAddEditAgent, IAllAgent, ICafeList} from "@/interfaces/types";
import React from "react";
import Cookies from "js-cookie";
import {useGetPaymentsAgentForFiltration} from "@/hooks/payments/payments";

export const useGetAllAgent = (offset: number, count: number) => {
    return useQuery<IAllAgent>({
            queryKey: ['getAllAgents'],
            queryFn: async () => {
                return await mainService.getAllAgents({offset, count});
            }
        }
    )
}
export const useGetAllAgentForFiltration = (offset: number, count: number, enabledFilter: boolean, filter_city: string, filter_name: string, filter_legalName: string, filter_inn: string) => {
    debugger
    return useQuery<IAllAgent>({
            queryKey: ['getAllAgentsWithFiltration', filter_name, filter_legalName, filter_inn, filter_city],
            queryFn: async () => {
                return await mainService.getAllAgents({offset, count, filter_name, filter_legalName, filter_inn, filter_city});
            },
            enabled: enabledFilter
        }
    )
}
export const useGetAgentInfo = (agentId: number) => {
    return useQuery<IAddEditAgent>({
            queryKey: ['getAgentInfo'],
            queryFn: async () => {
                return await mainService.getAgentInfo({agentId});
            },
        }
    )
}
export const useGetAgentInfoForDriverLimits = (agentId: any) => {
    return useQuery<IAddEditAgent>({
            queryKey: ['getAgentInfoForDriverLimits'],
            queryFn: async () => {
                return await mainService.getAgentInfo({agentId});
            },
            enabled: (!!Cookies.get('agentId'))
        }
    )
}

export const useGetCafeList = (type: string, enabled: boolean) => {
    return useQuery<ICafeList>({
            queryKey: ['getCafeList', type],
            queryFn: async () => {
                return await mainService.getCafeList({type});
            },
            enabled: enabled
        }
    )
}

export const useEditAgent = (setRequestErrors: React.Dispatch<React.SetStateAction<string>>, setEditAgentLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    const queryClient = useQueryClient();

    const EditAgent = useMutation({
        mutationKey: ['editDriver'],
        // @ts-ignore
        mutationFn: ({requestData, agentId}: { requestData: IAddEditAgent, agentId: number }) => {
            setEditAgentLoading(true)
            return mainService.editAgent({requestData, agentId})
        },
        onSuccess: () => {
            setEditAgentLoading(false)
            queryClient.invalidateQueries({queryKey: ['getAllAgents']})
        },
        onError: (error: string) => {
            setRequestErrors(error)
            console.log(error)
        }
    })
    const handleCreateEditDriver = ({requestData, agentId}: { requestData: IAddEditAgent, agentId: number }) => {
        // @ts-ignore
        EditAgent.mutate({requestData, agentId});
    };
    return handleCreateEditDriver
}
export const useCreateNewAgent = (setRequestErrors: React.Dispatch<React.SetStateAction<string>>, setCreateNewAgentLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    const queryClient = useQueryClient();

    const createNewAgent = useMutation({
        mutationKey: ['createNewDriver'],
        // @ts-ignore
        mutationFn: (requestData: IAddEditAgent) => {
            setCreateNewAgentLoading(true)
            return mainService.createNewAgent({requestData})
        },
        onSuccess: () => {
            setCreateNewAgentLoading(false)
            queryClient.invalidateQueries({queryKey: ['getAllAgents']})
        },
        onError: (error: string) => {
            setRequestErrors(error)
            console.log(error)
        }
    })
    const handleCreateDriver = (requestData: IAddEditAgent) => {
        // @ts-ignore
        createNewAgent.mutate({requestData});
    };
    return handleCreateDriver
}

export const useDeleteAgent = () => {
    const queryClient = useQueryClient();

    const deleteAgentMutation = useMutation({
        mutationKey: ['deleteAgent'],
        // @ts-ignore
        mutationFn: (agentId: number) => {
            return mainService.deleteAgent(agentId)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['getAllAgents']})
        },
    })
    return (agentId: number) => {
        deleteAgentMutation.mutate(agentId)
    }
}