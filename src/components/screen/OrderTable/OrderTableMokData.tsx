import React, {useState} from 'react';
import {Button, MenuItem, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField} from "@material-ui/core";
import s from './OrderTable.module.css'
import {useRouter} from "next/navigation";

type Order = {
    id: number;
    uid: string;
    carId: number;
    carName: string;
    type: 'food' | 'product' | 'package';
    dateTimeCourierAccept: string
    dateTimeCourierPickUp: string;
    dateTimeCourierDone: string;
    status: -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5;
};

const OrderTableMokData = () => {
    const router = useRouter()

    const serverRequestData = {
        "total": 6,
        "orders": [
            {
                id: 1,
                uid: 'order-1',
                carId: 1,
                carName: 'BMW X5',
                type: 'food',
                dateTimeCourierAccept: '2024-01-30 10:00',
                dateTimeCourierPickUp: '2024-01-31 10:00',
                dateTimeCourierDone: '2024-01-30 12:00',
                status: 1,
            },
            {
                id: 2,
                uid: 'order-2',
                carId: 2,
                carName: 'Mercedes-Benz E-Class',
                type: 'product',
                dateTimeCourierAccept: '2024-01-30 12:00',
                dateTimeCourierPickUp: '2024-01-31 11:00',
                dateTimeCourierDone: '2024-01-29 13:00',
                status: 2,
            },
            {
                id: 3,
                uid: 'order-3',
                carId: 3,
                carName: 'Audi A4',
                type: 'package',
                dateTimeCourierAccept: '2024-01-30 18:00',
                dateTimeCourierPickUp: '2024-01-31 12:00',
                dateTimeCourierDone: '2024-01-28 14:00',
                status: 3,
            },
            {
                id: 4,
                uid: 'order-4',
                carId: 4,
                carName: 'Volvo XC60',
                type: 'food',
                dateTimeCourierAccept: '2024-01-31 12:00',
                dateTimeCourierPickUp: '2024-01-31 13:00',
                dateTimeCourierDone: '2024-02-01 15:00',
                status: 4,
            },
            {
                id: 5,
                uid: 'order-5',
                carId: 5,
                carName: 'Lexus RX',
                type: 'product',
                dateTimeCourierAccept: '2024-01-30 17:00',
                dateTimeCourierPickUp: '2024-01-31 14:00',
                dateTimeCourierDone: '2024-01-30 16:00',
                status: 5,
            },
            {
                id: 6,
                uid: 'order-6',
                carId: 6,
                carName: 'Porsche 911',
                type: 'package',
                dateTimeCourierAccept: '2024-01-31 14:36',
                dateTimeCourierPickUp: '2024-01-31 15:00',
                dateTimeCourierDone: '2024-01-29 17:00',
                status: 1,
            },
        ]
    };

    const pageSize = 5; // Количество элементов на странице

    // @ts-ignore
    const [orders, setOrders] = useState<Order[]>(serverRequestData.orders);
    const [total, setTotal] = useState(serverRequestData.total);
    const [currentPage, setCurrentPage] = useState(1);

    const [carFilter, setCarFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [dateFilter, setDateFilter] = useState({
        startDate: '',
        endDate: '',
    });

    const getCurrentPageOrders = () => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        // Применение фильтров, если они заданы
        let filteredOrders = orders;

        if (carFilter) {
            filteredOrders = filteredOrders.filter(order =>
                order.carName.toLowerCase().includes(carFilter.toLowerCase())
            );
        }

        if (statusFilter) {
            const status = parseInt(statusFilter);
            filteredOrders = filteredOrders.filter(order => order.status === status);
        }

        if (categoryFilter) {
            filteredOrders = filteredOrders.filter(order => order.type === categoryFilter);
        }

        if (dateFilter.startDate && dateFilter.endDate) {
            filteredOrders = filteredOrders.filter(order => {
                const orderDate = new Date(order.dateTimeCourierDone);
                const startDate = new Date(dateFilter.startDate);
                const endDate = new Date(dateFilter.endDate);
                return orderDate >= startDate && orderDate <= endDate;
            });
        }

        // Вернуть все строки таблицы, если фильтры не применены
        if (!carFilter && !statusFilter && !categoryFilter && !dateFilter.startDate && !dateFilter.endDate) {
            return orders.slice(startIndex, endIndex);
        }

        return filteredOrders.slice(startIndex, endIndex);
    };
    const handleCarFilterChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setCarFilter(event.target.value);
    };

    const handleStatusFilterChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setStatusFilter(event.target.value);
    };

    const handleCategoryFilterChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setCategoryFilter(event.target.value);
    };

    const handleDateFilterChange = (event: { target: { name: any; value: any; }; }) => {
        const {name, value} = event.target;
        setDateFilter(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };


    const getStatusLabel = (status: number) => {
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


    const handleChangePage = (page: number) => {
        setCurrentPage(page);
    };

    const renderPagination = () => {
        const pagesCount = Math.ceil(total / pageSize);
        const pages = [];

        for (let i = 1; i <= pagesCount; i++) {
            pages.push(i);
        }

        return (
            <div className='flex justify-center mt-1'>
                { pages.map((page) => (
                    <Button
                        key={ page }
                        variant={ currentPage === page ? 'contained' : 'outlined' }
                        color={ currentPage === page ? 'primary' : 'default' }
                        className='m-1'
                        onClick={ () => handleChangePage(page) }
                    >
                        { page }
                    </Button>
                )) }
            </div>
        );
    };

    return (
        <div className='mx-5'>
            <h1 className="font-bold my-3 ml-3 text-2xl ">
                Заказы
            </h1>
            <div className={ s.filter_container }>
                <TextField
                    label="Автомобиль"
                    value={ carFilter }
                    onChange={ handleCarFilterChange }
                    className={ s.filter_input }
                />
                <div className='mr-4'></div>

                <TextField
                    select
                    label="Статус"
                    value={ statusFilter }
                    onChange={ handleStatusFilterChange }
                    className={ s.filter_input }
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
                <div className='mr-4'></div>

                <TextField
                    select
                    label="Категория"
                    value={ categoryFilter }
                    onChange={ handleCategoryFilterChange }
                    className={ s.filter_input }
                >
                    <MenuItem value="">Все</MenuItem>
                    <MenuItem value="food">Еда</MenuItem>
                    <MenuItem value="product">Товар</MenuItem>
                    <MenuItem value="package">Посылка</MenuItem>
                </TextField>

                <div className='mr-4'></div>

                <TextField
                    type="date"
                    label="Начальная дата завершения"
                    name="startDate"
                    value={ dateFilter.startDate }
                    onChange={ handleDateFilterChange }
                    className={ s.filter_input }
                    InputLabelProps={ {
                        shrink: true,
                    } }
                />

                <div className='mr-4'></div>
                <TextField
                    type="date"
                    label="Конечная дата завершения"
                    name="endDate"
                    value={ dateFilter.endDate }
                    onChange={ handleDateFilterChange }
                    className={ s.filter_input }
                    InputLabelProps={ {
                        shrink: true,
                    } }
                />
            </div>
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
                        {getCurrentPageOrders().length > 0 ? (
                            getCurrentPageOrders().map((order: any) => (
                                <TableRow key={order.id} onDoubleClick={() => router.push(`orders/${order.id}`)}>
                                    <TableCell>{order.uid}</TableCell>
                                    <TableCell>{order.carName}</TableCell>
                                    <TableCell>{order.type}</TableCell>
                                    <TableCell>{order.dateTimeCourierAccept }</TableCell>
                                    <TableCell>{order.dateTimeCourierPickUp}</TableCell>
                                    <TableCell>{order.dateTimeCourierDone}</TableCell>
                                    <TableCell>{getStatusLabel(order.status)}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    Нет данных
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>
            { renderPagination() }
        </div>
    );
};

export default OrderTableMokData;