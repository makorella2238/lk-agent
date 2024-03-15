'use client'

import React, {useState} from 'react';
import {useRouter} from 'next/navigation'
import s from '@/components/ui/genetal-css/general.module.css'
import {IAllDrivers, IDriver} from "@/interfaces/types";
import Image from "next/image";
import CreateNewDriver from "@/components/CreateNewDriver/CreateNewDriver";
import {useDeleteDriver, useGetAllDriversForFiltration} from "@/hooks/drivers/drivers";
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
import {formatDate, formatPrice} from "@/utils/formateData";
import DeleteItemModal from "@/components/ui/DeleteItemModal/DeleteItemModal";
import Cookies from "js-cookie";
import {useQueryClient} from "@tanstack/react-query";
import Preloader from "@/components/Preloader/Preloader";
import {useForm} from "react-hook-form";

export const formatStatus = (status: number) => {
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
            return 'Самозанятый';
        case 'ip':
            return 'ИП';
        case 'ooo':
            return 'ООО';
        default:
            return 'Неизвестно';
    }
};

export const formatState = (state: number) => {
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
    pageSize: number
    setEditedDriverId: React.Dispatch<React.SetStateAction<number | null>>
    offset: number
    setIsEditDriverModal: React.Dispatch<React.SetStateAction<boolean>>
}

