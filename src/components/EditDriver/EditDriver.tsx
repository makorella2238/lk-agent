import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import s from "@/components/ui/genetal-css/general.module.css";
import Image from "next/image";
import {IAddEditDriver, inputField} from "@/interfaces/types";
import {useEditDriver, useGetDriversInfo} from "@/hooks/drivers/drivers";
import Preloader from "@/components/Preloader/Preloader";
import {inputFields} from "@/components/CreateNewDriver/CreateNewDriver";
import {Dialog, DialogContent, DialogTitle} from "@material-ui/core";

interface CreateNewDriverProps {
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    isModalOpen: boolean;
    driverId: number | null
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
        const formattedData = {
            ...requestData,
            dateBirth: requestData.dateBirth.split('.').reverse().join('-'),
            driverExpDate: requestData.driverExpDate.split('.').reverse().join('-'),
            driverLicenceDate: requestData.driverLicenceDate.split('.').reverse().join('-')
        };
        if (driverId != null) {
            handleEditDriver(formattedData, String(driverId))
        }
        console.log(errors)
        setIsModalOpen(false)
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
        <Dialog open={ isModalOpen } onClose={ handleCloseModal } aria-labelledby="form-dialog-title"
                maxWidth='md'>
            <DialogTitle id="form-dialog-title"><p className="text-center text-2xl font-bold">Редактирование
                водителя</p></DialogTitle>
            <DialogContent>
                    <div className="bg-white p-1 sm:p-8 rounded-lg shadow-lg max-w-3xl">
                        <form onSubmit={ handleSubmit(onSubmit) }>
                            <div className="flex flex-col sm:grid sm:grid-cols-2 gap-2">
                                { inputFields.map((field: inputField) => (
                                    <div key={ field.name }>
                                        <label htmlFor={ field.name }
                                               className='sm:font-bold text-xs sm:text-base'>{ field.placeholder }</label>
                                        <input
                                            id={ field.name }
                                            { ...register(field.name as any, {
                                                required: field.required,
                                            }) }
                                            type={ field.type ? field.type : 'text' }
                                            placeholder={ field.placeholder }
                                            className={ `w-full border border-gray-300 p-2 rounded-lg ${
                                                errors[field.name] && field.required ? 'border-red-600' : ''
                                            }` }
                                        />
                                    </div>
                                )) }

                                <div className="mt-2 sm:mt-0 col-span-2">
                                    <label htmlFor="restrictPayments" className="text-xs sm:text-base block mb-1 sm:font-bold">
                                        Ограничение водителя для выплат
                                    </label>
                                    <select
                                        id="restrictPayments"
                                        { ...register("restrictPayments", {required: true}) }
                                        className="border border-gray-300 p-2 rounded-lg w-full"
                                    >
                                        <option value="">Выберите ограничения для выплат водителю</option>
                                        <option value="full">Полная выплата</option>
                                        <option value="percent">Частичная выплата</option>
                                        <option value="empty">Не выплачивать деньги водителю</option>
                                    </select>
                                </div>
                                { restrictPayments === 'percent' && <div className="mt-2 sm:mt-0 col-span-2">
                                    <label htmlFor="restrictPayments" className="text-xs sm:text-base block mb-1 sm:font-bold">
                                        Значение процента
                                    </label>
                                    <input
                                        { ...register("restrictPaymentsPercent", {required: true}) }
                                        type="text"
                                        placeholder='Значение процента'
                                        className="border border-gray-300 p-2 rounded-lg w-full"
                                    />
                                </div> }

                                <div className="col-span-2">
                                    <label htmlFor="restrictOrders" className="text-xs sm:text-base block mb-1 sm:font-bold">
                                        Ограничение водителя
                                    </label>
                                    <select
                                        id="restrictOrders"
                                        { ...register("restrictOrders", {required: true}) }
                                        className="border border-gray-300 p-2 rounded-lg w-full"
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
                                    <div className='grid grid-cols-2 gap-2'>
                                        <div className="col-span-2">
                                            <label htmlFor='restrictOrdersTime1' className='text-xs sm:text-base sm:font-bold'>Время
                                                ОТ</label>
                                            <input
                                                { ...register("restrictOrdersTime1", {
                                                    required: true,
                                                }) }
                                                type="date"
                                                placeholder="Время ОТ"
                                                className="border border-gray-300 p-2 rounded-lg w-full"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label htmlFor='restrictOrdersTime2' className='text-xs sm:text-base sm:font-bold'>Время
                                                ДО</label>
                                            <input
                                                { ...register("restrictOrdersTime2", {
                                                    required: true,
                                                }) }
                                                type="date"
                                                placeholder="Время ДО"
                                                className="border border-gray-300 p-2 rounded-lg w-full"
                                            />
                                        </div>
                                    </div>
                                ) }

                                <div className="col-span-2">
                                    <label htmlFor="workUsl" className="text-xs sm:text-base block mb-1 sm:font-bold">
                                        Условия работы
                                    </label>
                                    <select
                                        id="workUsl"
                                        { ...register("workUsl", {required: true}) }
                                        className="border border-gray-300 p-2 rounded-lg w-full"
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
                                    <div className='flex flex-col'>
                                        <label htmlFor='inn' className='text-xs sm:text-base sm:font-bold'>ИНН</label>
                                        <input
                                            { ...register("inn", {required: true}) }
                                            type="text"
                                            placeholder="ИНН"
                                            className="border border-gray-300 p-2 rounded-lg"
                                        />
                                    </div>
                                ) }
                                { (workUslValue === "ip") && (
                                    <div className='flex flex-col'>
                                        <label htmlFor='ogrnip' className='text-xs sm:text-base sm:font-bold'>ОГРНИП</label>
                                        <input
                                            { ...register("ogrnip", {required: true}) }
                                            type="text"
                                            placeholder="ОГРНИП"
                                            className="border border-gray-300 p-2 rounded-lg"
                                        />
                                    </div>
                                ) }
                                { (workUslValue === "ООО") && (
                                    <div className='flex flex-col'>
                                        <label htmlFor='ogrn' className='text-xs sm:text-base sm:font-bold'>ОГРН</label>
                                        <input
                                            { ...register("ogrn", {required: true}) }
                                            type="text"
                                            placeholder="ОГРН"
                                            className="border border-gray-300 p-2 rounded-lg"
                                        />
                                    </div>
                                ) }
                            </div>
                            { requestErrors && <span className='text-red-600'>{ requestErrors }</span> }
                            <div className='flex justify-end mt-3'>
                                <button
                                    type="submit"
                                    className={ s.BaseButton }
                                >
                                    Редактировать
                                </button>
                            </div>
                        </form>
                        { editDriverLoading || isFetching && <Preloader/> }
                    </div>
            </DialogContent>
        </Dialog>
    );
};

export default EditDriver;