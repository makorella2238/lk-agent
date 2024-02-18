'use client'

import OrderTable from "@/components/screen/OrderTable/OrderTable";
import {useSelector} from "react-redux";
import {getIsAuth} from "@/Redux/app/app-selector";
import {useParams, useRouter} from "next/navigation";
import {useGetAllOrders} from "@/hooks/drivers/drivers";
import Preloader from "@/components/Preloader/Preloader";
import React, {useState} from "react";
import Cookies from "js-cookie";

const DetailPage = () => {
    const {push} = useRouter()
    const token = Cookies.get('token')
    if (!token) {
        push('/login')
    }

    const params = useParams()
    const pageSize = 5; // Количество элементов на странице
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
        <div>
            <OrderTable offset={offset} setOffset={setOffset} data={data} pageSize={pageSize}/>
        </div>
    );
}

export default DetailPage