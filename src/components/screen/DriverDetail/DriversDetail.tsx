'use client'

import React, {useState} from 'react';
import s from '@/components/ui/genetal-css/general.module.css'
import Image from "next/image";
import {usePathname, useRouter} from "next/navigation";
import Layout from "@/components/layout/Layout";

const DriversDetail = () => {
    // Пример данных о водителе (может быть заменен на ответ от сервера)
    const driverInfo = {
        firstName: 'Иван',
        lastName: 'Иванов',
        middleName: 'Иванович',
        birthDate: '01.01.1990',
        phone: '1234567890',
        status: 'Работает',
        driverLicense: {
            series: '1234',
            number: '567890',
            country: 'Россия',
            issueDate: '01.01.2010',
            drivingExperience: '5 лет'
        },
        employment: {
            type: 'ИП',
            ogrnip: '123456789012345',
            acceptanceDate: '01.01.2022',
            ogrn: '532513'
        },
        car: [
            {
                mark: 'Audi',
                model: 'A4',
                color: 'синий',
                year: '2018',
                platenumber: 'А123ВС',
                vin: '1234567890VIN',
                bodyNumber: '1234567890',
                certificateSeries: '1234',
                certificateNumber: '567890'
            },
            {
                mark: 'BMW',
                model: 'X4',
                color: 'серый',
                year: '2018',
                platenumber: 'B531Ac',
                vin: '13435234520VIN',
                bodyNumber: '0987654321',
                certificateSeries: '4314',
                certificateNumber: '821934'
            },
        ]
    };
    const pathName = usePathname()
    const router = useRouter()

    const [showCarInfo, setShowCarInfo] = useState(false);

    const toggleCarInfo = () => {
        setShowCarInfo(!showCarInfo);
    };

    return (
        <Layout>
            <div className="md:container md:mx-auto">
                <h1 className="font-semibold tracking-wide mt-3 mb-3 text-3xl sm:text-4xl text-center">
                    Личный кабинет агента
                </h1>

                {/* Раздел "О водителе" */ }
                <div className="col-span-1 md:col-span-1">
                    <div className="text-center my-5 border border-gray-200 rounded-lg shadow-sm p-6 sm:p-8">
                        <h2 className="text-lg font-semibold text-center">О водителе</h2>
                        <div className="my-5">
                            <p>Фамилия: { driverInfo.lastName }</p>
                            <p>Имя: { driverInfo.firstName }</p>
                            <p>Отчество: { driverInfo.middleName }</p>
                            <p>Дата рождения: { driverInfo.birthDate }</p>
                            <p>Телефон: { driverInfo.phone }</p>
                            <p>Статус: { driverInfo.status }</p>
                            <p>Серия ВУ: { driverInfo.driverLicense.series }</p>
                            <p>Номер ВУ: { driverInfo.driverLicense.number }</p>
                            <p>Страна выдачи ВУ: { driverInfo.driverLicense.country }</p>
                            <p>Дата выдачи ВУ: { driverInfo.driverLicense.issueDate }</p>
                            <p>Водительский стаж: { driverInfo.driverLicense.drivingExperience }</p>
                        </div>
                    </div>
                </div>

                <div className="col-span-2 md:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <div className="my-5 border border-gray-200 rounded-lg shadow-sm p-6 sm:p-8">
                                <h2 className="text-lg font-semibold text-center">Условия работы</h2>
                                <p className="text-center">Тип занятости: { driverInfo.employment.type }</p>
                                { driverInfo.employment.type === "ИП" && (
                                    <p className="text-center">ОГРНИП: { driverInfo.employment.ogrnip }</p>
                                ) }
                                { driverInfo.employment.type === "ООО" && (
                                    <p className="text-center">ОГРН: { driverInfo.employment.ogrn }</p>
                                ) }
                                <p className="text-center">Дата принятия: { driverInfo.employment.acceptanceDate }</p>
                            </div>
                        </div>
                        <div>

                            {/* Раздел "Автомобиль" */ }
                            <div className="my-5 border border-gray-200 rounded-lg shadow-sm p-6 sm:p-8">
                                <div className="flex items-center justify-center gap-5">
                                    <h2 className="text-lg font-semibold text-center">Автомобиль</h2>
                                    {/* Делаем кнопку "Автомобиль" более интерактивной и подходящей для темной темы */ }
                                    <button
                                        onClick={ toggleCarInfo }
                                        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center"
                                    >
                                        <Image
                                            src="/arrow-dropdown.svg"
                                            alt="Arrow Dropdown"
                                            width={ 25 }
                                            height={ 25 }
                                        />
                                    </button>
                                </div>
                                { driverInfo.car ? (
                                    <div>
                                        { showCarInfo && (
                                            driverInfo.car.map((car) => (
                                                <div className="grid grid-cols-2 gap-5 text-center">
                                                    <p>Марка: { car.mark }</p>
                                                    <p>Модель: { car.model }</p>
                                                    <p>Цвет: { car.color }</p>
                                                    <p>Год: { car.year }</p>
                                                    <p>Госномер: { car.platenumber }</p>
                                                    <p>VIN: { car.vin }</p>
                                                    <p>Номер кузова: { car.bodyNumber }</p>
                                                    <p>Серия СТС: { car.certificateSeries }</p>
                                                    <p>Номер СТС: { car.certificateNumber }</p>
                                                </div>
                                            ))
                                        ) }
                                    </div>
                                ) : (
                                    <div className="flex flex-col">
                                        <p>Нет данных об автомобиле</p>
                                        <button
                                            className="my-2 border border-gray-500 rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100">
                                            Добавить автомобиль
                                        </button>
                                    </div>
                                ) }
                            </div>
                        </div>

                        {/* Водитель. Вкладка "Заказы" */ }
                        <button type="submit" className={ `float-right mr-3.5  ${ s.BaseButton } ` }
                                onClick={ () => router.push(`${ pathName }/orders`) }>Перейти к заказам водителя
                        </button>
                        <button type="submit" className={ `float-right mr-3.5  ${ s.BaseButton } ` }
                                onClick={ () => router.push(`${ pathName }/transactions`) }>Перейти к истории баланса
                            водителя
                        </button>
                        <button type="submit" className={ `float-right mr-3.5  ${ s.BaseButton } ` }
                                onClick={ () => router.push(`${ pathName }/analytics`) }>Перейти к аналитике водителя
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default DriversDetail