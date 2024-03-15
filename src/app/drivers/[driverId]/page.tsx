'use client'

import DriversDetail from "@/components/screen/DriverDetail/DriversDetail";
import {useSelector} from "react-redux";
import {getIsAuth} from "@/Redux/app/app-selector";
import {useParams, usePathname, useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import s from "@/components/ui/genetal-css/general.module.css";
import { useGetAgentIdAlways, useGetCarInfo, useGetDriversInfo} from "@/hooks/drivers/drivers";
import Preloader from "@/components/Preloader/Preloader";
import Cookies from "js-cookie";
import Layout from "@/components/Layout/Layout";
import LimitsModal from "@/components/LimitsModal/LimitsModal";
import {handleAction} from "next/dist/server/app-render/action-handler";
import {useGetAgentInfoForDriverLimits} from "@/hooks/admin/admin";

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
    const [isLimitsModal, setIsLimitsModal] = useState(false)
    const [editDriverLoading, setEditDriverLoading] = useState(false);

    // @ts-ignore
    const {data: driverInfoData, isFetching: driverInfoFetching, error: driverInfoError} = useGetDriversInfo(params.driverId)
    const {data: carInfoData, isLoading: carInfoFetching, error: carInfoError} = useGetCarInfo(params.driverId)
    const {data: agentIdData, isLoading: agentIdFetching, error: agentIdError} = useGetAgentIdAlways()
    const {data: agentInfoData, isLoading: agentInfoFetching, error: agentInfoError} = useGetAgentInfoForDriverLimits(Cookies.get('agentId'))

    if (!driverInfoData || !carInfoData || driverInfoFetching || carInfoFetching || !agentIdData || agentIdFetching || agentInfoFetching) {
        return <Preloader/>
    }
    if (driverInfoError || carInfoError || agentIdError || agentInfoError) {
        return  <p className='text-red-600'>Ошибка при получении данных</p>
    }

    const handleCloseLimitsModal = () => {
        if (!editDriverLoading) {
            setIsLimitsModal(false)
        }
    }

    return (
        <Layout>
            <div className='flex flex-col sm:flex-row sm:justify-center gap-3 lg:gap-8 mx-5'>
                <button type="submit" className={ s.BaseButton }
                        onClick={ () => router.push(`${ pathName }/orders`) }>Заказы водителя
                </button>
                <button type="submit" className={ s.BaseButton }
                        onClick={ () => router.push(`${ pathName }/transactions`) }>Баланс водителя
                </button>
                <button type="submit" className={ s.BaseButton }
                        onClick={ () => router.push(`${ pathName }/analytics`) }>Аналитика водителя
                </button>
                { agentIdData.admin === -1 && agentIdData.myCouriers === 1 &&  <button type="submit" className={ s.BaseButton }
                        onClick={ () => setIsLimitsModal(true)}>Ограничения водителя
                </button>}
                { agentIdData.admin === 1 && agentInfoData && agentInfoData.myCouriers !== -1 && <button type="submit" className={ s.BaseButton }
                        onClick={ () => setIsLimitsModal(true)}>Ограничения водителя
                </button>}
            </div>
            <DriversDetail driverInfoData={driverInfoData} carInfoData={carInfoData}/>
            {isLimitsModal && <LimitsModal driverId={params.driverId} open={isLimitsModal} onClose={handleCloseLimitsModal} setEditDriverLoading={setEditDriverLoading} data={driverInfoData} /> }
            {editDriverLoading && <Preloader/>}
        </Layout>
    );
}

export default DetailPage