'use client'

import Payments from "@/components/Payments/Payments";
import React from "react";
import {useGetPaymentsAgent} from "@/hooks/payments/payments";
import Preloader from "@/components/Preloader/Preloader";
import {useRouter} from "next/navigation";
import Cookies from "js-cookie";

function LoginPage() {
    const {push} = useRouter()
    const token = Cookies.get('token')
    if (!token) {
        push('/login')
    }
    const {
        data: paymentsAgentData,
        isFetching: paymentsAgentIsFetching,
        error: paymentsAgentError,
    } = useGetPaymentsAgent();

    if ( !paymentsAgentData || paymentsAgentIsFetching) {
        return <Preloader />;
    }

    if (paymentsAgentError) {
        return <p className="text-red-600">Ошибка при получении данных</p>;
    }

    return (
        <div className='mx-5 mt-10'>
            <Payments data={paymentsAgentData} isFetching={paymentsAgentIsFetching} />
        </div>
    );
}

export default LoginPage;