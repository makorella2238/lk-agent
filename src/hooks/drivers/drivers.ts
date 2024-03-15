import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {mainService} from "@/services/main.service";
import {
    IAddEditDriver,
    IAllDriverOrders,
    IAllDrivers,
    ICarInfo,
    IDriverAnalytic,
    IDriverInfo,
    IDriverTransactions,
    IGetAgentId
} from "@/interfaces/types";
import {Dispatch, SetStateAction} from "react";
import {IOrderDetails} from "@/components/screen/DetailOrder/DetailOrder";

export const useGetAllDrivers = (offset: number, count: number) => {
    return useQuery<IAllDrivers>({
            queryKey: ['getAllDrivers'],
            queryFn: async () => {
                return await mainService.getAllDrivers({offset, count});
            }
        }
    )
}
export const useGetAllDriversForFiltration = ( offset: number, count: number, enabledFilter: boolean, filter_surname?: string, filter_name?: string, filter_patronymic?: string, filter_telephone?: string, filter_status?: string, filter_workUsl?: string ) => {
    return useQuery<IAllDrivers>({
            queryKey: ['getAllDriversWithFiltration', filter_surname, filter_name, filter_patronymic, filter_telephone, filter_status, filter_workUsl],
            queryFn: async () => {
                return await mainService.getAllDrivers({
                    offset,
                    count,
                    filter_name,
                    filter_surname,
                    filter_status,
                    filter_patronymic,
                    filter_workUsl,
                    filter_telephone
                });
            },
            enabled: enabledFilter
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
export const useGetAllOrdersForFiltration = (offset: number, count: number, driverId: string, enabledFilter: boolean, filter_carMark: string, filter_carModel: string, filter_status: string, filter_type: string, filter_dateTimeCourierDone1: string, filter_dateTimeCourierDone2: string) => {
    return useQuery<IAllDriverOrders>({
        queryKey: ['getAllOrdersWithFiltration', filter_carModel, filter_carMark, filter_status, filter_dateTimeCourierDone1, filter_dateTimeCourierDone2, filter_type],
        queryFn: async () => {
            return await mainService.getAllOrders({offset, count, driverId, filter_carModel, filter_carMark, filter_status, filter_type, filter_dateTimeCourierDone1, filter_dateTimeCourierDone2});
        },
        enabled: enabledFilter,

    });
};
export const useGetAgentIdAlways = () => {
    return useQuery<IGetAgentId>({
        queryKey: ['getAgentIdForHeader'],
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
export const useGetAllDriverAnalytics = (dateFrom: string, dateTo: string, enabled: boolean) => {
    return useQuery<IDriverAnalytic>({
            queryKey: ['getDriversAnalytic'],
            queryFn: async () => {
                return await mainService.getAllDriverAnalytics({dateFrom, dateTo});
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
            queryClient.invalidateQueries({queryKey: ['getDriverInfo']})
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
export const useDeleteCar = (driverId: string | string[],) => {
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
    return (carId: number) => {
        deleteCarMutation.mutate(carId)
    }
}