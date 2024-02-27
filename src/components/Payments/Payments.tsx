import React, {ChangeEvent, useEffect, useState} from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@material-ui/core";
import Image from "next/image";
import s from './Payments.module.css'
import styles from '@/components/ui/genetal-css/general.module.css'
import {formatDate, formatPrice} from "@/utils/formateData";
import {IPaymentsAgent} from "@/interfaces/types";

type PaymentsProps = {
    data: IPaymentsAgent
};

const Payments = ({data}: PaymentsProps) => {
    const [statusFilter, setStatusFilter] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [filteredPayments, setFilteredPayments] = useState(() => []);
    const [dateFilter, setDateFilter] = useState<{
        startDate: Date | string;
        endDate: Date | string
    }>({
        startDate: '',
        endDate: '',
    });
    const isFilterActive = statusFilter || dateFilter.endDate || dateFilter.endDate
    const handleDateFilterChange = (event: {
        target: {
            name: any;
            value: any
        }
    }) => {
        const {name, value} = event.target;
        setDateFilter((prevState) => ({...prevState, [name]: value}));
    };
    const handleStatusFilterChange = (event: ChangeEvent<{ value: unknown }>) => {
        setStatusFilter(event.target.value as string);
    };
    const handleModalOpen = () => {
        setOpenModal(true);
    };

    const handleModalClose = () => {
        setOpenModal(false);
    };

    useEffect(() => {
        handleFilter()
    }, [dateFilter, statusFilter]);

    const handleFilter = () => {
        setOpenModal(false);

        if (!dateFilter.startDate && !dateFilter.endDate && !statusFilter) {
            debugger
            setFilteredPayments(data.payments);
            return;
        }

        const filteredData = data.payments && data.payments.filter((payment) => {
            debugger
            const paymentDate = payment.dateRequestPayment.split('T')[0];
            const startDate = dateFilter.startDate;
            const endDate = dateFilter.endDate;

            const isDateMatch =
                (!startDate || paymentDate >= startDate) &&
                (!endDate || paymentDate <= endDate);
            const isStatusMatch =
                !statusFilter || payment.status.toString() === statusFilter;

            return isDateMatch && isStatusMatch;
        });

        setFilteredPayments(filteredData);
    };

    const handleResetFilter = () => {
        setDateFilter({
            startDate: '',
            endDate: '',
        })
        setStatusFilter('')
    };

    return (
        <div className="pb-6 p-4 text-black shadow-lg">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Выплаты:</h2>
                <div className="flex items-center justify-center">
                    <Image className="mb-2" src="/money.png" alt="cash" width={ 32 } height={ 32 }/>
                    <p className="mb-1.5 ml-1.5 text-lg sm:text-xl">
                        <span className="font-bold">Баланс: </span> <span
                        className="font-light">{ formatPrice(data.balance) }</span>
                    </p>
                </div>
                <div className="mb-2 sm:mb-5 ml-1.5 text-base sm:text-lg">
                    <span className="font-bold text-center">Следующая выплата:</span>{ " " }
                    <span
                        className="font-bold text-emerald-500 text-center">{ formatDate(data.dateNextPayment) }</span>
                </div>
            </div>

            <div className="relative my-2 sm:mb-3">
                <button className={ `float-right mb-2 sm:mb-4 ${ styles.BaseButton }` } onClick={ handleModalOpen }>
                    Фильтровать
                </button>

                <TableContainer component={ Paper }>
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
                            { filteredPayments.length > 0 ?
                                filteredPayments.map((payment) => (
                                    <TableRow key={ payment.paymentId } className='hover:bg-gray-100 cursor-pointer'>
                                        <TableCell>{ payment.paymentId }</TableCell>
                                        <TableCell>
                                            { payment.dateRequestPayment.split('T')[0].split('-').reverse().join('.') }
                                        </TableCell>
                                        <TableCell>{ payment.checkingAccount }</TableCell>
                                        <TableCell>{ payment.description }</TableCell>
                                        <TableCell>{ `${ payment.summa } ₽` }</TableCell>
                                        <TableCell>
                                            { payment.status === 2 && 'Выполнено' }
                                            { payment.status === 1 && 'Отправлено в банк' }
                                            { payment.status === -1 && 'Ошибка' }
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
                </TableContainer>

                <Dialog open={ openModal } onClose={ handleModalClose } aria-labelledby="form-dialog-title"
                        fullWidth={ true } onKeyDown={ (e) => e.key === 'Enter' && handleFilter() }>
                    <DialogTitle id="form-dialog-title">Фильтр</DialogTitle>
                    <DialogContent>
                        <div className={ s.filter_container }>
                            <div className='w-full'>
                                <TextField
                                    type="date"
                                    label="Начальная дата"
                                    name="startDate"
                                    className='w-full'
                                    value={ dateFilter.startDate }
                                    onChange={ handleDateFilterChange }
                                    InputLabelProps={ {
                                        shrink: true,
                                    } }
                                />
                            </div>
                            <div className='mb-3 sm:mb-5'></div>
                            <div className='w-full'>
                                <TextField
                                    type="date"
                                    label="Конечная дата"
                                    name="endDate"
                                    className='w-full'
                                    value={ dateFilter.endDate }
                                    onChange={ handleDateFilterChange }
                                    InputLabelProps={ {
                                        shrink: true,
                                    } }
                                />
                            </div>
                            <div className='mb-3 sm:mb-5'></div>
                            <div className='w-full'>
                                <InputLabel id="status-filter-label">Статус</InputLabel>
                                <Select
                                    labelId="status-filter-label"
                                    id="status-filter"
                                    value={ statusFilter }
                                    className='w-full'
                                    onChange={ handleStatusFilterChange }
                                >
                                    <MenuItem value="">Все</MenuItem>
                                    <MenuItem value="2">Выполнено</MenuItem>
                                    <MenuItem value="1">Отправлено в банк</MenuItem>
                                    <MenuItem value="-1">Ошибка</MenuItem>
                                </Select>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <div className='flex flex-col gap-2 sm:flex-row'>
                            <button
                                className={ `${ styles.BaseButton } ${
                                    isFilterActive ? '' : 'hidden'
                                }` }
                                onClick={ handleResetFilter }
                            >
                                Сбросить фильтр
                            </button>
                            <button className={ styles.BaseButton } onClick={ handleModalClose }>
                                Отменить
                            </button>
                            <button className={ styles.BaseButton } onClick={ handleFilter }>
                                Применить
                            </button>
                        </div>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    )
}

export default Payments;