'use client'

import {useRouter} from "next/navigation";
import Cookies from "js-cookie";
import {useEffect} from "react";
import Layout from "@/components/Layout/Layout";
import AllDriverAnalytics from "@/components/screen/AllDriverAnalytics/AllDriverAnalytics";

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
            <AllDriverAnalytics/>
        </Layout>
    );
}

export default AnalyticsPage