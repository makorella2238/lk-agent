'use client'

import React, {useState} from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputLabel, MenuItem,
    Select,
    TextField
} from "@material-ui/core";
import Image from "next/image";
import styles from '@/components/ui/genetal-css/general.module.css'
import {formatDate, formatPrice} from "@/utils/formateData";
import {IPaymentsAgent} from "@/interfaces/types";
import {useQueryClient} from "@tanstack/react-query";
import {useForm} from "react-hook-form";
import {useGetPaymentsAgentForFiltration} from "@/hooks/payments/payments";
import Preloader from "@/components/Preloader/Preloader";
import PaymentsTable from "@/components/screen/Payments/PaymentsTable";

type PaymentsProps = {
    data: IPaymentsAgent
};

const Payments = ({data}: PaymentsProps) => {
    const {register, handleSubmit, reset, watch} = useForm()
    const queryClient = useQueryClient();

    const [isFilterData, setIsFilterData] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [filter, setFilter] = useState({
        filter_dateRequestPayment1: '',
        filter_dateRequestPayment2: '',
        filter_status: ''
    });
    const [enabledFilter, setEnabledFilter] = useState(false);
    const {
        data: filtrationData,
        isFetching: filtrationIsFetching,
        error: filtrationError,
    } = useGetPaymentsAgentForFiltration(enabledFilter, filter.filter_dateRequestPayment1, filter.filter_dateRequestPayment2, filter.filter_status);

    if (filtrationIsFetching) {
        return <Preloader/>;
    }

    if (filtrationError) {
        return <p className="text-red-600">Ошибка при получении данных</p>;
    }

    function handleFilter(data: {
        filter_dateRequestPayment1: string,
        filter_dateRequestPayment2: string,
        filter_status: string;
    }) {
        setFilter({...data})
        setEnabledFilter(true)
        setIsFilterData(true)
        setOpenModal(false)
    }

    const handleResetFilter = () => {
        reset({
            filter_dateRequestPayment1: '',
            filter_dateRequestPayment2: '',
            filter_status: ''
        })
        setOpenModal(false)
        setIsFilterData(false)
        queryClient.invalidateQueries({queryKey: ['getPaymentsAgent']})
    };

    const filter_statusValue = watch('filter_status')

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
                <button className={ `float-right mb-2 sm:mb-4 ${ styles.BaseButton }` }
                        onClick={ () => setOpenModal(true) }>
                    Фильтровать
                </button>

                { isFilterData
                    ? <PaymentsTable data={filtrationData}/>
                    : <PaymentsTable data={data}/>
                }

                <Dialog open={ openModal } onClose={ () => setOpenModal(false) } aria-labelledby="form-dialog-title"
                        fullWidth={ true } onKeyDown={ (e) => {
                    if (e.key === 'Enter') {
                        handleSubmit(handleFilter)();
                    }
                } }>
                    <DialogTitle id="form-dialog-title">Фильтр</DialogTitle>
                    <DialogContent>
                        <form onSubmit={ handleSubmit(handleFilter) }>
                            <div className='w-full'>
                                <TextField
                                    type="date"
                                    label="Начальная дата"
                                    name="startDate"
                                    className='w-full'
                                    { ...register('filter_dateRequestPayment1') }
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
                                    { ...register('filter_dateRequestPayment2') }
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
                                    className='w-full'
                                    defaultValue=''
                                    value={ filter_statusValue }
                                    { ...register('filter_status') }
                                >
                                    <MenuItem value="">Все</MenuItem>
                                    <MenuItem value="2">Выполнено</MenuItem>
                                    <MenuItem value="1">Отправлено в банк</MenuItem>
                                    <MenuItem value="-1">Ошибка</MenuItem>
                                </Select>
                            </div>
                            <DialogActions>
                                <div className='mt-3 flex flex-col gap-2 sm:flex-row'>
                                    <button
                                        className={ `${ styles.BaseButton } ${
                                            isFilterData ? '' : 'hidden'
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
        </div>
    )
}

export default Payments;