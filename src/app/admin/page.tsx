'use client'

import Cookies from "js-cookie";
import {useRouter} from "next/navigation";
import React, {useEffect} from "react";
import Layout from "@/components/Layout/Layout";
import Admin from "@/components/screen/Admin/Admin";

const AdminPage = () => {
    const router = useRouter()
    const token = Cookies.get('token')

    // const {
    //     data,
    //     isFetching,
    //     error ,
    // } = useGetAgentId();
    //
    // if (!data || isFetching) {
    //     return <Preloader/>;
    // }

    useEffect(() => {
        if (!token) {
            router.push('/login')
        }
        // if (data.admin === -1) {
        //     router.push('/')
        // }
    }, []);

    return  (
        <Layout>
            {/*<Admin agentIdError={error}/>*/}
            <Admin/>
        </Layout>
    )
}

export default AdminPage