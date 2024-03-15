'use client'

import React, {useState} from "react";
import Preloader from "@/components/Preloader/Preloader";
import {useGetAllAgent} from "@/hooks/admin/admin";
import Agents from "@/components/screen/Agents/Agents";
import EditAgent from "@/components/EditAgent/EditAgent";

type AdminProps = {
    agentIdError?: Error
}

const Admin = ({agentIdError}: AdminProps) => {
    const pageSize = 30; // Количество элементов на странице
    const [offset, setOffset] = useState(0);
    const [isEditAgentModal, setIsEditAgentModal] = useState(false);
    const [editedAgentId, setEditedAgentId] = useState<number>(null);


    const {
        data,
        isFetching,
        error,
    } = useGetAllAgent(offset, pageSize);

    if (!data || isFetching) {
        return <Preloader/>;
    }

    if (error || agentIdError) {
        return <p className="text-red-600">Ошибка при получении данных</p>;
    }

    return (
        <div>
            <div className="mt-3 sm:mt-10 mx-2 sm:mx-5">
                <Agents
                    data={ data }
                    setOffset={ setOffset }
                    pageSize={ pageSize }
                    setIsEditAgentModal={ setIsEditAgentModal }
                    setEditedAgentId={ setEditedAgentId }
                    offset={offset}
                />
            </div>
            { isEditAgentModal && <EditAgent setIsModalOpen={ setIsEditAgentModal } isModalOpen={ isEditAgentModal }
                                             agentId={ editedAgentId }/> }
        </div>
    );
};

export default Admin;