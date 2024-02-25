'use client'

import DetailOrder from "@/components/screen/DetailOrder/DetailOrder";
import {useSelector} from "react-redux";
import {getIsAuth} from "@/Redux/app/app-selector";
import {useParams, useRouter} from "next/navigation";
import {useGerOrderDetail} from "@/hooks/drivers/drivers";
import Preloader from "@/components/Preloader/Preloader";
import React, {useEffect} from "react";
import Cookies from "js-cookie";
import Layout from "@/components/Layout/Layout";

const OrderDetailPage = () => {
    const router = useRouter()
    const token = Cookies.get('token')
    useEffect(() => {
        if (!token) {
            router.push('/login')
        }
    }, [token]);
    // const {push} = useRouter()
    // const token = Cookies.get('token')
    // if (!token) {
    //     push('/login')
    // }
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
        <Layout>
            <DetailOrder data={data}/>
        </Layout>
    );
}

export default OrderDetailPage