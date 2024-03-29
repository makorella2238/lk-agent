'use client'

import React, {useState} from 'react';
import s from '@/components/ui/genetal-css/general.module.css'
import Image from "next/image";
import {ICarInfo, IDriverInfo} from "@/interfaces/types";
import CreateNewCarModal from "@/components/CreateNewCarModal/CreateNewCarModal";
import {formatState, formatStatus, formatWorkUsl} from "@/components/screen/Drivers/Drivers";
import Cookies from "js-cookie";
import {formatDate} from "@/utils/formateData";
import {useDeleteCar} from "@/hooks/drivers/drivers";
import {useParams} from "next/navigation";
import DeleteItemModal from "@/components/ui/DeleteItemModal/DeleteItemModal";

const DriversDetail = ({carInfoData, driverInfoData}: { carInfoData: ICarInfo, driverInfoData: IDriverInfo }) => {
    const [showCarInfo, setShowCarInfo] = useState(false);
    const [isCreateNewCarModal, setIsCreateNewCarModal] = useState(false);
    if (driverInfoData) {
        const {name, surname, patronymic} = driverInfoData
        const FIO = `${ surname } ${ name } ${ patronymic }`
        Cookies.set('FIO', FIO)
    }
    const params = useParams()
    const toggleCarInfo = () => {
        setShowCarInfo(!showCarInfo);
    };

    const [currentCarIndex, setCurrentCarIndex] = useState(0);
    const [carId, setCarId] = useState(null);
    const [carDeleteModal, setCarDeleteModal] = useState(false);

    const handleNextCar = () => {
        if (carInfoData.answer === '0') {
            setCurrentCarIndex((prevIndex) => (prevIndex + 1) % carInfoData.cars.length);
        }
    };

    const handlePrevCar = () => {
        if (carInfoData.answer === '0') {
            setCurrentCarIndex((prevIndex) => (prevIndex - 1 + carInfoData.cars.length) % carInfoData.cars.length);
        }
    };

    const deleteCarCloseModal = () => {
        setCarDeleteModal(false)
    }

    const handleDeleteDriverCar = useDeleteCar(params.driverId)

    const handleDeleteCar = (carId: number) => {
        handleDeleteDriverCar(carId);
        const updatedCars = carInfoData.cars.filter(car => car.carId !== carId);
        const updatedCurrentCarIndex = currentCarIndex >= updatedCars.length ? 0 : currentCarIndex;

        setCurrentCarIndex(updatedCurrentCarIndex);
        setCarDeleteModal(false)
    };

    return (
        <div className="container mx-auto sm:max-w-6xl flex flex-col sm:flex-row gap-3 sm:gap-5">
            <div className="block w-full sm:flex sm:w-1/2">
                <div className="w-full text-left my-5 border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6">
                    <h2 className="title text-2xl font-bold text-center mb-4">О водителе</h2>
                    <div className="my-5">
                        <div className={ s.borderContainer }>
                            Фамилия: <span className={ s.bodyText }>{ driverInfoData.surname }</span>
                        </div>
                        <div className={ s.borderContainer }>
                            Имя: <span className={ s.bodyText }>{ driverInfoData.name }</span>
                        </div>
                        <div className={ s.borderContainer }>
                            Отчество: <span className={ s.bodyText }>{ driverInfoData.patronymic }</span>
                        </div>
                        <div className={ s.borderContainer }>
                            Дата рождения: <span
                            className={ s.bodyText }>{ driverInfoData.dateBirth && formatDate(driverInfoData.dateBirth) }</span>
                        </div>
                        <div className={ s.borderContainer }>
                            Телефон: <span className={ s.bodyText }>{ driverInfoData.telephone }</span>
                        </div>
                        <div className={ s.borderContainer }>
                            Статус: <span className={ s.bodyText }>{ formatStatus(driverInfoData.status) }</span>
                        </div>
                        <div className={ s.borderContainer }>
                            Состояние: <span className={ s.bodyText }>{ formatState(driverInfoData.state) }</span>
                        </div>
                        <div className={ s.borderContainer }>
                            Серия ВУ: <span className={ s.bodyText }>{ driverInfoData.driverLicenceSeries }</span>
                        </div>
                        <div className={ s.borderContainer }>
                            Номер ВУ: <span className={ s.bodyText }>{ driverInfoData.driverLicenceNumber }</span>
                        </div>
                        <div className={ s.borderContainer }>
                            Страна выдачи ВУ: <span
                            className={ s.bodyText }>{ driverInfoData.driverLicenceCountry }</span>
                        </div>
                        <div className={ s.borderContainer }>
                            Дата выдачи ВУ: <span
                            className={ s.bodyText }>{ driverInfoData.driverLicenceDate && formatDate(driverInfoData.driverLicenceDate) }</span>
                        </div>
                        <div className={ s.borderContainer }>
                            Водительский стаж с: <span
                            className={ s.bodyText }>{ driverInfoData.driverExpDate && formatDate(driverInfoData.driverExpDate) }</span>
                        </div>
                    </div>
                </div>
            </div>

            {/*Условия работ*/ }
            <div className="block w-full sm:flex sm:flex-row sm:w-1/2">
                <div className="w-full sm:max-h-1/4">
                    <div>
                        <div className="my-5 border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6">
                            <h2 className="title text-2xl font-bold text-center mb-4">Условия работы</h2>
                            <div className={ s.borderContainer }>
                                Тип занятости: <span
                                className={ s.bodyText }>{ formatWorkUsl(driverInfoData.workUsl) }</span>
                            </div>
                            { driverInfoData.workUsl === "self" && (
                                <div className={ s.borderContainer }>
                                    ИНН: <span className={ s.bodyText }>{ driverInfoData.inn }</span>
                                </div>
                            ) }
                            { driverInfoData.workUsl === "ip" && (
                                <div className={ s.borderContainer }>
                                    ОГРНИП: <span className={ s.bodyText }>{ driverInfoData.ogrnip }</span>
                                </div>
                            ) }
                            { driverInfoData.workUsl === "ip" && (
                                <div className={ s.borderContainer }>
                                    ИНН: <span className={ s.bodyText }>{ driverInfoData.inn }</span>
                                </div>
                            ) }
                            { driverInfoData.workUsl === "ООО" && (
                                <div className={ s.borderContainer }>
                                    ОГРН: <span className={ s.bodyText }>{ driverInfoData.ogrn }</span>
                                </div>
                            ) }
                            { driverInfoData.workUsl === "ООО" && (
                                <div className={ s.borderContainer }>
                                    ИНН: <span className={ s.bodyText }>{ driverInfoData.inn }</span>
                                </div>
                            ) }
                            <div className={ s.borderContainer }>
                                Дата принятия: <span
                                className={ s.bodyText }>{ driverInfoData.hireDate && formatDate(driverInfoData.hireDate) }</span>
                            </div>
                        </div>
                    </div>
                    <div>

                        {/* Раздел "Автомобиль" */ }
                        <div className="sm:h-3/4 my-5 border border-gray-200 rounded-lg shadow-sm p-2 sm:p-4">
                            <div className="mb-1 flex items-center justify-center gap-5">
                                <h2 className="title text-2xl font-bold text-center">Автомобили</h2>
                                { carInfoData.answer === '0' && (
                                    <button
                                        onClick={ toggleCarInfo }
                                        className={ `${ s.BaseButton } mb-3 rounded-full w-10 h-10` }
                                    >
                                        <Image
                                            src="/arrow_down.png"
                                            alt="Arrow Dropdown"
                                            width={ 25 }
                                            height={ 25 }
                                        />
                                    </button>
                                ) }
                            </div>
                            { carInfoData.answer === '0' ? (
                                <div className='flex flex-wrap'>
                                    { carInfoData.cars.map((car, index) => (
                                        showCarInfo && (
                                            <div key={ car.carId }
                                                 className={ `mt-3 w-full ${ index === currentCarIndex ? 'block' : 'hidden' }` }>
                                                <h2 className='ml-2 text-xl font-bold'>Автомобиль №{ index + 1 }</h2>
                                                <div className={ s.miniBorderContainer }>
                                                    Марка: <span className={ s.bodyText }>{ car.mark }</span>
                                                </div>
                                                <div className={ s.miniBorderContainer }>
                                                    Модель: <span className={ s.bodyText }>{ car.model }</span>
                                                </div>
                                                <div className={ s.miniBorderContainer }>
                                                    Цвет: <span className={ s.bodyText }>{ car.color }</span>
                                                </div>
                                                <div className={ s.miniBorderContainer }>
                                                    Год: <span className={ s.bodyText }>{ car.year }</span>
                                                </div>
                                                <div className={ s.miniBorderContainer }>
                                                    Госномер: <span
                                                    className={ s.bodyText }>{ car.plateNumber }</span>
                                                </div>
                                                { car.vin && (
                                                    <div className={ s.miniBorderContainer }>
                                                        VIN: <span className={ s.bodyText }>{ car.vin }</span>
                                                    </div>
                                                ) }
                                                <div className={ s.miniBorderContainer }>
                                                    Номер кузова: <span
                                                    className={ s.bodyText }>{ car.bodyNumber }</span>
                                                </div>
                                                <div className={ s.miniBorderContainer }>
                                                    Серия СТС: <span
                                                    className={ s.bodyText }>{ car.certificateSeries }</span>
                                                </div>
                                                <div className={ s.miniBorderContainer }>
                                                    Номер СТС: <span
                                                    className={ s.bodyText }>{ car.certificateNumber }</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <button
                                                        onClick={ () => setIsCreateNewCarModal(true) }
                                                        className={ `mt-3 mx-auto w-11/12 ${ s.BaseButton }` }>
                                                        Добавить автомобиль
                                                    </button>
                                                    <button
                                                        onClick={ () => {
                                                            setCarId(car.carId)
                                                            setCarDeleteModal(true)
                                                        }
                                                        }
                                                        className={ `w-11/12 mt-3 mx-auto ${ s.easeInOut } ${ s.buttonRed }` }>
                                                        Удалить автомобиль
                                                    </button>
                                                </div>
                                                <p className="text-center mt-4">Всего
                                                    автомобилей: <span
                                                        className='font-bold'>{ carInfoData.cars.length }</span></p>
                                            </div>
                                        )
                                    )) }
                                </div>
                            ) : (
                                <div className="flex flex-col">
                                    <p>Нет данных об автомобиле</p>
                                    <button
                                        onClick={ () => setIsCreateNewCarModal(true) }
                                        className={ `mt-3 mx-auto w-11/12 ${ s.BaseButton }` }>
                                        Добавить автомобиль
                                    </button>
                                </div>
                            ) }
                            { carInfoData.answer === '0' && carInfoData.cars && carInfoData.cars.length > 1 && showCarInfo && (
                                <div className="flex justify-center mt-4">
                                    <button
                                        className={ `mr-2 ${ s.BaseButton }` }
                                        onClick={ handlePrevCar }
                                        disabled={ currentCarIndex === 0 }
                                    >
                                        <Image src='/arrow_left.svg' alt='Предыдущий' width={ 25 } height={ 25 }/>
                                    </button>
                                    <button
                                        className={ s.BaseButton }
                                        onClick={ handleNextCar }
                                        disabled={ currentCarIndex === carInfoData.cars.length - 1 }
                                    >
                                        <Image src='/arrow_right.svg' alt='Следующий' width={ 25 } height={ 25 }/>
                                    </button>
                                </div>
                            ) }
                        </div>
                    </div>

                </div>
            </div>
            { carDeleteModal && <DeleteItemModal
                open={ carDeleteModal }
                onClose={ deleteCarCloseModal }
                itemId={ carId }
                title='Удаление автомобиля'
                subtitle='Вы точно хотите удалить автомобиль?'
                handleDeleteItem={ handleDeleteCar }
            /> }
            { isCreateNewCarModal && <CreateNewCarModal isCreateNewCarModal={ isCreateNewCarModal }
                                                        setIsCreateNewCarModal={ setIsCreateNewCarModal }/> }
        </div>
    )
}

export default DriversDetail