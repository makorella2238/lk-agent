'use client'

import Home from "@/components/Home/Home";
import Cookies from "js-cookie";
import {useRouter} from "next/navigation";
import React, {useEffect} from "react";
import Layout from "@/components/Layout/Layout";

const HomePage = () => {
    const router = useRouter()
    const token = Cookies.get('token')
    useEffect(() => {
        if (!token) {
            router.push('/login')
        }
    }, [token]);

    return  (
        <Layout>
            <Home/>
        </Layout>
    )
}

export default HomePage