'use client'

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation'
import s from '@/components/ui/genetal-css/general.module.css'
import styles from './Driver.module.css'
import {IAllDrivers, IDriver} from "@/interfaces/types";
import Image from "next/image";
import CreateNewDriver from "@/components/CreateNewDriver/CreateNewDriver";
import {useDeleteDriver} from "@/hooks/drivers/drivers";
import TableContainer from "@material-ui/core/TableContainer";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField
} from '@material-ui/core';
import {renderPagination} from "@/utils/tablePagitaion";

const formatStatus = (status: number) => {
    switch (status) {
        case 2:
            return 'Работает';
        case 1:
            return 'Уволен';
        case -1:
            return 'Заблокирован';
        default:
            return 'Неизвестно';
    }
};

export const formatWorkUsl = (workUsl: string) => {
    switch (workUsl) {
        case 'fiz':
            return 'Физлицо';
        case 'self':
            return 'самозанятый';
        case 'ip':
            return 'ИП';
        case 'ООО':
            return 'ооо';
        default:
            return 'Неизвестно';
    }
};

const formatState = (state: number) => {
    switch (state) {
        case 1:
            return 'Оффлайн';
        case 2:
            return 'На линии';
        case 3:
            return 'Занят';
        default:
            return 'Неизвестно';
    }
};

interface DriversTableProps {
    data: IAllDrivers
    setOffset: React.Dispatch<React.SetStateAction<number>>
    offset: number
    pageSize: number
    setEditedDriverId: React.Dispatch<React.SetStateAction<number | null>>
    setIsEditDriverModal: React.Dispatch<React.SetStateAction<boolean>>
}

