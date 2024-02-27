'use client'

import Payments from "@/components/Payments/Payments";
import React, {useEffect} from "react";
import {useGetPaymentsAgent} from "@/hooks/payments/payments";
import Preloader from "@/components/Preloader/Preloader";
import {useRouter} from "next/navigation";
import Cookies from "js-cookie";
import Layout from "@/components/Layout/Layout";

type PaymentsPageProps = {
    agentId: number
}

function PaymentsContainer({agentId}: PaymentsPageProps) {
    debugger
    const router = useRouter()
    const token = Cookies.get('token')
    useEffect(() => {
        if (!token) {
            router.push('/login')
        }
    }, [token]);

    const {
        data: paymentsAgentData,
        isFetching: paymentsAgentIsFetching,
        error: paymentsAgentError,
    } = useGetPaymentsAgent(agentId);

    if (!paymentsAgentData || paymentsAgentIsFetching) {
        return <Preloader/>;
    }

    if (paymentsAgentError) {
        return <p className="text-red-600">Ошибка при получении данных</p>;
    }

    return (
        <Layout>
            <div className='mx-5 mt-10'>
                <Payments data={ paymentsAgentData }/>
            </div>
        </Layout>
    );
}

export default PaymentsContainer;