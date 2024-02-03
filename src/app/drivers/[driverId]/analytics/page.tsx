'use client'

import Layout from "@/components/layout/Layout";
import DriverAnalytics from "@/components/screen/DriverAnalytics/DriverAnalytics";

const AnalyticsPage = () => {
    return (
        <Layout>
            <h1 className="font-semibold tracking-wide mt-3 mb-3 text-3xl sm:text-4xl text-center">
                Личный кабинет агента
            </h1>
            <DriverAnalytics/>
        </Layout>
    );
}

export default AnalyticsPage