const DriversTable = ({
                          data,
                          setOffset,
                          pageSize,
                          setIsEditDriverModal,
                          setEditedDriverId,
                          offset
                      }: DriversTableProps) => {
    const queryClient = useQueryClient();
    const router = useRouter()
    const {register, handleSubmit, watch} = useForm()

    const [filter, setFilter] = useState({
        filter_surname: '',
        filter_name: '',
        filter_patronymic: '',
        filter_telephone: '',
        filter_workUsl: '',
        filter_status: '',
    });
    const isFilterActive =
        filter.filter_name ||
        filter.filter_surname ||
        filter.filter_patronymic ||
        filter.filter_telephone ||
        filter.filter_workUsl ||
        filter.filter_status
    const [isCreateNewDriverModal, setIsCreateNewDriverModal] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [enabledFilter, setEnabledFilter] = useState(false);
    const [isFilterData, setIsFilterData] = useState(false);
    const [driverDeleteModal, setDriverDeleteModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteDriverId, setDeleteDriverId] = useState(null);

    const handleDeleteDriver = useDeleteDriver()
    const {
        data: getAllDriversForFiltrationData,
        isFetching: getAllDriversForFiltrationIsFetching,
        error: getAllDriversForFiltrationError
    } = useGetAllDriversForFiltration(offset, pageSize, enabledFilter, filter.filter_surname, filter.filter_name, filter.filter_patronymic, filter.filter_telephone, filter.filter_status, filter.filter_workUsl)
    if (getAllDriversForFiltrationIsFetching) {
        return <Preloader/>
    }

    if (getAllDriversForFiltrationError) {
        return <p className="text-red-600">Ошибка при получении данных</p>;
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
        if (Cookies.get('agentId') || item.status !== -1) {
            setEditedDriverId(item.driverId)
            setIsEditDriverModal(true)
        }
    }

    const handleResetFilter = () => {
        setFilter({
            filter_surname: '',
            filter_name: '',
            filter_patronymic: '',
            filter_telephone: '',
            filter_workUsl: '',
            filter_status: '',
        })
        queryClient.invalidateQueries({queryKey: ['getAllDrivers']})
        setIsFilterData(false)
    };

    const driverCloseModal = () => {
        setDriverDeleteModal(false)
    }

    function handleFilter(data: {filter_surname: string, filter_name: string, filter_patronymic: string, filter_telephone: string, filter_status: string, filter_workUsl: string}) {
        setFilter({...data})
        setEnabledFilter(true)
        setIsFilterData(true)
        setOpenModal(false)
    }

    const filter_workUslValue  = watch('filter_workUsl')
    const filter_statusValue  = watch('filter_status')

    return (
        <div className='border-l-3 border-emerald-200/50'>
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
                            { (isFilterData
                                ? getAllDriversForFiltrationData && getAllDriversForFiltrationData.drivers && getAllDriversForFiltrationData.drivers.length > 0 && getAllDriversForFiltrationData.drivers
                                : data && data.drivers && data.drivers.length > 0 && data.drivers)?.map((item: IDriver) => (
                                <TableRow
                                    key={ item.driverId }
                                    onClick={ () => router.push(`/drivers/${ item.driverId }`) }
                                    className='hover:bg-gray-100 cursor-pointer'
                                >
                                    <TableCell>
                                        { `${ item.surname } ${ item.name } ${ item.patronymic }` }
                                    </TableCell>
                                    <TableCell>{ item.telephone }</TableCell>
                                    <TableCell>{ formatWorkUsl(item.workUsl) }</TableCell>
                                    <TableCell>{ formatStatus(item.status) }</TableCell>
                                    <TableCell>{ formatState(item.state) }</TableCell>
                                    <TableCell>{ formatPrice(item.balance) }</TableCell>
                                    <TableCell>{ item.lastOrderDate.split('T')[0] === '0001-01-01' ? '' : formatDate(item.lastOrderDate) }</TableCell>
                                    <TableCell>
                                        <div className={ s.buttonContainer }>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                className={ s.editButton }
                                                onClick={ (event) => {
                                                    event.stopPropagation();
                                                    handleEditDriver(item);
                                                } }
                                            >
                                                <Image src="/edit.svg" alt="edit" width={ 20 } height={ 20 }/>
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                className={ s.deleteButton }
                                                onClick={ (event) => {
                                                    event.stopPropagation();
                                                    setDriverDeleteModal(true)
                                                    setDeleteDriverId(item.driverId)
                                                } }
                                            >
                                                <Image src="/remove.svg" alt="delete" width={ 20 } height={ 20 }/>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )) }
                            { !isFilterData
                                ? (!data || !data.drivers || data.drivers.length < 1)
                                : (!getAllDriversForFiltrationData || !getAllDriversForFiltrationData.drivers || getAllDriversForFiltrationData.drivers.length < 1) && (
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
            <Dialog open={ openModal } onClose={ () => setOpenModal(false) } aria-labelledby="form-dialog-title"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSubmit(handleFilter)();
                        }
                    }}>
                <DialogTitle id="form-dialog-title">Фильтр</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit(handleFilter)}>
                        <div className='mx-5 gap-3 sm:gap-5'>
                            <TextField
                                label="Фамилия"
                                { ...register('filter_surname') }
                                className='w-full'
                            />
                            <TextField
                                label="Имя"
                                { ...register('filter_name') }
                                className='w-full'
                            />
                            <TextField
                                label="Отчество"
                                { ...register('filter_patronymic') }
                                className='w-full'
                            />

                            <TextField
                                label="Телефон"
                                { ...register('filter_telephone') }
                                className='w-full'
                            />
                            <div className='mt-3 sm:mt-5'></div>
                            <TextField
                                select
                                label="Статус"
                                className='w-full'
                                value={filter_statusValue}
                                defaultValue=''
                                { ...register('filter_status') }
                                InputLabelProps={ {
                                    shrink: true,
                                } }
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
                                className='w-full'
                                defaultValue=''
                                value={filter_workUslValue}
                                { ...register('filter_workUsl') }
                                InputLabelProps={ {
                                    shrink: true,
                                } }
                            >
                                <MenuItem value="">Все</MenuItem>
                                <MenuItem value="fiz">Физлицо</MenuItem>
                                <MenuItem value="self">Самозанятый</MenuItem>
                                <MenuItem value="ip">ИП</MenuItem>
                                <MenuItem value="ooo">ООО</MenuItem>
                            </TextField>
                        </div>
                        <DialogActions>
                            <div className='mt-3 flex flex-col sm:flex-row sm:gap-5 flex-wrap'>
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
                                <button className={ s.BaseButton } type="submit">
                                    Применить
                                </button>
                            </div>
                        </DialogActions>
                    </form>

                </DialogContent>

            </Dialog>
            { driverDeleteModal &&
                <DeleteItemModal open={ driverDeleteModal } onClose={ driverCloseModal } itemId={ deleteDriverId }
                                 subtitle='Вы точно хотите удалить водителя?' handleDeleteItem={ handleDeleteDriver }
                                 title='Удаление водителя'/> }
            { isCreateNewDriverModal &&
                <CreateNewDriver setIsModalOpen={ setIsCreateNewDriverModal } isModalOpen={ isCreateNewDriverModal }/> }
            { renderPagination(currentPage, total, pageSize, handleChangePage) }
        </div>
    )
}

export default DriversTable