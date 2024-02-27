'use client'

import React, {useState} from "react";
import Drivers from "@/components/Drivers/Drivers";
import {useGetAllDrivers} from "@/hooks/drivers/drivers";
import Preloader from "@/components/Preloader/Preloader";
import EditDriver from "@/components/EditDriver/EditDriver";

type HomeProps = {
    agentIdError: Error
    agentId: number
}

const Home = ({agentIdError, agentId}: HomeProps) => {
    const pageSize = 30; // Количество элементов на странице Drivers
    const [offset, setOffset] = useState(0);
    const [isEditDriverModal, setIsEditDriverModal] = useState(false);
    const [editedDriverId, setEditedDriverId] = useState<number>(null);

    const {
        data,
        isFetching,
        error,
    } = useGetAllDrivers(offset, pageSize, agentId);

    if (!data || isFetching) {
        return <Preloader/>;
    }

    if (error || agentIdError) {
        return <p className="text-red-600">Ошибка при получении данных</p>;
    }

    return (
        <div>
            <div className="mt-3 sm:mt-10 mx-2 sm:mx-5">
                <Drivers
                    data={ data }
                    setOffset={ setOffset }
                    offset={ offset }
                    pageSize={ pageSize }
                    setIsEditDriverModal={ setIsEditDriverModal }
                    setEditedDriverId={ setEditedDriverId }
                />
            </div>
            { isEditDriverModal && <EditDriver setIsModalOpen={ setIsEditDriverModal } isModalOpen={ isEditDriverModal }
                                               driverId={ editedDriverId }/> }
        </div>
    );
};

export default Home;