const DriversTable = ({
                          data,
                          offset,
                          setOffset,
                          pageSize,
                          setIsEditDriverModal,
                          setEditedDriverId
                      }: DriversTableProps) => {


    const router = useRouter()

    const [filter, setFilter] = useState({
        fullName: '',
        telephone: '',
        workUsl: '',
        status: '',
        lastOrderDate: '',
    });
    const isFilterActive =
        filter.fullName ||
        filter.telephone ||
        filter.workUsl ||
        filter.status ||
        filter.lastOrderDate;
    const [isCreateNewDriverModal, setIsCreateNewDriverModal] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredDrivers, setFilteredDrivers] = useState(() => []);

    const handleFilterChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>, column: string) => {
        setFilter({...filter, [column]: e.target.value});
    };

    useEffect(() => {
        handleFilter()
    }, []);

    const handleFilter = () => {
        if (!filter.status && !filter.workUsl && !filter.telephone && !filter.fullName && !filter.lastOrderDate) {
            setFilteredDrivers(data.drivers);
        }

        setOpenModal(false);
        setOpenModal(false)
        const filteredData = data.drivers.filter((item: IDriver) => {
            const fullName = `${ item.surname } ${ item.name } ${ item.patronymic }`

            return (
                fullName.toLowerCase().includes(filter.fullName.toLowerCase()) &&
                item.workUsl.toLowerCase().includes(filter.workUsl.toLowerCase()) &&
                item.lastOrderDate.toLowerCase().includes(filter.lastOrderDate.toLowerCase()) &&
                item.telephone.toString().includes(filter.telephone) &&
                item.status.toString().toLowerCase().includes(filter.status.toLowerCase())
            )
        }).slice(offset, offset + pageSize);
        setFilteredDrivers(filteredData);
    }

    const handleAddDriver = () => {
        setIsCreateNewDriverModal(true)
    };

    const handleChangePage = (page: number) => {
        const newOffset = (page - 1) * pageSize;
        setOffset(newOffset);
        setCurrentPage(page);
    };

    const total = data.total

    const handleEditDriver = (item: IDriver) => {
        if (item.status === -1) {
        } else {
            setEditedDriverId(item.driverId)
            setIsEditDriverModal(true)
        }
    }

    const handleResetFilter = () => {
        setFilter({
            fullName: '',
            telephone: '',
            workUsl: '',
            status: '',
            lastOrderDate: '',
        })
    };

    const handleDriverDelete = useDeleteDriver()

    return (
        <div className={ `border-l-3 border-emerald-200/50 ${ styles.border_l }` }>
            <h2 className="text-center text-2xl font-bold mb-4">Водители</h2>
            <div className='sm:m-3 text-right'>
                <button className={ `mr-2 sm:mr-5 ${ s.BaseButton }` } onClick={ () => setOpenModal(true) }>
                    Фильтровать
                </button>
                <button className={ s.BaseButton } type='submit' onClick={ handleAddDriver }>
                    Добавить водителя
                </button>
            </div>
            <TableContainer component={ Paper }>
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <p className='text-black/50 text-lg'>ФИО</p>
                                </TableCell>
                                <TableCell>
                                    <p className='text-black/50 text-lg'>Телефон</p>
                                </TableCell>
                                <TableCell>
                                    <p className='text-black/50 text-lg'>Условия работы</p>
                                </TableCell>
                                <TableCell>
                                    <p className='text-black/50 text-lg'>Статус</p>
                                </TableCell>
                                <TableCell>
                                    <p className='text-black/50 text-lg'>Состояние</p>
                                </TableCell>
                                <TableCell>
                                    <p className='text-black/50 text-lg'>Баланс</p>
                                </TableCell>
                                <TableCell>
                                    <p className='text-black/50 text-lg'>Дата последнего заказа</p>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            { filteredDrivers && filteredDrivers.length > 0 ?
                                filteredDrivers.map((item: IDriver) => (
                                    <TableRow key={ item.driverId }
                                              onDoubleClick={ () => router.push(`/drivers/${ item.driverId }`) }>
                                        <TableCell onClick={ () => router.push(`/drivers/${ item.driverId }`) }>
                                            <p className='text-blue-600 cursor-pointer sm:text-black sm:border-none sm:cu'>{ `${ item.surname } ${ item.name } ${ item.patronymic }` }</p>
                                        </TableCell>
                                        <TableCell>{ item.telephone }</TableCell>
                                        <TableCell>{ formatWorkUsl(item.workUsl) }</TableCell>
                                        <TableCell>{ formatStatus(item.status) }</TableCell>
                                        <TableCell>{ formatState(item.state) }</TableCell>
                                        <TableCell>{ item.balance }</TableCell>
                                        <TableCell>{ item.lastOrderDate.split('T')[0] }</TableCell>
                                        <TableCell>
                                            <div className={ styles.buttonContainer }>
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    className={ styles.editButton }
                                                    onClick={ () => handleEditDriver(item) }
                                                >
                                                    <Image src="/edit.svg" alt="edit" width={ 20 } height={ 20 }/>
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="secondary"
                                                    className={ styles.deleteButton }
                                                    onClick={ () => handleDriverDelete(item.driverId) }
                                                >
                                                    <Image src="/remove.svg" alt="delete" width={ 20 } height={ 20 }/>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={ 7 } align="center">
                                            Нет данных
                                        </TableCell>
                                    </TableRow>
                                ) }
                        </TableBody>
                    </Table>
                </Paper>
            </TableContainer>
            <Dialog open={ openModal } onClose={ () => setOpenModal(false) } aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Фильтр</DialogTitle>
                <DialogContent>
                    <div className='mx-5 gap-3 sm:gap-5'>
                        <TextField
                            label="ФИО"
                            value={ filter.fullName }
                            onChange={ (e) => handleFilterChange(e, 'fullName') }
                            className='w-full'
                        />

                        <TextField
                            label="Телефон"
                            value={ filter.telephone }
                            onChange={ (e) => handleFilterChange(e, 'telephone') }
                            className='w-full'
                        />
                        <div className='mt-3 sm:mt-5'></div>
                        <TextField
                            select
                            label="Статус"
                            value={ filter.status }
                            className='w-full'
                            InputLabelProps={ {
                                shrink: true,
                            } }
                            onChange={ (e) => handleFilterChange(e, 'status') }
                        >
                            <MenuItem value="">Все</MenuItem>
                            <MenuItem value="2">Работает</MenuItem>
                            <MenuItem value="1">Уволен</MenuItem>
                            <MenuItem value="-1">Заблокирован</MenuItem>

                        </TextField>
                        <div className='mt-3 sm:mt-5'></div>
                        <TextField
                            select
                            label="Условия работы"
                            value={ filter.workUsl }
                            className='w-full'
                            InputLabelProps={ {
                                shrink: true,
                            } }
                            onChange={ (e) => handleFilterChange(e, 'workUsl') }
                        >
                            <MenuItem value="">Все</MenuItem>
                            <MenuItem value="fiz">Физлицо</MenuItem>
                            <MenuItem value="self">Самозанятый</MenuItem>
                            <MenuItem value="ip">ИП</MenuItem>
                            <MenuItem value="OOO">ООО</MenuItem>
                        </TextField>
                        <div className='mt-3 sm:mt-5'></div>
                        <TextField
                            label="Дата последнего заказа"
                            type="date"
                            className='w-full'
                            value={ filter.lastOrderDate }
                            onChange={ (e) => handleFilterChange(e, 'lastOrderDate') }
                            InputLabelProps={ {
                                shrink: true,
                            } }
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <div className='flex flex-col sm:flex-row sm:gap-5 flex-wrap'>
                        <button
                            className={ `${ s.BaseButton } ${
                                isFilterActive ? '' : 'hidden'
                            }` }
                            onClick={ handleResetFilter }
                        >
                            Сбросить фильтр
                        </button>
                        <button className={ s.BaseButton } onClick={ () => setOpenModal(false) }>
                            Отменить
                        </button>
                        <button className={ s.BaseButton } onClick={ handleFilter }>
                            Применить
                        </button>
                    </div>
                </DialogActions>
            </Dialog>
            { isCreateNewDriverModal &&
                <CreateNewDriver setIsModalOpen={ setIsCreateNewDriverModal } isModalOpen={ isCreateNewDriverModal }/> }
            { renderPagination(currentPage, total, pageSize, handleChangePage) }
        </div>
    )
}

export default DriversTable