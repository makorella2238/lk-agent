'use client'

import DetailOrder from "@/components/screen/DetailOrder/DetailOrder";
import {useSelector} from "react-redux";
import {getIsAuth} from "@/Redux/app/app-selector";
import {useParams, useRouter} from "next/navigation";
import {useGerOrderDetail} from "@/hooks/drivers/drivers";
import Preloader from "@/components/Preloader/Preloader";
import React from "react";
import Cookies from "js-cookie";

const OrderDetailPage = () => {
    const {push} = useRouter()
    const token = Cookies.get('token')
    if (!token) {
        push('/login')
    }
    const params = useParams()

    // @ts-ignore
    const {data, isFetching, error} = useGerOrderDetail(params.driverId, params.orderId)

    if (isFetching || !data) {
        return <Preloader/>
    }

    if (error) {
        return <p className="text-red-600">Ошибка при получении данных</p>;
    }


    return (
        <div>
            <DetailOrder data={data}/>
        </div>
    );
}

export default OrderDetailPage