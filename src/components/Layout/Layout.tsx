import Header from "@/components/Layout/Header/Header";
import {useGetAgentIdAlways} from "@/hooks/drivers/drivers";
import Preloader from "@/components/Preloader/Preloader";
import React from "react";

function Layout({children}) {
    const {data, isFetching, error} = useGetAgentIdAlways()

    if (isFetching && !data) {
        return <Preloader/>
    }

    if (error) {
        return <h2>Произошла ошибка, попробуйте перезагрузить страницу</h2>
    }

    return (
        <>
            <Header admin={data.admin}/>
            <main className='mt-4 sm:mt-10'>
                { children }
            </main>
        </>
    )
}

export default Layout