'use client'

import React, {useEffect} from "react";
import {useRouter} from "next/navigation";
import Cookies from "js-cookie";
import {useGetPaymentsAgent} from "@/hooks/payments/payments";
import Payments from "@/components/screen/Payments/Payments";
import Layout from "@/components/Layout/Layout";
import Preloader from "@/components/Preloader/Preloader";

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
    } = useGetPaymentsAgent();

    if (!data || isFetching) {
        return <Preloader/>;
    }

    if (error) {
        return <p className="text-red-600">Ошибка при получении данных</p>;
    }

    return (
        <Layout>
            <Payments data={ data }/>
        </Layout>
    );
}

export default PaymentsPage;