'use client'

import Home from "@/components/screen/Home/Home";
import Cookies from "js-cookie";
import {useRouter} from "next/navigation";
import React, {useEffect} from "react";
import Layout from "@/components/Layout/Layout";
import {useGetAgentId} from "@/hooks/drivers/drivers";
import Preloader from "@/components/Preloader/Preloader";

const HomePage = () => {
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
        error ,
    } = useGetAgentId();

    if (!data || isFetching) {
        return <Preloader/>;
    }

    return  (
        <Layout>
            <Home agentIdError={error} agentId={data.agentId}/>
        </Layout>
    )
}

export default HomePage