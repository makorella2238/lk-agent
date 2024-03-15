'use client'

import React, {useState} from 'react';
import {renderPagination} from "@/utils/tablePagitaion";
import {useDeleteAgent, useGetAllAgentForFiltration} from "@/hooks/admin/admin";
import DeleteItemModal from "@/components/ui/DeleteItemModal/DeleteItemModal";
import CreateNewAgent from "@/components/CreateNewAgent/CreateNewAgent";
import {useQueryClient} from "@tanstack/react-query";
import {useForm} from "react-hook-form";
import AgentsTable from "@/components/screen/Agents/AgentsTable";
import {IAllAgent} from "@/interfaces/types";
import {Dialog, DialogActions, DialogContent, DialogTitle, TextField} from '@material-ui/core';
import s from '@/components/ui/genetal-css/general.module.css'
import Preloader from "@/components/Preloader/Preloader";

interface AgentsTableProps {
    data: IAllAgent
    setOffset: React.Dispatch<React.SetStateAction<number>>
    pageSize: number
    setEditedAgentId: React.Dispatch<React.SetStateAction<number | null>>
    setIsEditAgentModal: React.Dispatch<React.SetStateAction<boolean>>
    offset: number
}

const Agents = ({
                    data,
                    setOffset,
                    pageSize,
                    setIsEditAgentModal,
                    setEditedAgentId,
                    offset
                }: AgentsTableProps) => {
    debugger
    const handleDeleteAgent = useDeleteAgent()
    const {register, handleSubmit, reset} = useForm()
    const queryClient = useQueryClient();

    const total = data.total
    const [isCreateNewAgentModal, setIsCreateNewAgentModal] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [isFilterData, setIsFilterData] = useState(false);
    debugger
    const [agentDeleteModal, setAgentDeleteModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteAgentId, setDeleteAgentId] = useState(null);
    const [enabledFilter, setEnabledFilter] = useState(false);
    const [filter, setFilter] = useState({
        city: '',
        name: '',
        legalName: '',
        inn: '',
    });

    const {
        data: filtrationData, isFetching: filtrationIsFetching, error: filtrationError
    } = useGetAllAgentForFiltration(offset, pageSize, enabledFilter, filter.city, filter.name, filter.legalName, filter.inn)

    if (filtrationIsFetching) {
        return <Preloader/>;
    }

    if (filtrationError) {
        return <p className="text-red-600">Ошибка при получении данных</p>;
    }

    const handleAddDriver = () => {
        setIsCreateNewAgentModal(true)
    };

    const handleChangePage = (page: number) => {
        const newOffset = (page - 1) * pageSize;
        setOffset(newOffset);
        setCurrentPage(page);
    };

    const handleResetFilter = () => {
        reset({
            city: '',
            name: '',
            legalName: '',
            inn: '',
        })
        queryClient.invalidateQueries({queryKey: ['getAllDrivers']})
        setOpenModal(false)
        setIsFilterData(false)
    };

    const driverCloseModal = () => {
        setAgentDeleteModal(false)
    }

    function handleFilter(data: { city: string, name: string, legalName: string, inn: string }) {
        setFilter({...data})
        setOpenModal(false)
        setIsFilterData(true)
        setEnabledFilter(true)
    }

    return (
        <div className='border-l-3 border-emerald-200/50'>
            <h2 className="text-center text-2xl font-bold mb-4">Агенты</h2>
            <div className='sm:m-3 text-right'>
                <button className={ `mr-2 sm:mr-5 ${ s.BaseButton }` } onClick={ () => setOpenModal(true) }>
                    Фильтровать
                </button>
                <button className={ s.BaseButton } type='submit' onClick={ handleAddDriver }>
                    Добавить агента
                </button>
            </div>

            { isFilterData
                ? <AgentsTable data={ filtrationData } setEditedAgentId={ setEditedAgentId }
                               setIsEditAgentModal={ setIsEditAgentModal } setAgentDeleteModal={ setAgentDeleteModal }
                               setDeleteAgentId={ setDeleteAgentId }/>
                : <AgentsTable data={ data } setEditedAgentId={ setEditedAgentId }
                               setIsEditAgentModal={ setIsEditAgentModal } setAgentDeleteModal={ setAgentDeleteModal }
                               setDeleteAgentId={ setDeleteAgentId }/>
            }

            <Dialog open={ openModal } onClose={ () => setOpenModal(false) } aria-labelledby="form-dialog-title"
                    fullWidth={ true }
                    onKeyDown={ (e) => {
                        if (e.key === 'Enter') {
                            handleSubmit(handleFilter)();
                        }
                    } }>
                <DialogTitle id="form-dialog-title">Фильтр</DialogTitle>
                <DialogContent>
                    <form onSubmit={ handleSubmit(handleFilter) }>
                        <div className='mx-5 gap-3 sm:gap-5'>
                            <TextField
                                label="Город"
                                { ...register('city') }
                                className='w-full'
                            />
                            <div className='mt-2'></div>
                            <TextField
                                label="Наименование"
                                { ...register('name') }
                                className='w-full'
                            />
                            <div className='mt-2'></div>
                            <TextField
                                label="Юридическое лицо"
                                { ...register('legalName') }
                                className='w-full'
                            />
                            <div className='mt-2'></div>
                            <TextField
                                label="ИНН"
                                { ...register('inn') }
                                className='w-full'
                            />
                        </div>
                        <DialogActions>
                            <div className='mt-3 flex flex-col sm:flex-row sm:gap-5 flex-wrap'>
                                <button
                                    className={ `${ s.BaseButton } ${
                                        isFilterData ? '' : 'hidden'
                                    }` }
                                    onClick={ handleResetFilter }
                                >
                                    Сбросить фильтр
                                </button>
                                <button className={ s.BaseButton } onClick={ () => setOpenModal(false) }>
                                    Отменить
                                </button>
                                <button className={ s.BaseButton } type='submit'>
                                    Применить
                                </button>
                            </div>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
            { agentDeleteModal &&
                <DeleteItemModal open={ agentDeleteModal } onClose={ driverCloseModal } itemId={ deleteAgentId }
                                 subtitle='Вы точно хотите удалить агента?' handleDeleteItem={ handleDeleteAgent }
                                 title='Удаление агента'/> }
            { isCreateNewAgentModal &&
                <CreateNewAgent setIsModalOpen={ setIsCreateNewAgentModal } isModalOpen={ isCreateNewAgentModal }/> }
            { renderPagination(currentPage, total, pageSize, handleChangePage) }
        </div>
    )
}

export default Agents