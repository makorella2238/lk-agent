import React, {useEffect, useState} from 'react';
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import s from "@/components/ui/genetal-css/general.module.css";
import {useEditDriver} from "@/hooks/drivers/drivers";
import {useForm} from "react-hook-form";
import {IDriverInfo} from "@/interfaces/types";
import {useQueryClient} from "@tanstack/react-query";
import TimeRestrictions from "@/components/ui/TimeRestrictions/TimeRestrictions";

type LimitsModalProps = {
    driverId: string | string[]
    open: boolean
    onClose: () => void
    setEditDriverLoading: React.Dispatch<React.SetStateAction<boolean>>
    data: IDriverInfo
}

const LimitsModal = ({driverId, onClose, open, setEditDriverLoading, data}: LimitsModalProps) => {

    const {
        register,
        handleSubmit,
        watch,
        setValue
    } = useForm();

    const [requestErrors, setRequestErrors] = useState('');

    const handleEditDriver = useEditDriver(setRequestErrors, setEditDriverLoading)
    const restrictPayments = watch("restrictPayments");
    const restrictOrders = watch("restrictOrders");
    const restrictOrdersTimes = watch("restrictOrdersTimes");

    useEffect(() => {
        if (data) {
            setValue("restrictPayments", data.restrictPayments);
            setValue("restrictOrders", data.restrictOrders);
            setValue("restrictOrdersTimes", data.restrictOrdersTimes && data.restrictOrdersTimes);
            setValue("restrictPaymentsPercent", data.restrictPaymentsPercent && data.restrictPaymentsPercent);
        }
    }, [data, setValue]);

    const onSubmit = (requestData: any) => {
        const formattedData = {
            ...data,
            ...requestData
        }
        if (!formattedData.restrictPaymentsPercent) {
            delete formattedData.restrictPaymentsPercent
        }
        handleEditDriver(formattedData, String(driverId))
        onClose()
    };

    return (
        <Dialog open={ open } onClose={ onClose } aria-labelledby="form-dialog-title" maxWidth='md'>
            <DialogTitle id="form-dialog-title"><h2
                className="text-center text-xl sm:text-2xl font-bold p-2 sm:p-5">Ограничения водителя</h2></DialogTitle>
            <DialogContent>
                <div className='flex flex-col gap-2 sm:gap-4 text-sm sm:text-base'>
                    <form onSubmit={ handleSubmit(onSubmit) }>
                        <div className='mb-2 sm:mb-4 text-sm sm:text-base'>
                            <label htmlFor="restrictPayments"
                                   className="block mb-1 sm:font-bold">
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
                        { restrictPayments === 'percent' && <div className='mb-2 sm:mb-4 text-sm sm:text-base'>
                            <label htmlFor="restrictPaymentsPercent"
                                   className="text-sm sm:text-base block mb-1">
                                Значение процента
                            </label>
                            <input
                                { ...register("restrictPaymentsPercent", {required: true}) }
                                id='restrictPaymentsPercent'
                                type="text"
                                placeholder='Значение процента'
                                className="border border-gray-300 p-2 rounded-lg w-full"
                            />
                        </div> }

                        <div className='mb-2 sm:mb-4 text-sm sm:text-base'>
                            <label htmlFor="restrictOrders"
                                   className="block mb-1 sm:font-bold">
                                Ограничение водителя
                            </label>
                            <select
                                id="restrictOrders"
                                { ...register("restrictOrders", {required: true}) }
                                className="border border-gray-300 p-2 rounded-lg w-full"
                            >
                                <option value="">Ограничение водителя</option>
                                <option value="my">Отображать заказы только своего заведения всегда</option>
                                <option value="my_times">Отображать заказы только в определенные времена</option>
                                <option value="all">Отображать все заказы</option>
                            </select>
                        </div>

                        { restrictOrders === 'my_times' && (
                            <TimeRestrictions restrictOrdersTimes={ restrictOrdersTimes } setValue={ setValue }/>
                        ) }

                        <DialogActions>
                            <div className='flex flex-col gap-3 sm:flex sm:flex-row'>
                                <button
                                    type="button"
                                    onClick={ onClose }
                                    className={ s.BaseButton }
                                >
                                    Отменить
                                </button>
                                <button
                                    type="submit"
                                    className={ s.BaseButton }>
                                    Применить
                                </button>
                            </div>
                        </DialogActions>
                    </form>
                    { requestErrors && <span className='text-red-600'>{ requestErrors }</span> }
                </div>
            </DialogContent>
        </Dialog>
    )
        ;
};

export default LimitsModal;