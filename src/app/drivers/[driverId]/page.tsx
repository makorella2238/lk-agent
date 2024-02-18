'use client'

import DriversDetail from "@/components/screen/DriverDetail/DriversDetail";
import {useSelector} from "react-redux";
import {getIsAuth} from "@/Redux/app/app-selector";
import {useParams, usePathname, useRouter} from "next/navigation";
import React, {useState} from "react";
import s from "@/components/ui/genetal-css/general.module.css";
import {useGetCarInfo, useGetDriversInfo} from "@/hooks/drivers/drivers";
import {IAddEditDriver} from "@/interfaces/types";
import Preloader from "@/components/Preloader/Preloader";
import Cookies from "js-cookie";

const DetailPage = () => {
    const {push} = useRouter()
    const token = Cookies.get('token')
    if (!token) {
        push('/login')
    }

    const params = useParams()
    const pathName = usePathname()
    const router = useRouter()

    // @ts-ignore
    const {data: driverInfoData, isFetching: driverInfoFetching, error: driverInfoError} = useGetDriversInfo(params.driverId)
    const {data: carInfoData, isLoading: carInfoFetching, error: carInfoError} = useGetCarInfo(params.driverId)

    if (!driverInfoData || !carInfoData || driverInfoFetching || carInfoFetching) {
        return <Preloader/>
    }
    if (driverInfoError || carInfoError) {
        return  <p className='text-red-600'>Ошибка при получении данных</p>
    }

    return (
        <div>
            <div className='flex flex-col sm:flex-row sm:justify-center gap-1 lg:gap-8 mx-5'>
                <button type="submit" className={ s.BaseButton }
                        onClick={ () => router.push(`${ pathName }/orders`) }>Перейти к заказам водителя
                </button>
                <button type="submit" className={ s.BaseButton }
                        onClick={ () => router.push(`${ pathName }/transactions`) }>Перейти к истории баланса
                    водителя
                </button>
                <button type="submit" className={ s.BaseButton }
                        onClick={ () => router.push(`${ pathName }/analytics`) }>Перейти к аналитике водителя
                </button>
            </div>
            <DriversDetail driverInfoData={driverInfoData} carInfoData={carInfoData}/>
        </div>
    );
}

export default DetailPage