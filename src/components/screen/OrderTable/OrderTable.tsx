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
import {useRouter} from "next/navigation";
import {IAllDriverOrders} from "@/interfaces/types";
import TableContainer from "@material-ui/core/TableContainer";
import styles from "@/components/ui/genetal-css/general.module.css";
import {renderPagination} from "@/utils/tablePagitaion";
import {formatDateAndClock} from "@/utils/formateData";
import s from "@/components/ui/genetal-css/general.module.css";
import Image from "next/image";

type OrderTableMokDataProps = {
    offset: number
    setOffset: React.Dispatch<React.SetStateAction<number>>
    data: IAllDriverOrders
    pageSize: number
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
    const router = useRouter();

    // @ts-ignore
    const total = data.total;
    const [openModal, setOpenModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [carFilter, setCarFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [dateFilter, setDateFilter] = useState({
        startDate: '',
        endDate: '',
    });
    const [isFilterApplied, setIsFilterApplied] = useState(false); // Добавлено новое состояние

    const getCurrentPageOrders = () => {
        if (!data || !data.orders) {
            return []; // Return an empty array if data or orders are undefined
        }

        let filteredOrders = data.orders; // Define filteredOrders variable
        if (isFilterApplied) {
            if (carFilter) {
                filteredOrders = filteredOrders.filter((order) =>
                    order.carName.toLowerCase().includes(carFilter.toLowerCase())
                );
            }

            if (statusFilter) {
                const status = parseInt(statusFilter);
                filteredOrders = filteredOrders.filter((order) => order.status === status);
            }

            if (categoryFilter) {
                filteredOrders = filteredOrders.filter((order) => order.type === categoryFilter);
            }

            if (dateFilter.startDate && dateFilter.endDate) {
                filteredOrders = filteredOrders.filter((order) => {
                    const orderDate = new Date(order.dateTimeCourierDone);
                    const startDate = new Date(dateFilter.startDate);
                    const endDate = new Date(dateFilter.endDate);
                    return orderDate >= startDate && orderDate <= endDate;
                });
            }
        }

        const startIndex = offset;
        const endIndex = offset + pageSize;

        return filteredOrders.slice(startIndex, endIndex);
    };

    const handleCarFilterChange = (event: { target: { value: React.SetStateAction<string> } }) => {
        setCarFilter(event.target.value);
    };

    const handleStatusFilterChange = (event: { target: { value: React.SetStateAction<string> } }) => {
        setStatusFilter(event.target.value);
    };

    const handleCategoryFilterChange = (event: { target: { value: React.SetStateAction<string> } }) => {
        setCategoryFilter(event.target.value);
    };

    const handleDateFilterChange = (event: { target: { name: any; value: any } }) => {
        const {name, value} = event.target;
        setDateFilter((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleChangePage = (page: number) => {
        const newOffset = (page - 1) * pageSize;
        setOffset(newOffset);
        setCurrentPage(page);
    };

    const handleApplyFilter = () => {
        handleFilter();
        setIsFilterApplied(true);
        setOpenModal(false)
    };

    const handleFilter = () => {
        setIsFilterApplied(true);
        setCurrentPage(1);
        setOpenModal(false)
    };
    const handleResetFilter = () => {
        setCarFilter('');
        setStatusFilter('');
        setCategoryFilter('');
        setDateFilter({
            startDate: '',
            endDate: '',
        });
        setIsFilterApplied(false);
    };

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
                            { getCurrentPageOrders().length > 0 ? (
                                getCurrentPageOrders().map((order: any) => (
                                    <TableRow key={ order.id }
                                              onClick={ () => router.push(`orders/${ order.id }`) }
                                              className='hover:bg-gray-100'>
                                        <TableCell>{ order.uid }</TableCell>
                                        <TableCell>{ order.carName }</TableCell>
                                        <TableCell>{ order.type && formatCategory(order.type) }</TableCell>
                                        <TableCell>{ order.dateTimeCourierAccept && formatDateAndClock(order.dateTimeCourierAccept) }</TableCell>
                                        <TableCell>{ order.dateTimeCourierPickUp && formatDateAndClock(order.dateTimeCourierPickUp) }</TableCell>
                                        <TableCell>{ order.dateTimeCourierDone && formatDateAndClock(order.dateTimeCourierDone)}</TableCell>
                                        <TableCell>{ getStatusLabel(order.status) }</TableCell>
                                    </TableRow>
                                ))
                            ) : (
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
            <Dialog open={ openModal } onClose={ () => setOpenModal(false) } aria-labelledby="form-dialog-title" onKeyDown={(e) => e.key === 'Enter' && handleFilter() } fullWidth={true}>
                <DialogTitle id="form-dialog-title">Фильтр</DialogTitle>
                <DialogContent>
                    <div className='mx-5 gap-5'>
                        <TextField
                            label="Автомобиль"
                            value={ carFilter }
                            onChange={ handleCarFilterChange }
                            className='w-full'
                        />

                        <TextField
                            select
                            label="Статус"
                            value={ statusFilter }
                            onChange={ handleStatusFilterChange }
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
                            value={ categoryFilter }
                            onChange={ handleCategoryFilterChange }
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
                            name="startDate"
                            value={ dateFilter.startDate }
                            onChange={ handleDateFilterChange }
                            className='mt-10 w-full'
                            InputLabelProps={ {
                                shrink: true,
                            } }
                        />
                        <div className='mt-5'></div>
                        <TextField
                            type="date"
                            label="Конечная дата завершения"
                            name="endDate"
                            value={ dateFilter.endDate }
                            onChange={ handleDateFilterChange }
                            className='w-full'
                            InputLabelProps={ {
                                shrink: true,
                            } }
                        />
                    </div>
                </DialogContent>
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
                        <button className={ styles.BaseButton } onClick={ handleApplyFilter }>
                            Применить
                        </button>
                    </div>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default OrderTable;