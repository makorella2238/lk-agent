'use client'

import OrderTableMokData from "@/components/screen/OrderTable/OrderTableMokData";
import Layout from "@/components/layout/Layout";

const DetailPage = () => {
    return (
        <Layout>
            <h1 className="font-bold mt-3 mb-3 text-3xl text-center text-black">
                Личный кабинет агента
            </h1>
            <OrderTableMokData/>
        </Layout>
    );
}

export default DetailPage