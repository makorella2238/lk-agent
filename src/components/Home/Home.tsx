'use client'

import React, {useState} from "react";
import Drivers from "@/components/screen/Drivers/Drivers";
import {useGetAllDrivers} from "@/hooks/drivers/drivers";
import Preloader from "@/components/Preloader/Preloader";
import EditDriver from "@/components/EditDriver/EditDriver";
import Cookies from "js-cookie";

const Home = () => {
    const pageSize = 30;
    const [offset, setOffset] = useState(0);
    const [isEditDriverModal, setIsEditDriverModal] = useState(false);
    const [editedDriverId, setEditedDriverId] = useState<number>(null);
    const {
        data,
        isFetching,
        error,
    } = useGetAllDrivers(offset, pageSize);
    if (!data || isFetching) {
        return <Preloader/>;
    }

    if (error) {
        return <p className="text-red-600">Ошибка при получении данных</p>;
    }

    return (
        <div>
            <div className="mt-3 sm:mt-10 mx-2 sm:mx-5">
                <Drivers
                    data={ data }
                    setOffset={ setOffset }
                    pageSize={ pageSize }
                    setIsEditDriverModal={ setIsEditDriverModal }
                    setEditedDriverId={ setEditedDriverId }
                    offset={offset}
                />
            </div>
            { isEditDriverModal && <EditDriver setIsModalOpen={ setIsEditDriverModal } isModalOpen={ isEditDriverModal }
                                               driverId={ editedDriverId }/> }
        </div>
    );
};

export default Home;