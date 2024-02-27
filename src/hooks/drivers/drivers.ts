import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {mainService} from "@/services/main.service";
import {
    IAddEditDriver,
    IAllDriverOrders,
    IAllDrivers,
    ICarInfo,
    IDriverAnalytic,
    IDriverInfo,
    IDriverTransactions, IGetAgentId
} from "@/interfaces/types";
import {Dispatch, SetStateAction} from "react";
import {IOrderDetails} from "@/components/screen/DetailOrder/DetailOrder";

export const useGetAllDrivers = (offset: number, count: number, agentId: number) => {
    return useQuery<IAllDrivers>({
            queryKey: ['getAllDrivers'],
            queryFn: async () => {
                // @ts-ignore
                return await mainService.getAllDrivers({offset, count, agentId});
            }
        }
    )
}
export const useGetAllOrders = (offset: number, count: number, driverId: string) => {
    return useQuery<IAllDriverOrders>({
        queryKey: ['getAllOrders'],
        queryFn: async () => {
            return await mainService.getAllOrders({offset, count, driverId});
        },
    });
};
export const useGetAgentId = () => {
    return useQuery<IGetAgentId>({
        queryKey: ['getAllOrders'],
        queryFn: async () => {
            return await mainService.getAgentId();
        },
    });
};
export const useGetDriversInfo = (driverId: number) => {
    return useQuery<IDriverInfo>({
            queryKey: ['getDriverInfo'],
            queryFn: async () => {
                return await mainService.getDriverInfo({driverId});
            },
        }
    )
}
export const useGetDriverAnalytic = (driverId: number, dateFrom: string, dateTo: string, enabled: boolean) => {
    return useQuery<IDriverAnalytic>({
            queryKey: ['getDriversAnalytic'],
            queryFn: async () => {
                return await mainService.getDriverAnalytics({driverId, dateFrom, dateTo});
            },
            enabled: enabled
        }
    )
}
export const useGerOrderDetail = (driverId: string, orderId: string) => {
    return useQuery<IOrderDetails>({
            queryKey: ['gerOrderDetail'],
            queryFn: async () => {
                return await mainService.gerOrderDetails({driverId, orderId});
            },
        }
    )
}

export const useGetDriverTransactions = (driverId: string) => {
    return useQuery<IDriverTransactions>({
            queryKey: ['пetDriverTransactions'],
            queryFn: async () => {
                return await mainService.getDriverTransactions({driverId})
            },
            refetchOnMount: true,
            refetchOnWindowFocus: true
        }
    )
}


export const useGetCarInfo = (driverId: string | string[]) => {
    return useQuery<ICarInfo>({
            queryKey: ['getCarInfo'],
            queryFn: async () => {
                // @ts-ignore
                return await mainService.getCarInfo({driverId});
            }
        }
    )
}
export const useEditDriver = (setRequestErrors: Dispatch<SetStateAction<string>>, setEditDriverLoading: Dispatch<SetStateAction<boolean>>) => {
    const queryClient = useQueryClient();

    const createNewDriver = useMutation({
        mutationKey: ['editDriver'],
        // @ts-ignore
        mutationFn: (requestData: IAddEditDriver, driverId: string) => {
            setEditDriverLoading(true)
            return mainService.editDriver({requestData, driverId})
        },
        onSuccess: () => {
            setEditDriverLoading(false)
            queryClient.invalidateQueries({queryKey: ['getAllDrivers']})
        },
        onError: (error: string) => {
            setRequestErrors(error)
            console.log(error)
        }
    })
    const handleCreateEditDriver = (requestData: IAddEditDriver, driverId: string) => {
        // @ts-ignore
        createNewDriver.mutate({requestData, driverId});
    };
    return handleCreateEditDriver
}
export const useCreateNewDriver = (setRequestErrors: Dispatch<SetStateAction<string>>, setCreateNewDriverLoading: Dispatch<SetStateAction<boolean>>) => {
    const queryClient = useQueryClient();

    const createNewDriver = useMutation({
        mutationKey: ['createNewDriver'],
        // @ts-ignore
        mutationFn: (requestData: IAddEditDriver) => {
            setCreateNewDriverLoading(true)
            return mainService.createNewDriver({requestData})
        },
        onSuccess: () => {
            setCreateNewDriverLoading(false)
            queryClient.invalidateQueries({queryKey: ['getAllDrivers']})
        },
        onError: (error: string) => {
            setRequestErrors(error)
            console.log(error)
        }
    })
    const handleCreateDriver = (requestData: IAddEditDriver) => {
        // @ts-ignore
        createNewDriver.mutate({requestData});
    };
    return handleCreateDriver
}

export const useCreateNewCar = (setRequestErrors: Dispatch<SetStateAction<string>>) => {
    const queryClient = useQueryClient();

    const createNewCar = useMutation({
        mutationKey: ['createNewCar'],
        // @ts-ignore
        mutationFn: (requestData: ICarInfo, driverId: string) => {
            return mainService.createNewCar(requestData, driverId)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['getCarInfo']})
        },
        onError: (error: string) => {
            setRequestErrors(error)
            console.log(error)
        }
    })
    const handleCreateNewCar = (requestData: ICarInfo, driverId: string) => {
        // @ts-ignore
        createNewCar.mutate({requestData, driverId});
    };
    return handleCreateNewCar
}

export const useDeleteDriver = () => {
    const queryClient = useQueryClient();

    const deleteDriverMutation = useMutation({
        mutationKey: ['deleteDriver'],
        // @ts-ignore
        mutationFn: (driverId: number) => {
            return mainService.deleteDriver(driverId)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['getAllDrivers']})
        },
    })
    const handleDeleteDriver = (driverId: number) => {
        deleteDriverMutation.mutate(driverId)
    }
    return handleDeleteDriver
}
export const useDeleteCar = (driverId: string | string[]) => {
    const queryClient = useQueryClient();

    const deleteCarMutation = useMutation({
        mutationKey: ['deleteCar'],
        // @ts-ignore
        mutationFn: (carId: number) => {
            return mainService.deleteCar(carId, driverId)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['getCarInfo']})
        },
    })
    const handleDeleteCar = (carId: number) => {
        deleteCarMutation.mutate(carId)
    }
    return handleDeleteCar
}