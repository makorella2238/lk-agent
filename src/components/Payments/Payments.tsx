'use client'

import {SetStateAction, useState} from 'react';
import {
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField
} from "@material-ui/core";
import Image from "next/image";
import s from './Payments.module.css'
import Modal from "@/components/ui/Modal/Modal";


const Payments = () => {
    const [balance, setBalance] = useState(5000);
    const [payments, setPayments] = useState([
        {
            id: 1,
            paymentId: 1,
            dateNextPayment: '2024.02.01',
            checkingAccount: '123124',
            description: 'будет получаться из API',
            summa: '1000р',
            status: 0
        },
        {
            id: 2,
            paymentId: 2,
            dateNextPayment: '2024.01.31',
            checkingAccount: '5124512',
            description: 'будет получаться из API',
            summa: '1500р',
            status: 1
        },
        {
            id: 3,
            paymentId: 3,
            dateNextPayment: '2024.01.30',
            checkingAccount: '12351245',
            description: 'будет получаться из API',
            summa: '2000р',
            status: -1
        },
        {
            id: 4,
            paymentId: 4,
            dateNextPayment: '2024.01.29',
            checkingAccount: '21351612',
            description: 'будет получаться из API',
            summa: '4000р',
            status: 1
        },
    ]);
    const [dateFilter, setDateFilter] = useState({startDate: '', endDate: ''});
    const [statusFilter, setStatusFilter] = useState('');
    const [isPaymentsModalOpen, setIsPaymentsModalOpen] = useState(false);

    const handleDateFilterChange = (event: { target: { name: any; value: any; }; }) => {
        const {name, value} = event.target;
        setDateFilter(prevState => ({...prevState, [name]: value}));
    };

    const handleStatusFilterChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setStatusFilter(event.target.value);
    };

    const filteredPayments = payments.filter((payment) => {
        const paymentDate = new Date(payment.dateNextPayment.split('.').reverse().join('-'));
        const startDate = dateFilter.startDate ? new Date(dateFilter.startDate.split('.').reverse().join('-')) : null;
        const endDate = dateFilter.endDate ? new Date(dateFilter.endDate.split('.').reverse().join('-')) : null;

        const isDateMatch = (
            (!startDate || paymentDate >= startDate)
            && (!endDate || paymentDate <= endDate)
        );
        const isStatusMatch = (!statusFilter || payment.status.toString() === statusFilter);
        return isDateMatch && isStatusMatch;
    });

    function handleClosePaymentsModal() {
        setIsPaymentsModalOpen(false)
        setDateFilter({startDate: '', endDate: ''})
    }

    return (
        <div className={`p-4 col-span-1 text-black shadow-lg ${s.border_l}`}>

            <div className='flex justify-center'>
                <Image src='/not-avatar.svg' alt='avatar' height={ 200 } width={ 200 }/>
            </div>

            <h2 className="text-center text-2xl font-bold mb-4">Выплаты:</h2>
            <div className='flex items-center'>
                <Image className='mb-2' src='/money.png' alt='cash' width={32} height={32}/>
                <p className="mb-1.5 ml-1.5 text-xl"><span className='font-bold'>Баланс: </span> <span
                    className='font-light'>{ balance }р</span></p>
            </div>
            <p className="mb-5 ml-1.5 text-lg leading-3"><span className='font-bold'>Следующая выплата:</span> <span
                className='font-light text-base'>30.01.2024 в 12:00</span></p>
            <button className='mt-3 py-2 px-4 rounded-2xl bg-slate-50 shadow-md' type="submit"
                    onClick={ () => setIsPaymentsModalOpen(true) }>Показать таблицу с выплатами
            </button>

            { isPaymentsModalOpen && <Modal>
                <div className={ `relative mt-5 bg-slate-100 ${ s.modalContainer }` }>
                    <div className='cursor-pointer p-1'>
                        <Image className='absolute top-2 right-2 '
                               onClick={ handleClosePaymentsModal } src='/x-mark.svg' alt='X' width={ 25 }
                               height={ 25 }/>
                    </div>
                    <div className={ s.filter_container }>
                        <TextField
                            type="date"
                            label="Начальная дата"
                            name="startDate"
                            value={ dateFilter.startDate }
                            onChange={ handleDateFilterChange }
                            className="filter-input"
                            InputLabelProps={ {
                                shrink: true,
                            } }
                        />
                        <div className='mr-3.5'></div>
                        <TextField
                            type="date"
                            label="Конечная дата"
                            name="endDate"
                            value={ dateFilter.endDate }
                            onChange={ handleDateFilterChange }
                            className={ s.filter_input }
                            InputLabelProps={ {
                                shrink: true,
                            } }
                        />
                        <div className='mr-3.5'></div>
                        <FormControl className={ s.filter_input }>
                            <InputLabel id="status-filter-label">Статус</InputLabel>
                            <Select
                                labelId="status-filter-label"
                                id="status-filter"
                                value={ statusFilter }
                                onChange={ handleStatusFilterChange }
                            >
                                <MenuItem value="">Все</MenuItem>
                                <MenuItem value="1">Выполнено </MenuItem>
                                <MenuItem value="0">Отправлено в банк</MenuItem>
                                <MenuItem value="-1">Ошибка</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <Paper className={ s.table_container }>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Номер платежа</TableCell>
                                    <TableCell>Дата следующего платежа</TableCell>
                                    <TableCell>Расчетный счет</TableCell>
                                    <TableCell>Описание</TableCell>
                                    <TableCell>Сумма</TableCell>
                                    <TableCell>Статус</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                { filteredPayments.map((payment) => (
                                    <TableRow key={ payment.id }>
                                        <TableCell>{ payment.paymentId }</TableCell>
                                        <TableCell>{ payment.dateNextPayment }</TableCell>
                                        <TableCell>{ payment.checkingAccount }</TableCell>
                                        <TableCell>{ payment.description }</TableCell>
                                        <TableCell>{ payment.summa }</TableCell>
                                        <TableCell>{ payment.status === 1 && 'Выполнено' || payment.status === 0 && 'Отправлено в банк' || payment.status === -1 && 'Ошибка' }</TableCell>
                                    </TableRow>
                                )) }
                            </TableBody>
                        </Table>
                    </Paper>
                </div>
            </Modal> }
        </div>
    );
};

export default Payments;
