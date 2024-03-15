import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import s from "@/components/ui/genetal-css/general.module.css";
import {IAddEditDriver, inputField} from "@/interfaces/types";
import {
    useEditDriver, useGetAgentIdAlways,
    useGetDriversInfo
} from "@/hooks/drivers/drivers";
import Preloader from "@/components/Preloader/Preloader";
import {inputFields} from "@/components/CreateNewDriver/CreateNewDriver";
import {Dialog, DialogContent, DialogTitle} from "@material-ui/core";
import TimeRestrictions from "@/components/ui/TimeRestrictions/TimeRestrictions";

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
    const {data: agentIdData, isLoading: agentIdFetching, error: agentIdError} = useGetAgentIdAlways()

    if (error || agentIdError) {
        return <p className="text-red-600">Ошибка при получении данных</p>;
    }

    useEffect(() => {
        if (data) {
            setValue("surname", data.surname);
            setValue("name", data.name);
            setValue("patronymic", data.patronymic && data.patronymic);
            setValue("dateBirth", data.dateBirth && data.dateBirth.split('T')[0]);
            setValue("telephone", data.telephone);
            setValue("driverLicenceSeries", data.driverLicenceSeries);
            setValue("driverLicenceNumber", data.driverLicenceNumber);
            setValue("driverLicenceCountry", data.driverLicenceCountry);
            setValue("driverLicenceDate", data.driverLicenceDate && data.driverLicenceDate.split('T')[0]);
            setValue("driverExpDate", data.driverExpDate && data.driverExpDate.split('T')[0]);
            setValue('status', data.status);
            setValue('restrictPayments', data.restrictPayments);
            if (data.restrictPayments === 'percent') {
                setValue('restrictPaymentsPercent', data.restrictPaymentsPercent);
            }
            setValue("restrictOrdersTimes", data.restrictOrdersTimes && data.restrictOrdersTimes);
            setValue('workUsl', data.workUsl);
            setValue('restrictOrders', data.restrictOrders && data.restrictOrders);
            setValue("inn", data.inn || "");
            setValue("ogrnip", data.ogrnip || "");
            setValue("ogrn", data.ogrn || "");
        }
    }, [data, setValue]);

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
        if(!restrictOrdersTimes) {
            delete formattedData.restrictOrdersTimes
        }
        if (!formattedData.ogrnip) {
            delete formattedData.ogrnip
        }
        if (!formattedData.patronymic) {
            delete formattedData.patronymic
        }
        if (!formattedData.ogrn) {
            delete formattedData.ogrn
        }
        if (!formattedData.inn) {
            delete formattedData.inn
        }
        if (driverId != null) {
            handleEditDriver(formattedData, String(driverId))
        }
        console.log(errors)
        setIsModalOpen(false)
    };

    const workUslValue = watch("workUsl");
    const restrictPayments = watch("restrictPayments");
    const restrictOrders = watch("restrictOrders");
    const restrictOrdersTimes = watch("restrictOrdersTimes");

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
            restrictOrdersTimes: '',
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

                                <div className="col-span-2">
                                    <label htmlFor="status" className="text-xs sm:text-base block mb-1 sm:font-bold">
                                        Статус
                                    </label>
                                    <select
                                        id="status"
                                        { ...register("status", {required: true}) }
                                        className="border border-gray-300 p-2 rounded-lg w-full"
                                    >
                                        <option value="">Выберите статус</option>
                                        <option value="2">Работает</option>
                                        <option value="1">Уволен</option>
                                        { agentIdData.admin === 1 && <option value="-1">Заблокирован</option>}
                                    </select>
                                </div>

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

                                {restrictOrders === 'my_times' && (
                                    <TimeRestrictions restrictOrdersTimes={restrictOrdersTimes} setValue={setValue} />
                                )}

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
                                        <option value="ooo">ООО</option>
                                        <option value="fiz">Физлицо</option>
                                    </select>
                                </div>
                                { (workUslValue === "self" ||
                                    workUslValue === "ip" ||
                                    workUslValue === "ooo") && (
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
                                { (workUslValue === "ooo") && (
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
                        { editDriverLoading || isFetching || agentIdFetching && <Preloader/> }
                    </div>
            </DialogContent>
        </Dialog>
    );
};

export default EditDriver;