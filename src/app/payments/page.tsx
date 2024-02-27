'use client'

import React, {useEffect} from "react";
import Preloader from "@/components/Preloader/Preloader";
import {useRouter} from "next/navigation";
import Cookies from "js-cookie";
import PaymentsContainer from "@/components/Payments/PaymentsContainer";
import {useGetAgentId} from "@/hooks/drivers/drivers";

function PaymentsPage() {
    const router = useRouter()
    const token = Cookies.get('token')
    useEffect(() => {
        if (!token) {
            router.push('/login')
        }
    }, [token]);

    const {
        data,
        isFetching,
        error,
    } = useGetAgentId();
    debugger
    if (!data || isFetching) {
        return <Preloader/>;
    }

    if (error) {
        return <p className="text-red-600">Ошибка при получении данных</p>;
    }

    return (
        <PaymentsContainer agentId={ data.agentId }/>
    );
}

export default PaymentsPage;