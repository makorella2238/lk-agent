import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import s from "@/components/ui/genetal-css/general.module.css";
import Image from "next/image";
import {IAddEditDriver, ICarInfo, IDriverInfo, inputField} from "@/interfaces/types";
import {useEditDriver, useGetDriversInfo} from "@/hooks/drivers/drivers";
import Preloader from "@/components/Preloader/Preloader";
import {Modal} from "@material-ui/core";
import {inputFields} from "@/components/CreateNewDriver/CreateNewDriver";

interface CreateNewDriverProps {
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    isModalOpen: boolean;
    driverId: string | null
}

const EditDriver = ({
                        setIsModalOpen,
                        isModalOpen,
                        driverId
                    }: CreateNewDriverProps) => {
    const {
        register,
        handleSubmit,
        formState: {errors},
        watch,
        setValue,
        reset
    } = useForm<IAddEditDriver>();
    // @ts-ignore
    const {data, isFetching, error} = useGetDriversInfo(driverId)
    useEffect(() => {
        if (data) {
            setValue("surname", data.surname);
            setValue("name", data.name);
            setValue("patronymic", data.patronymic);
            setValue("dateBirth", data.dateBirth && data.dateBirth.split('T')[0]);
            setValue("telephone", data.telephone);
            setValue("driverLicenceSeries", data.driverLicenceSeries);
            setValue("driverLicenceNumber", data.driverLicenceNumber);
            setValue("driverLicenceCountry", data.driverLicenceCountry);
            setValue("driverLicenceDate", data.driverLicenceDate && data.driverLicenceDate.split('T')[0]);
            setValue("driverExpDate", data.driverExpDate && data.driverExpDate.split('T')[0]);
            setValue('restrictPayments', data.restrictPayments);
            if (data.restrictPayments === 'percent') {
                setValue('restrictPaymentsPercent', data.restrictPaymentsPercent);
            }
            setValue("restrictOrdersTime1", data.restrictOrdersTime1 && data.restrictOrdersTime1.split('T')[0] || "");
            setValue("restrictOrdersTime2", data.restrictOrdersTime2 && data.restrictOrdersTime2.split('T')[0] || "");
            setValue('workUsl', data.workUsl);
            setValue('restrictOrders', data.restrictOrders);
            setValue("inn", data.inn || "");
            setValue("ogrnip", data.ogrnip || "");
            setValue("ogrn", data.ogrn || "");
        }
    }, [data, setValue]);

    if (error) {
        return <p className="text-red-600">Ошибка при получении данных</p>;
    }

    const [editDriverLoading, setEditDriverLoading] = useState(false);

    const [requestErrors, setRequestErrors] = useState('');
    const handleEditDriver = useEditDriver(setRequestErrors, setEditDriverLoading)

    const onSubmit: SubmitHandler<IAddEditDriver> = (requestData) => {
        if (driverId != null) {
            handleEditDriver(requestData, driverId)
        }
        setIsModalOpen(false)
        if (!errors) {
            setIsModalOpen(false)
        }
    };

    const workUslValue = watch("workUsl");
    const restrictPayments = watch("restrictPayments");
    const restrictOrders = watch("restrictOrders");

    function handleCloseModal() {
        setIsModalOpen(false);
        reset({
            name: '',
            surname: '',
            patronymic: '',
            dateBirth: '',
            telephone: '',
            driverLicenceSeries: '',
            driverLicenceNumber: '',
            driverLicenceCountry: '',
            driverLicenceDate: '',
            driverExpDate: '',
            restrictPayments: '',
            restrictPaymentsPercent: '',
            restrictOrdersTime1: '',
            restrictOrdersTime2: '',
            workUsl: '',
            restrictOrders: '',
            inn: '',
            ogrnip: '',
            ogrn: ''
        });
    }
    return (
        <Modal open={ isModalOpen }>
            <div className="flex items-center justify-center h-screen">
                <div className="relative bg-white p-8 rounded-lg shadow-lg max-w-3xl">
                    <h2 className="text-center text-2xl font-bold mb-4">
                        Редактирование водителя
                    </h2>
                    <Image
                        onClick={ handleCloseModal }
                        className="absolute top-3 right-3 cursor-pointer"
                        src="/x-mark.svg"
                        alt="X"
                        width={ 25 }
                        height={ 25 }
                    />
                    <form onSubmit={ handleSubmit(onSubmit) }>
                        <div className="grid grid-cols-2 gap-4">
                            { inputFields.map((field: inputField) => (
                                <input
                                    key={ field.name }
                                    { ...register(field.name as any, {
                                        required: field.required,
                                        pattern: field.pattern
                                    }) }
                                    type="text"
                                    placeholder={ field.placeholder }
                                    className="border border-gray-300 p-2 rounded-lg"
                                />
                            )) }

                            { (errors.driverExpDate || errors.driverLicenceDate || errors.dateBirth) && (
                                <span className="text-red-600">Введите дату в формате гггг-мм-дд</span>
                            ) }

                            <div className="col-span-2">
                                <label htmlFor="restrictPayments" className="block mb-1 font-medium">
                                    Ограничение водителя для выплат
                                </label>
                                <select
                                    id="restrictPayments"
                                    { ...register("restrictPayments", {required: true}) }
                                    className="border border-gray-300 p-2 rounded-lg"
                                >
                                    <option value="">Выберите ограничения для выплат водителю</option>
                                    <option value="full">Полная выплата</option>
                                    <option value="percent">Частичная выплата</option>
                                    <option value="empty">Не выплачивать деньги водителю</option>
                                </select>
                            </div>
                            { restrictPayments === 'percent' && <div className="col-span-2">
                                <input
                                    { ...register("restrictPaymentsPercent", {required: true}) }
                                    type="text"
                                    placeholder='Значение процента'
                                    className="border border-gray-300 p-2 rounded-lg"
                                />
                            </div> }

                            <div className="col-span-2">
                                <label htmlFor="restrictOrders" className="block mb-1 font-medium">
                                    Ограничение водителя
                                </label>
                                <select
                                    id="restrictOrders"
                                    { ...register("restrictOrders", {required: true}) }
                                    className="border border-gray-300 p-2 rounded-lg"
                                >
                                    <option value="">Ограничение водителя</option>
                                    <option value="my">Отображать заказы только своего заведения всегда</option>
                                    <option value="my_times">Отображать заказы только своего заведения в диапазон
                                        времени
                                    </option>
                                    <option value="all">Отображать все заказы</option>
                                </select>
                            </div>

                            { restrictOrders === 'my_times' && (
                                <div className="col-span-2">
                                    <input
                                        { ...register("restrictOrdersTime1", {
                                            required: true,
                                            pattern: {
                                                value: /^\d{4}-\d{2}-\d{2}$/,
                                                message: "Введите дату в формате гггг-мм-дд"
                                            }
                                        }) }
                                        type="text"
                                        placeholder="Время ОТ"
                                        className="border border-gray-300 p-2 rounded-lg"
                                    />
                                </div>
                            ) }

                            { restrictOrders === 'my_times' && (
                                <div className="col-span-2">
                                    <input
                                        { ...register("restrictOrdersTime2", {
                                            required: true,
                                            pattern: {
                                                value: /^\d{4}-\d{2}-\d{2}$/,
                                                message: "Введите дату в формате гггг-мм-дд"
                                            }
                                        }) }
                                        type="text"
                                        placeholder="Время ДО"
                                        className="border border-gray-300 p-2 rounded-lg"
                                    />
                                </div>) }


                            <div className="col-span-2">
                                <label htmlFor="workUsl" className="block mb-1 font-medium">
                                    Условия работы
                                </label>
                                <select
                                    id="workUsl"
                                    { ...register("workUsl", {required: true}) }
                                    className="border border-gray-300 p-2 rounded-lg"
                                >
                                    <option value="">Выберите условия работы</option>
                                    <option value="self">Самозанятый</option>
                                    <option value="ip">ИП</option>
                                    <option value="ООО">ООО</option>
                                    <option value="fiz">Физлицо</option>
                                </select>
                            </div>
                            { (workUslValue === "self" ||
                                workUslValue === "ip" ||
                                workUslValue === "ООО") && (
                                <input
                                    { ...register("inn", {required: true}) }
                                    type="text"
                                    placeholder="ИНН"
                                    className="border border-gray-300 p-2 rounded-lg"
                                />
                            ) }
                            { (workUslValue === "ip") && (
                                <input
                                    { ...register("ogrnip", {required: true}) }
                                    type="text"
                                    placeholder="ОГРНИП"
                                    className="border border-gray-300 p-2 rounded-lg"
                                />
                            ) }
                            { (workUslValue === "ООО") && (
                                <input
                                    { ...register("ogrn", {required: true}) }
                                    type="text"
                                    placeholder="ОГРН"
                                    className="border border-gray-300 p-2 rounded-lg"
                                />
                            ) }
                        </div>
                        <button
                            type="submit"
                            className={ `w-full mt-3 ${ s.BaseButton }` }
                        >
                            Редактировать
                        </button>
                        { requestErrors && <span className='text-red-600'>{ requestErrors }</span> }
                    </form>
                    { editDriverLoading || isFetching && <Preloader/> }
                </div>
            </div>
        </Modal>
    );
};

export default EditDriver;