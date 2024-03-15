'use client'

import React, {useState} from 'react';
import {
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
} from "@material-ui/core";
import {useParams, useRouter} from "next/navigation";
import {IAllDriverOrders} from "@/interfaces/types";
import TableContainer from "@material-ui/core/TableContainer";
import styles from "@/components/ui/genetal-css/general.module.css";
import s from "@/components/ui/genetal-css/general.module.css";
import {renderPagination} from "@/utils/tablePagitaion";
import {formatDateAndClock} from "@/utils/formateData";
import Image from "next/image";
import {useGetAllOrdersForFiltration} from "@/hooks/drivers/drivers";
import Preloader from "@/components/Preloader/Preloader";
import {useQueryClient} from "@tanstack/react-query";
import {useForm} from "react-hook-form";

type OrderTableMokDataProps = {
    setOffset: React.Dispatch<React.SetStateAction<number>>
    data: IAllDriverOrders
    pageSize: number
    offset: number
}

export const formatCategory = (category: string) => {
    switch (category) {
        case 'food':
            return 'Еда';
        case 'product':
            return 'Товары';
        case 'package':
            return 'Посылка';
        default:
            return 'Неизвестно';
    }
};
export const getStatusLabel = (status: number) => {
    switch (status) {
        case -4:
            return 'Отменён клиентом';
        case -3:
            return 'Отменён поддержкой сервиса';
        case -2:
            return 'Отменён курьером';
        case -1:
            return 'Отменён заведением';
        case 0:
            return 'Опубликован';
        case 1:
            return 'Курьер на пути к точке А';
        case 2:
            return 'Курьер в точке А';
        case 3:
            return 'Забран, на пути в точку Б';
        case 4:
            return 'Курьер в точке Б';
        case 5:
            return 'Отработан';
        default:
            return '';
    }
};

