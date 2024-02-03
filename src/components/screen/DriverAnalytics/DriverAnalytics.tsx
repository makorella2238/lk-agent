'use client'

import React, {useState} from 'react';
import s from '@/components/ui/genetal-css/general.module.css'
import styles from './DriverAnalytics.module.css'

const DriverAnalytics = () => {
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [driverId, setDriverId] = useState('');
    const [analyticsData, setAnalyticsData] = useState({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        setLoading(true);

        // Вымышленные данные для массива incomeService
        const analyticsData = {
            orderCompeled: 10,
            orderCanceled: 5,
            incomeCourier: 1000,
            incomeAgent: 500,
            incomeService: 2000,

        };

        setAnalyticsData(analyticsData);

        setLoading(false);
    };

    return (
        <div className="mt-5 shadow-md container mx-auto p-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Вкладка "Аналитика"</h1>
            <form onSubmit={ handleSubmit } className="mb-4 ">
                <div className="flex items-center mb-2 justify-center">
                    <label htmlFor="dateFrom" className="mr-2">
                        Дата ОТ:
                    </label>
                    <input
                        type="date"
                        id="dateFrom"
                        value={ dateFrom }
                        onChange={ (e) => setDateFrom(e.target.value) }
                        className="w-1/4 p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="flex items-center mb-2 justify-center">
                    <label htmlFor="dateTo" className="mr-2">
                        Дата ДО:
                    </label>
                    <input
                        type="date"
                        id="dateTo"
                        value={ dateTo }
                        onChange={ (e) => setDateTo(e.target.value) }
                        className="w-1/4 p-2 border border-gray-300 rounded"
                    />
                </div>
                <button
                    type="submit"
                    className={ `${ s.BaseButton } w-1/4` }
                    disabled={ loading }
                >
                    { loading ? 'Загрузка...' : 'Получить информацию' }
                </button>
            </form>
            { analyticsData && (
                <div>
                    <div className={ styles.borderContainer }>
                        Завершенных доставок:
                        <span className={styles.bodyText}>{ analyticsData.orderCompeled }</span>
                    </div>
                    <div className={ styles.borderContainer }>
                        Отмененных доставок:
                        <span className={styles.bodyText}>{ analyticsData.orderCanceled }</span>
                    </div>
                    <div className={ styles.borderContainer }>
                        Заработок Курьера:
                        <span className={styles.bodyText}>{ analyticsData.incomeCourier }</span>
                    </div>
                    <div className={ styles.borderContainer }>
                        Заработок Агента:
                        <span className={styles.bodyText}>{ analyticsData.incomeAgent }</span>
                    </div>
                    <div className={ styles.borderContainer }>
                        Работа сервиса:
                        <span className={styles.bodyText}>{ analyticsData.incomeService }</span>
                    </div>
                </div>
            ) }
        </div>
    );
};

export default DriverAnalytics;