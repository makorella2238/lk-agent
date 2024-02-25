'use client'

import DriversDetail from "@/components/screen/DriverDetail/DriversDetail";
import {useSelector} from "react-redux";
import {getIsAuth} from "@/Redux/app/app-selector";
import {useParams, usePathname, useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import s from "@/components/ui/genetal-css/general.module.css";
import {useGetCarInfo, useGetDriversInfo} from "@/hooks/drivers/drivers";
import {IAddEditDriver} from "@/interfaces/types";
import Preloader from "@/components/Preloader/Preloader";
import Cookies from "js-cookie";
import Layout from "@/components/Layout/Layout";

const DetailPage = () => {
    const router = useRouter()
    const token = Cookies.get('token')
    useEffect(() => {
        if (!token) {
            router.push('/login')
        }
    }, [token]);

    const params = useParams()
    const pathName = usePathname()

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
        <Layout>
            <div className='flex flex-col sm:flex-row sm:justify-center gap-1 lg:gap-8 mx-5'>
                <button type="submit" className={ s.BaseButton }
                        onClick={ () => router.push(`${ pathName }/orders`) }>Заказы водителя
                </button>
                <button type="submit" className={ s.BaseButton }
                        onClick={ () => router.push(`${ pathName }/transactions`) }>Баланс водителя
                </button>
                <button type="submit" className={ s.BaseButton }
                        onClick={ () => router.push(`${ pathName }/analytics`) }>Аналитика водителя
                </button>
            </div>
            <DriversDetail driverInfoData={driverInfoData} carInfoData={carInfoData}/>
        </Layout>
    );
}

export default DetailPage