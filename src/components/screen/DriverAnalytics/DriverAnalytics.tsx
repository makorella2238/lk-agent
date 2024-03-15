'use client'

import React, {useState} from 'react';
import s from '@/components/ui/genetal-css/general.module.css'
import {useForm} from "react-hook-form";
import {useGetDriverAnalytic} from "@/hooks/drivers/drivers";
import {useParams, useRouter} from "next/navigation";
import {formatPrice} from "@/utils/formateData";
import Image from "next/image";

export type IData = {
    dateFrom: string
    dateTo: string
}

const DriverAnalytics = () => {
    const [dateError, setDateError] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTO] = useState('');
    const [enabled, setEnabled] = useState(false);
    const params = useParams()
    const router = useRouter()
    const {
        register, handleSubmit, formState: {errors},
    } = useForm<IData>();
    const onSubmit = async (data: IData) => {
        const {dateFrom, dateTo} = data;

        if (dateFrom > dateTo) {
            return setDateError('Дата ОТ должна быть меньше или равна Дате ДО');
        }
        setDateTO(dateTo)
        setDateFrom(dateFrom)
        setEnabled(true)
        setDateError('');
    };
    // @ts-ignore
    const {error, data, isFetching} = useGetDriverAnalytic(params.driverId, dateFrom, dateTo, enabled);

    if (error) {
        console.log(error)
        return <p>Ошибка при получении данных</p>
    }

    return (
        <div className="mt-5 shadow-md container mx-auto p-4 text-center relative">
            <div className={ `absolute top-2 left-2 ${ s.BaseButton } p-2 flex ml-5 transition-colors ` }
                 onClick={ () => router.back() }>
                <Image className='sm:mr-3' src='/arrow_back.svg' alt='arrow_back' width={ 20 } height={ 20 }/>
                <p className='hidden sm:block'>Назад</p>
            </div>
            <h2 className="text-2xl font-bold mb-4">Аналитика</h2>
            <form onSubmit={ handleSubmit(onSubmit) } className="mb-4">
                <div className="flex items-center mb-2 justify-center">
                    <label htmlFor="dateFrom" className="mr-2">
                        Начальная дата:
                    </label>
                    <input
                        type="date"
                        id="dateFrom"
                        { ...register('dateFrom', {required: true}) }
                        className="sm:w-1/4 p-2 border border-gray-300 rounded"
                    />
                </div>
                { errors.dateFrom && (
                    <p className="text-red-500">Обязательное поле. Введите корректную дату.</p>
                ) }
                <div className="flex items-center mb-2 justify-center">
                    <label htmlFor="dateTo" className="mr-2">
                        Конечная дата:
                    </label>
                    <input
                        type="date"
                        id="dateTo"
                        { ...register('dateTo', {required: true}) }
                        className="sm:w-1/4 p-2 border border-gray-300 rounded"
                    />
                </div>
                { errors.dateTo && (
                    <p className="text-red-500">Обязательное поле. Введите корректную дату.</p>
                ) }
                { dateError && <div className="leading-8 text-red-500">{ dateError }</div> }
                <button
                    type="submit"
                    className={ `${ s.BaseButton } mt-2 lg:w-1/4` }
                    disabled={ isFetching }
                    onClick={ handleSubmit(onSubmit) }
                >
                    { isFetching ? 'Загрузка...' : 'Получить информацию' }
                </button>
            </form>
            { data && (
                <div className='flex flex-col justify-center mx-auto w-full sm:w-3/4 md:w-3/5 lg:w-2/5 text-left'>
                    <div className={ s.borderContainer }>
                        Завершенных доставок:
                        <span className={ s.bodyText }>{ ' ' }{ data.orderCompeled }</span>
                    </div>
                    <div className={ s.borderContainer }>
                        Отмененных доставок:
                        <span className={ s.bodyText }>{ ' ' }{ data.orderCanceled }</span>
                    </div>
                    <div className={ s.borderContainer }>
                        Заработок Курьера:
                        <span className={ s.bodyText }>{ ' ' }{ formatPrice(data.incomeCourier) }</span>
                    </div>
                    <div className={ s.borderContainer }>
                        Заработок Агента:
                        <span className={ s.bodyText }>{ ' ' }{ formatPrice(data.incomeAgent) }</span>
                    </div>
                    <div className={ s.borderContainer }>
                        Работа сервиса:
                        <span className={ s.bodyText }>{ ' ' }{ formatPrice(data.incomeService) }</span>
                    </div>
                </div>
            ) }
        </div>
    );

};

export default DriverAnalytics;