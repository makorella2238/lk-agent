'use client'

import DriverAnalytics from "@/components/screen/DriverAnalytics/DriverAnalytics";
import {useRouter} from "next/navigation";
import Cookies from "js-cookie";
import {useEffect} from "react";
import Layout from "@/components/Layout/Layout";

const AnalyticsPage = () => {
    const router = useRouter()
    const token = Cookies.get('token')
    useEffect(() => {
        if (!token) {
            router.push('/login')
        }
    }, [token]);
    return (
        <Layout>
            <DriverAnalytics/>
        </Layout>
    );
}

export default AnalyticsPage