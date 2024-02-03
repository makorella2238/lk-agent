import React, { useState, useEffect } from 'react';

type Order = {
    id: number;
    uid: string;
    carId: number;
    carName: string;
    type: 'food' | 'product' | 'package';
    dateTimeCourierPickUp: string;
    dateTimeCourierDone: string;
    status: -4 | -3 | -2| -1 | 0 | 1 | 2 | 3 | 4 | 5;
    distance: number;
}

const OrdersTable = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    useEffect(() => {
        fetchOrders();
    }, [currentPage]);
    const fetchOrders = async () => {
        try {
            const response = await fetch(`http://95.154.93.88:32768/api/?method=driver.orderlist&token=a5842677d46463e1f5b9de0db8d0d6aba17b158d8a&driverId=${1}&offset=${(currentPage - 1) * pageSize}&count=${pageSize}`);

            if (response.ok) {
                const data = await response.json();
                setOrders(data.orders);
                setTotal(data.total);
            } else {
                console.error('Ошибка при получении данных');
            }
        } catch (error) {
            console.error('Ошибка при получении данных', error);
        }
    };

    const getStatusLabel = (status: Order['status']) => {
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
            <div>
                {pages.map((page) => (
                    <button
                        key={page}
                        className={`mr-2 w-10 py-2 px-4 rounded-2xl ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
                        onClick={() => handleChangePage(page)}
                    >
                        {page}
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div>
            <h2>Заказы</h2>
            <table>
                <thead>
                <tr>
                    <th>Номер заказа</th>
                    <th>Автомобиль</th>
                    <th>Категория</th>
                    <th>Дата и время подачи</th>
                    <th>Дата и время завершения</th>
                    <th>Статус</th>
                    <th>Путь (пробег)</th>
                </tr>
                </thead>
                <tbody>
                {orders.map((order) => (
                    <tr key={order.id}>
                        <td>{order.uid}</td>
                        <td>{order.carName}</td>
                        <td>{order.type}</td>
                        <td>{order.dateTimeCourierPickUp}</td>
                        <td>{order.dateTimeCourierDone}</td>
                        <td>{getStatusLabel(order.status)}</td>
                        <td>{order.distance}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            {renderPagination()}
        </div>
    );
};

export default OrdersTable;