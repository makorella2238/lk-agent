'use client'

import React, { useState } from "react";
import Payments from "@/components/Payments/Payments";
import Drivers from "@/components/Drivers/Drivers";
import CreateNewDriver from "@/components/ui/CreateNewDriver/CreateNewDriver";
import Layout from "@/components/layout/Layout";

const HomePage = () => {


    const [isModalOpen, setIsCreateNewDriverModal] = useState(false);

    // @ts-ignore
    return (
        <Layout>
            <h1 className="font-semibold tracking-wide mt-3 mb-3 text-3xl sm:text-4xl text-center">
                Личный кабинет агента
            </h1>
            <div className="mt-10 grid grid-cols-5 gap-5">
                <Payments />
                <div className="col-span-4">
                    <Drivers setIsCreateNewDriverModal={setIsCreateNewDriverModal} />
                </div>
            </div>
            {isModalOpen && <CreateNewDriver setIsCreateNewDriverModal={setIsCreateNewDriverModal} isModalOpen={isModalOpen}/>}
        </Layout>
    );
};

export default HomePage;