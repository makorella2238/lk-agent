'use client'

import s from './Detail.module.css'
import {useSelector} from "react-redux";
import {getFIO} from "@/Redux/app/app-selector";
import React from "react";
import {getStatusLabel} from "@/components/screen/OrderTable/OrderTable";
import Image from "next/image";
import Cookies from "js-cookie";

export type IOrderDetails = {
    id: number;
    uid: string;
    carId: number;
    carName: string;
    type: 'food' | 'product' | 'package'
    dateTimeCourierAccept: string;
    dateTimeCourierPickUp: string;
    dateTimeCourierDone: string;
    status: -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5;
    distance: string;
    pointFromName: string;
    pointFromLat: number;
    pointFromLon: number;
    pointToName: string;
    pointToLat: number;
    pointToLon: number;
    paymentMethod: 'sbp' | 'done' | 'aquiring'
    summaDelivery: number;
    summaService: number;
    summaAgent: number;
    summaCourierFinal: number;
};

type DetailOrderProps = {
    data: IOrderDetails
}

const DetailOrder = ({data}: DetailOrderProps) => {

    const driverFIO = Cookies.get('FIO')
    const open2GIS = (lat: number, lon: number) => {
        const url = `https://2gis.ru/search/${ lat }%2C${ lon }`
        window.open(url, '_blank');
    };

    return (
        <div className="container mx-auto max-w-2xl">
            <div className="card border-2 border-gray-300 shadow-lg p-4">
                <h2 className="title text-2xl font-bold text-center mb-4">
                    Детали заказа
                </h2>

                <div className={ s.borderContainer }>
                    Номер заказа:{ ' ' }
                    <span className={ s.bodyText }>{ data.uid }</span>
                </div>

                <div className={ s.borderContainer }>
                    Водитель:{ ' ' }
                    <span className={ s.bodyText }>{ driverFIO }</span>
                </div>

                <div className={ s.borderContainer }>
                    Автомобиль:{ ' ' }
                    <span className={ s.bodyText }>{ data.carName }</span>
                </div>

                <div className={ s.borderContainer }>
                    Категория:{ ' ' }
                    <span className={ s.bodyText }>{ data.type }</span>
                </div>

                <div className={ s.borderContainer }>
                    Дата и время принятия заказа:{ ' ' }
                    <span
                        className={ s.bodyText }>{ data.dateTimeCourierAccept && data.dateTimeCourierAccept.split('T').join(' ') }</span>
                </div>

                <div className={ s.borderContainer }>
                    Дата и время подачи:{ ' ' }
                    <span
                        className={ s.bodyText }>{ data.dateTimeCourierPickUp && data.dateTimeCourierPickUp.split('T').join(' ') }</span>
                </div>

                <div className={ s.borderContainer }>
                    Дата и время завершения:{ ' ' }
                    <span
                        className={ s.bodyText }>{ data.dateTimeCourierDone && data.dateTimeCourierDone.split('T').join(' ') }</span>
                </div>

                <div className={ s.borderContainer }>
                    Статус:{ ' ' }
                    <span className={ s.bodyText }>{ getStatusLabel(data.status) }</span>
                </div>

                <div className={ `flex items-center mb-2 ${ s.borderContainer }` }>
                    <p className="mr-3">Точка А:</p>
                    <div className='flex items-center gap-3 cursor-pointer' onClick={ () => open2GIS(data.pointFromLat, data.pointFromLon) }>
                        <a href="#" className="link text-blue-500 underline hover:text-green-500">
                            { data.pointFromName }
                        </a>
                        <Image src='/extraLink.svg' alt='link' width={ 20 } height={ 20 }/>
                    </div>

                </div>
                <div className={ `flex items-center mb-2 ${ s.borderContainer }` }>
                    <p className="mr-3 mb-1">Точка Б:</p>
                    <div className='flex items-center gap-3 cursor-pointer'
                         onClick={ () => open2GIS(data.pointToLat, data.pointToLon) }>
                        <a href="#" className="link text-blue-500 underline hover:text-emerald-600">
                            { data.pointToName }
                        </a>
                        <Image src='/extraLink.svg' alt='link' width={ 20 } height={ 20 }/>
                    </div>
                </div>
                <div className={ s.borderContainer }>
                    Путь:{ ' ' }
                    <span className={ s.bodyText }>{ data.distance }</span>
                </div>
                <div className={ s.borderContainer }>
                    Тип оплаты: { ' ' } <span
                    className={ s.bodyText }>{ data.paymentMethod == 'sbp' && 'Безналично' || data.paymentMethod == 'aquiring' && 'Безналично' || data.paymentMethod == 'done' && 'Уже оплачено' }</span>
                </div>
                <div className={ s.borderContainer }>
                    Общая стоимость:{ ' ' }
                    <span className={ s.bodyText }>{ data.summaDelivery }</span>
                </div>
                <div className={ s.borderContainer }>
                    Работа сервиса:{ ' ' }
                    <span className={ s.bodyText }>{ data.summaService }</span>
                </div>
                <div className={ s.borderContainer }>
                    Заработок Агента:{ ' ' }
                    <span className={ s.bodyText }>{ data.summaAgent }</span>
                </div>
                <div className={ s.borderContainer }>
                    Заработок Курьера:{ ' ' }
                    <span className={ s.bodyText }>{ data.summaCourierFinal }</span>
                </div>
            </div>
        </div>
    );
};

export default DetailOrder;