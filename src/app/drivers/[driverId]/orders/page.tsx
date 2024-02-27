'use client'

import OrderTable from "@/components/screen/OrderTable/OrderTable";
import {useSelector} from "react-redux";
import {getIsAuth} from "@/Redux/app/app-selector";
import {useParams, useRouter} from "next/navigation";
import {useGetAllOrders} from "@/hooks/drivers/drivers";
import Preloader from "@/components/Preloader/Preloader";
import React, {useEffect, useState} from "react";
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
    const pageSize = 30; // Количество элементов на странице
    const [offset, setOffset] = useState(0);
    // @ts-ignore
    const {data, isFetching, error} = useGetAllOrders(offset, pageSize, params.driverId)
    if (!data || isFetching) {
        return <Preloader/>
    }

    if (error) {
        return <p className="text-red-600">Ошибка при получении данных</p>;
    }

    return (
        <Layout>
            <OrderTable offset={offset} setOffset={setOffset} data={data} pageSize={pageSize}/>
        </Layout>
    );
}

export default DetailPage