const OrderTable = ({data, pageSize, setOffset, offset}: OrderTableMokDataProps) => {
    const {register, handleSubmit, watch, reset} = useForm()

    const queryClient = useQueryClient();

    const router = useRouter();
    const params = useParams()

    const total = data.total
    const [openModal, setOpenModal] = useState(false);
    const [enabledFilter, setEnabledFilter] = useState(false);
    const [filter, setFilter] = useState({
        filter_carMark: '',
        filter_carModel: '',
        filter_status: '',
        filter_type: '',
        filter_dateTimeCourierDone1: '',
        filter_dateTimeCourierDone2: '',
    });

    const [currentPage, setCurrentPage] = useState(1);

    const [isFilterApplied, setIsFilterApplied] = useState(false)

    const {
        data: filtrationData, isFetching: filtrationIsFetching, error: filtrationError
        // @ts-ignore
    } = useGetAllOrdersForFiltration(offset, pageSize, params.driverId, enabledFilter, filter.filter_carMark, filter.filter_carModel, filter.filter_status, filter.filter_type, filter.filter_dateTimeCourierDone1, filter.filter_dateTimeCourierDone2)

    if (filtrationIsFetching) {
        return <Preloader/>
    }

    if (filtrationError) {
        return <p className="text-red-600">Ошибка при получении данных</p>;
    }


    const handleChangePage = (page: number) => {
        const newOffset = (page - 1) * pageSize;
        setOffset(newOffset);
        setCurrentPage(page);
    };

    function handleFilter(data: {
        enabledFilter: boolean,
        filter_carMark: string,
        filter_carModel: string,
        filter_status: string,
        filter_type: string,
        filter_dateTimeCourierDone1: string,
        filter_dateTimeCourierDone2: string
    }) {
        setFilter({...data})
        setEnabledFilter(true)
        setIsFilterApplied(true)
        setOpenModal(false)
    }

    const handleResetFilter = () => {
        reset({
            filter_carMark: '',
            filter_carModel: '',
            filter_status: '',
            filter_type: '',
            filter_dateTimeCourierDone1: '',
            filter_dateTimeCourierDone2: '',
        })
        setIsFilterApplied(false);
        queryClient.invalidateQueries({queryKey: ['getAllOrders']})
    }

    const filter_statusValue = watch('filter_status')
    const filter_typeValue = watch('filter_type')

    return (
        <div className='mx-5 relative'>
            <div className={ `absolute top-1 left-1 ${ s.BaseButton } p-2 flex  transition-colors ` }
                 onClick={ () => router.back() }>
                <Image className='sm:mr-3' src='/arrow_back.svg' alt='arrow_back' width={ 20 } height={ 20 }/>
                <p className='hidden sm:block'>Назад</p>
            </div>
            <h1 className="text-center font-bold my-3 ml-3 text-2xl ">
                Заказы
            </h1>
            <button className={ `float-right mb-2 sm:mb-4 ${ styles.BaseButton }` }
                    onClick={ () => setOpenModal(true) }>
                Фильтровать
            </button>
            <TableContainer component={ Paper }>
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Номер заказа</TableCell>
                                <TableCell>Автомобиль</TableCell>
                                <TableCell>Категория</TableCell>
                                <TableCell>Дата и время принятия</TableCell>
                                <TableCell>Дата и время подачи</TableCell>
                                <TableCell>Дата и время завершения</TableCell>
                                <TableCell>Статус</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            { (isFilterApplied
                                ? filtrationData && filtrationData.orders && filtrationData.orders.length > 0 && filtrationData.orders
                                : data && data.orders && data.orders.length > 0 && data.orders)?.map((order: any) => (
                                <TableRow key={ order.id }
                                          onClick={ () => router.push(`orders/${ order.id }`) }
                                          className='hover:bg-gray-100 cursor-pointer'>
                                    <TableCell>{ order.uid }</TableCell>
                                    <TableCell>{ order.carName }</TableCell>
                                    <TableCell>{ order.type && formatCategory(order.type) }</TableCell>
                                    <TableCell>{ order.dateTimeCourierAccept && formatDateAndClock(order.dateTimeCourierAccept) }</TableCell>
                                    <TableCell>{ order.dateTimeCourierPickUp && formatDateAndClock(order.dateTimeCourierPickUp) }</TableCell>
                                    <TableCell>{ order.dateTimeCourierDone && formatDateAndClock(order.dateTimeCourierDone) }</TableCell>
                                    <TableCell>{ getStatusLabel(order.status) }</TableCell>
                                </TableRow>
                            ))
                            }
                            { !isFilterApplied
                                ? (!data || !data.orders || data.orders.length < 1)
                                : (!filtrationData || !filtrationData.orders || filtrationData.orders.length < 1) && (
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
            { renderPagination(currentPage, total, pageSize, handleChangePage) }
            <Dialog open={ openModal } onClose={ () => setOpenModal(false) } aria-labelledby="form-dialog-title"
                    onKeyDown={ (e) => e.key === 'Enter' && handleSubmit(handleFilter)()} fullWidth={ true }>
                <DialogTitle id="form-dialog-title">Фильтр</DialogTitle>
                <DialogContent>
                    <form onSubmit={ handleSubmit(handleFilter) }>
                        <div className='mx-5 gap-5'>
                            <TextField
                                label="Марка автомобиля"
                                { ...register('filter_carMark') }
                                className='w-full'
                                autoComplete='off'
                            />
                            <TextField
                                label="Модель автомобиля"
                                { ...register('filter_carModel') }
                                className='w-full'
                                autoComplete='off'
                            />

                            <TextField
                                select
                                label="Статус"
                                value={ filter_statusValue }
                                defaultValue=''
                                { ...register('filter_status') }
                                className='w-full'
                            >
                                <MenuItem value="">Все</MenuItem>
                                <MenuItem value="-4">Отменён клиентом</MenuItem>
                                <MenuItem value="-3">Отменён поддержкой сервиса</MenuItem>
                                <MenuItem value="-2">Отменён курьером</MenuItem>
                                <MenuItem value="-1">Отменён заведением</MenuItem>
                                <MenuItem value="0">Опубликован</MenuItem>
                                <MenuItem value="1">Курьер на пути к точке А</MenuItem>
                                <MenuItem value="2">Курьер в точке А</MenuItem>
                                <MenuItem value="3">Забран, на пути в точку Б</MenuItem>
                                <MenuItem value="4">Курьер в точке Б</MenuItem>
                                <MenuItem value="5">Отработан</MenuItem>
                            </TextField>
                            <div className='mt-5'></div>
                            <TextField
                                select
                                label="Категория"
                                value={ filter_typeValue }
                                defaultValue=''
                                { ...register('filter_type') }
                                className='w-full'
                                InputLabelProps={ {
                                    shrink: true,
                                } }
                            >
                                <MenuItem value="">Все</MenuItem>
                                <MenuItem value="food">Еда</MenuItem>
                                <MenuItem value="product">Товар</MenuItem>
                                <MenuItem value="package">Посылка</MenuItem>
                            </TextField>
                            <div className='mt-5'></div>
                            <TextField
                                type="date"
                                label="Начальная дата завершения"
                                { ...register('filter_dateTimeCourierDone1') }
                                className='mt-10 w-full'
                                InputLabelProps={ {
                                    shrink: true,
                                } }
                            />
                            <div className='mt-5'></div>
                            <TextField
                                type="date"
                                label="Конечная дата завершения"
                                { ...register('filter_dateTimeCourierDone2') }
                                className='w-full'
                                InputLabelProps={ {
                                    shrink: true,
                                } }
                            />
                        </div>
                        <DialogActions>
                            <div className='flex flex-col sm:flex-row gap-2 sm:gap-5 flex-wrap'>
                                <button
                                    className={ `${ styles.BaseButton } ${
                                        !isFilterApplied ? 'hidden' : ''
                                    }` }
                                    onClick={ handleResetFilter }
                                >
                                    Сбросить фильтр
                                </button>
                                <button className={ styles.BaseButton } onClick={ () => setOpenModal(false) }>
                                    Отменить
                                </button>
                                <button className={ styles.BaseButton } type='submit'>
                                    Применить
                                </button>
                            </div>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default OrderTable;