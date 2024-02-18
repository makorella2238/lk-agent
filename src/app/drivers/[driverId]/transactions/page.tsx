'use client'

import React from "react";
import Transactions from "@/components/screen/Transaction/Transaction";
import {useSelector} from "react-redux";
import {getIsAuth} from "@/Redux/app/app-selector";
import {useParams, useRouter} from "next/navigation";
import {useGetDriverTransactions} from "@/hooks/drivers/drivers";
import Preloader from "@/components/Preloader/Preloader";

const TransactionsPage = () => {
    const params = useParams()

    // @ts-ignore
    const {data, isFetching, error} = useGetDriverTransactions(params.driverId)
    if (isFetching || !data) {
        return <Preloader/>
    }

    console.log(params.driverId)
    if (error) {
        console.log(error)
        return <p>Ошибка при получении данных</p>
    }

    return (
        <div>
            <Transactions data={data}/>
        </div>
    );
}

export default TransactionsPage