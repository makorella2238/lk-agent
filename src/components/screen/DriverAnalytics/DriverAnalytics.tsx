'use client'

import React, {useState} from 'react';
import s from '@/components/ui/genetal-css/general.module.css'
import styles from './DriverAnalytics.module.css'
import { useForm } from "react-hook-form";
import {ICarInfo, IDriverAnalytic} from "@/interfaces/types";
import {useGetDriverAnalytic} from "@/hooks/drivers/drivers";
import {useParams} from "next/navigation";
import Preloader from "@/components/Preloader/Preloader";

type IData = {
    dateFrom: string
    dateTo: string
}

const DriverAnalytics = () => {
    const [dateError, setDateError] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTO] = useState('');
    const [enabled, setEnabled] = useState(false);
    const params = useParams()
    const {register, handleSubmit,  formState: {errors},
    } = useForm<IData>();
    const onSubmit = async (data: IData) => {
        const { dateFrom, dateTo } = data;

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
        <div className="mt-5 shadow-md container mx-auto p-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Вкладка "Аналитика"</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
                <div className="flex items-center mb-2 justify-center">
                    <label htmlFor="dateFrom" className="mr-2">
                        Дата ОТ:
                    </label>
                    <input
                        type="date"
                        id="dateFrom"
                        {...register('dateFrom', { required: true })}
                        className="sm:w-1/4 p-2 border border-gray-300 rounded"
                    />
                </div>
                {errors.dateFrom && (
                    <p className="text-red-500">Обязательное поле. Введите корректную дату.</p>
                )}
                <div className="flex items-center mb-2 justify-center">
                    <label htmlFor="dateTo" className="mr-2">
                        Дата ДО:
                    </label>
                    <input
                        type="date"
                        id="dateTo"
                        {...register('dateTo', { required: true })}
                        className="sm:w-1/4 p-2 border border-gray-300 rounded"
                    />
                </div>
                {errors.dateTo && (
                    <p className="text-red-500">Обязательное поле. Введите корректную дату.</p>
                )}
                {dateError && <div className="leading-8 text-red-500">{dateError}</div>}
                <button
                    type="submit"
                    className={`${s.BaseButton} sm:w-1/4`}
                    disabled={isFetching}
                    onClick={handleSubmit(onSubmit)}
                >
                    {isFetching ? 'Загрузка...' : 'Получить информацию'}
                </button>
            </form>
            { data && (
                <div>
                    <div className={ styles.borderContainer }>
                        Завершенных доставок:
                        <span className={styles.bodyText}>{' '}{ data.orderCompeled }</span>
                    </div>
                    <div className={ styles.borderContainer }>
                        Отмененных доставок:
                        <span className={styles.bodyText}>{' '}{ data.orderCanceled }</span>
                    </div>
                    <div className={ styles.borderContainer }>
                        Заработок Курьера:
                        <span className={styles.bodyText}>{' '}{ data.incomeCourier }</span>
                    </div>
                    <div className={ styles.borderContainer }>
                        Заработок Агента:
                        <span className={styles.bodyText}>{' '}{ data.incomeAgent }</span>
                    </div>
                    <div className={ styles.borderContainer }>
                        Работа сервиса:
                        <span className={styles.bodyText}>{' '}{ data.incomeService }</span>
                    </div>
                </div>
            ) }
        </div>
    );

};

export default DriverAnalytics;