'use client'

import DriverAnalytics from "@/components/screen/DriverAnalytics/DriverAnalytics";
import {useRouter} from "next/navigation";
import Cookies from "js-cookie";

const AnalyticsPage = () => {
    const {push} = useRouter()
    const token = Cookies.get('token')
    if (!token) {
        push('/login')
    }
    return (
        <div>
            <DriverAnalytics/>
        </div>
    );
}

export default AnalyticsPage