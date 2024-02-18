'use client'

import DriverAnalytics from "@/components/screen/DriverAnalytics/DriverAnalytics";
import {useRouter} from "next/navigation";
import Cookies from "js-cookie";
import {useEffect} from "react";

const AnalyticsPage = () => {
    const router = useRouter()
    const token = Cookies.get('token')
    useEffect(() => {
        if (!token) {
            router.push('/login')
        }
    }, [token]);
    return (
        <div>
            <DriverAnalytics/>
        </div>
    );
}

export default AnalyticsPage