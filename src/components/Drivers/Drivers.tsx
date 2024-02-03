'use client'

import React, {Dispatch, SetStateAction, useState} from 'react';
import {Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField} from '@material-ui/core';
import { useRouter } from 'next/navigation'
import s from '@/components/ui/genetal-css/general.module.css'
import styles from './Driver.module.css'

// Функция для форматирования статуса и состояния водителя
const formatStatus = (status: number) => {
    switch (status) {
        case 1:
            return 'Работает';
        case 0:
            return 'Уволен';
        case -1:
            return 'Заблокирован';
        default:
            return 'Неизвестно';
    }
};

const formatWorkUsl = (workUsl: string) => {
    switch (workUsl) {
        case 'fiz':
            return 'Физлицо';
        case 'self':
            return 'самозанятый ';
        case 'ip':
            return 'ИП';
        case 'OOO':
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
    setIsCreateNewDriverModal: Dispatch<SetStateAction<boolean>>
}

const DriversTable = ({setIsCreateNewDriverModal}: DriversTableProps) => {
    const router = useRouter()
    // Состояние для хранения фильтров
    const [filter, setFilter] = useState({
        fullName: '',
        telephone: '',
        workUsl: '',
        status: '',
        lastOrderDate: '',
    });

    // Массив с данными о водителях (можно получать из API)
    const data = [
        {
            id: 1,
            surname: 'Иванов',
            name: 'Алексей',
            patronymic: 'Иванович',
            telephone: 79391063919,
            workUsl: 'self',
            status: 1,
            state: 2,
            balance: 1000,
            lastOrderDate: '25.01.2024'
        },
        {
            id: 2,
            surname: 'Смирнова',
            name: 'Екатерина',
            patronymic: 'Александровна',
            telephone: 532,
            workUsl: 'OOO',
            status: 0,
            state: 3,
            balance: 500,
            lastOrderDate: '28.01.2024'
        },
        {
            id: 3,
            surname: 'Васильев',
            name: 'Михаил',
            patronymic: 'Сергеевич',
            telephone: 324523,
            workUsl: 'ip',
            status: -1,
            state: 1,
            balance: 1500,
            lastOrderDate: '26.01.2024'
        },
        {
            id: 4,
            surname: 'Петров',
            name: 'Анатолий',
            patronymic: 'Алексеевич',
            telephone: 32532,
            workUsl: 'fiz',
            status: 0,
            state: 1,
            balance: 2000,
            lastOrderDate: '22.01.2024'
        },
        {
            id: 5,
            surname: 'Сидорова',
            name: 'Мария',
            patronymic: 'Николаевна',
            telephone: 547457,
            workUsl: 'self',
            status: 1,
            state: 2,
            balance: 800,
            lastOrderDate: '23.01.2024'
        },
        {
            id: 6,
            surname: 'Алексеева',
            name: 'Анна',
            patronymic: 'Игоревна',
            telephone: 56856,
            workUsl: 'self',
            status: -1,
            state: 3,
            balance: 3500,
            lastOrderDate: '24.01.2024'
        },
        {
            id: 7,
            surname: 'Кузнецов',
            name: 'Денис',
            patronymic: 'Максимович',
            telephone: 98778,
            workUsl: 'fiz',
            status: 1,
            state: 1,
            balance: 1200,
            lastOrderDate: '27.01.2024'
        },
        {
            id: 8,
            surname: 'Морозов',
            name: 'Артем',
            patronymic: 'Владимирович',
            telephone: 323,
            workUsl: 'fiz',
            status: 1,
            state: 1,
            balance: 2500,
            lastOrderDate: '28.01.2024'
        },
        {
            id: 9,
            surname: 'Новикова',
            name: 'Юлия',
            patronymic: 'Игоревна',
            telephone: 23543,
            workUsl: 'fiz',
            status: 1,
            state: 1,
            balance: 4000,
            lastOrderDate: '28.01.2024'
        },
    ];

    // Функция для обработки изменения фильтров
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, column: string) => {
        setFilter({...filter, [column]: e.target.value});
    };

    // Функция для фильтрации данных по фильтрам
    const filteredData = data.filter((item) => {
        const fullName = `${ item.surname } ${ item.name } ${ item.patronymic }`
        const statusText = formatStatus(item.status);
        const workUslText = formatWorkUsl(item.workUsl)

        return (
            fullName.toLowerCase().includes(filter.fullName.toLowerCase()) &&
            workUslText.toLowerCase().includes(filter.workUsl.toLowerCase()) &&
            item.lastOrderDate.toLowerCase().includes(filter.lastOrderDate.toLowerCase()) &&
            item.telephone.toString().includes(filter.telephone) &&
            statusText.toLowerCase().includes(filter.status.toLowerCase())
        )
    });

    // Функция для добавления нового водителя
    const handleAddDriver = () => {
        setIsCreateNewDriverModal(true)
    };

    // Возвращаем JSX-разметку таблицы
    return (
        <div className={`border-l-3 border-emerald-200/50 ${styles.border_l}`}>
            <h2 className="text-center text-2xl font-bold mb-4">Водители</h2>
            <div className='m-3 text-right mr-3'>
                <button className={s.BaseButton} type='submit' onClick={ handleAddDriver }>
                    Добавить водителя
                </button>
            </div>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TextField
                                    label="ФИО"
                                    value={ filter.fullName }
                                    onChange={ (e) => handleFilterChange(e, 'fullName') }
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    label="Телефон"
                                    value={ filter.telephone }
                                    onChange={ (e) => handleFilterChange(e, 'telephone') }
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    label="Условия работы"
                                    value={ filter.workUsl }
                                    onChange={ (e) => handleFilterChange(e, 'workUsl') }
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    label="Статус"
                                    value={ filter.status }
                                    onChange={ (e) => handleFilterChange(e, 'status') }
                                />
                            </TableCell>
                            <TableCell>
                                <p className='text-black/50 text-lg'>Состояние</p>
                            </TableCell>
                            <TableCell>
                                <p className='text-black/50 text-lg'>Баланс</p>
                            </TableCell>
                            <TableCell className='min-w-[200px]'>
                                <TextField
                                    label="Дата последнего заказа"
                                    value={ filter.lastOrderDate }
                                    onChange={ (e) => handleFilterChange(e, 'lastOrderDate') }
                                />
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { filteredData.map((item) => (
                            <TableRow key={ item.id } onDoubleClick={ () => router.push(`/drivers/${item.id}`) }>
                                <TableCell>{ `${ item.surname } ${ item.name } ${ item.patronymic }` }</TableCell>
                                <TableCell>{ item.telephone }</TableCell>
                                <TableCell>{ formatWorkUsl(item.workUsl) }</TableCell>
                                <TableCell>{ formatStatus(item.status) }</TableCell>
                                <TableCell>{ formatState(item.state) }</TableCell>
                                <TableCell>{ item.balance }</TableCell>
                                <TableCell>{ item.lastOrderDate }</TableCell>
                            </TableRow>
                        )) }
                    </TableBody>
                </Table>
            </Paper>
        </div>
    )
}

export default DriversTable