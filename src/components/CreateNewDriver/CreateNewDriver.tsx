import React, {Dispatch, SetStateAction, useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import s from "@/components/ui/genetal-css/general.module.css";
import {IAddEditDriver, inputField} from "@/interfaces/types";
import {useCreateNewDriver} from "@/hooks/drivers/drivers";
import Preloader from "@/components/Preloader/Preloader";
import {Dialog, DialogContent, DialogTitle} from "@material-ui/core";
import TimeRestrictions from "@/components/ui/TimeRestrictions/TimeRestrictions";

interface CreateNewDriverProps {
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    isModalOpen: boolean;
}

export const inputFields: inputField[] = [
    {name: "surname", placeholder: "Фамилия", required: true},
    {name: "name", placeholder: "Имя", required: true},
    {name: "patronymic", placeholder: "Отчество"},
    {name: "dateBirth", placeholder: "Дата рождения", required: true, type: 'date'},
    {name: "telephone", placeholder: "Телефон", required: true},
    {name: "driverLicenceSeries", placeholder: "Серия ВУ", required: true},
    {name: "driverLicenceNumber", placeholder: "Номер ВУ", required: true},
    {name: "driverLicenceCountry", placeholder: "Страна выдачи ВУ", required: true},
    {name: "driverLicenceDate", placeholder: "Дата выдачи ВУ", required: true, type: 'date'},
    {name: "driverExpDate", placeholder: "Водительский стаж с", required: true, type: 'date'},
];

const CreateNewDriver = ({
                             setIsModalOpen,
                             isModalOpen,
                         }: CreateNewDriverProps) => {
    const {
        register,
        handleSubmit,
        formState: {errors},
        watch,
        reset,
        setValue
    } = useForm<IAddEditDriver>();

    const [requestErrors, setRequestErrors] = useState('');
    const [createNewDriverLoading, setCreateNewDriverLoading] = useState(false);
    const handleCreateNewDriver = useCreateNewDriver(setRequestErrors, setCreateNewDriverLoading)

    const onSubmit: SubmitHandler<IAddEditDriver> = (requestData) => {
        const formattedData = {
            ...requestData,
            dateBirth: requestData.dateBirth.split('.').reverse().join('-'),
            driverExpDate: requestData.driverExpDate.split('.').reverse().join('-'),
            driverLicenceDate: requestData.driverLicenceDate.split('.').reverse().join('-')
        };
        formattedData.status = 2;
        handleCreateNewDriver(formattedData)
        setIsModalOpen(false)
    };

    const workUslValue = watch("workUsl");
    const restrictPayments = watch("restrictPayments");
    const restrictOrders = watch("restrictOrders");
    const restrictOrdersTimes = watch("restrictOrdersTimes");

    function handleCloseModal() {
        setIsModalOpen(false);
        reset()
    }

    return (
        <Dialog open={ isModalOpen } onClose={ handleCloseModal } aria-labelledby="form-dialog-title"
                maxWidth='md'>
            <DialogTitle id="form-dialog-title"><p className="text-center text-2xl font-bold">Добавление
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
                                <label htmlFor="restrictPayments"
                                       className="text-xs sm:text-base block mb-1 sm:font-bold">
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
                                <label htmlFor="restrictPayments"
                                       className="text-xs sm:text-base block mb-1 sm:font-bold">
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
                                <label htmlFor="restrictOrders"
                                       className="text-xs sm:text-base block mb-1 sm:font-bold">
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
                                <TimeRestrictions restrictOrdersTimes={ restrictOrdersTimes }
                                                  setValue={ setValue }/>
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
                        <button
                            type="submit"
                            className={ `w-full my-3 ${ s.BaseButton }` }
                        >
                            Создать
                        </button>
                        { requestErrors && <span className='text-red-600'>{ requestErrors }</span> }
                    </form>
                    { createNewDriverLoading && <Preloader/> }
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CreateNewDriver;