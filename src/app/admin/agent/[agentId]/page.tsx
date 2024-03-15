'use client'

import {useParams, useRouter} from "next/navigation";
import React, {useEffect} from "react";
import s from "@/components/ui/genetal-css/general.module.css";
import Preloader from "@/components/Preloader/Preloader";
import Cookies from "js-cookie";
import Layout from "@/components/Layout/Layout";
import {useGetAgentInfo} from "@/hooks/admin/admin";
import AgentDetail from "@/components/screen/AgentDetail/AgentDetail";

const DetailPage = () => {
    const router = useRouter()
    const token = Cookies.get('token')
    useEffect(() => {
        if (!token) {
            router.push('/login')
        }
    }, [token]);

    const params = useParams()
    // @ts-ignore
    const {data, isFetching, error} = useGetAgentInfo(params.agentId)

    if (!data || isFetching ) {
        return <Preloader/>
    }
    if (error) {
        return  <p className='text-red-600'>Ошибка при получении данных</p>
    }

    return (
        <Layout>
            <div className='flex flex-col sm:flex-row sm:justify-center gap-3 lg:gap-8 mx-5'>
                <button type="submit" className={`mx-2 sm:mx-0 ${ s.BaseButton }`}
                        onClick={ () => {
                            router.push(`/`)
                            Cookies.set('agentId', params.agentId as string)
                        }}>Водители Агента
                </button>
            </div>
            <AgentDetail data={data}/>
        </Layout>
    );
}

export default DetailPage