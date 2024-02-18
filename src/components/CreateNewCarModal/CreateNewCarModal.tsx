import Image from "next/image";
import s from "@/components/ui/genetal-css/general.module.css";
import {Modal} from "@material-ui/core";
import React, {useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {ICarInfo, inputField} from "@/interfaces/types";
import {useParams} from "next/navigation";
import {useCreateNewCar} from "@/hooks/drivers/drivers";

const inputFields: inputField[] = [
    {name: "mark", placeholder: "Марка ", required: true},
    {name: "model", placeholder: "Модель ", required: true},
    {name: "color", placeholder: "Цвет "},
    {name: "year", placeholder: "Год ", required: true},
    {
        name: "plateNumber",
        placeholder: "Госномер",
        required: true,
        pattern: {
            value: /^[А-Я]{1}\d{3}[А-Я]{2}\d{3}$/,
            message: "Введите Госномер автомобиля в формате aXXXaaXXX, где a - это заглавные буквы русского алфавита, X - это цифры. Например, А123БВ456"
        }
    },
    {name: "vin", placeholder: "VIN"},
    {name: "bodyNumber", placeholder: "Номер кузова", required: true},
    {name: "certificateSeries", placeholder: "Серия СТС", required: true},
    {name: "certificateNumber", placeholder: "Номер СТС"},
];

type CreateNewCarModalProps = {
    isCreateNewCarModal: boolean
    setIsCreateNewCarModal: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateNewCarModal = ({isCreateNewCarModal, setIsCreateNewCarModal}: CreateNewCarModalProps) => {
    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<ICarInfo>();
    const params = useParams()
    const [requestErrors, setRequestErrors] = useState('')
    const handleCreateNewCar = useCreateNewCar(setRequestErrors)
    const onSubmit: SubmitHandler<ICarInfo> = (requestData) => {
        handleCreateNewCar(requestData, params.driverId)
        if (!requestErrors) {
            setIsCreateNewCarModal(false)
        }
    };


    return (
        <Modal open={ isCreateNewCarModal }>
            <div className="flex items-center justify-center h-screen">
                <div className="relative bg-white p-8 rounded-lg shadow-lg max-w-3xl">
                    <h2 className="text-center text-2xl font-bold mb-4">
                        Добавление автомобиля
                    </h2>
                    <Image
                        onClick={ () => setIsCreateNewCarModal(false) }
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
                                    { ...register(field.name, {required: field.required, pattern: field.pattern}) }
                                    type="text"
                                    placeholder={ field.placeholder }
                                    className="border border-gray-300 p-2 rounded-lg"
                                />
                            )) }
                        </div>
                            {errors.plateNumber && <span className='text-red-600'>{errors.plateNumber.message}</span>}
                        <button
                            type="submit"
                            className={ `w-full mt-3 ${ s.BaseButton }` }
                        >
                            Создать
                        </button>
                        {requestErrors && <span className='text-red-600'>{requestErrors}</span>}
                    </form>
                </div>
            </div>
        </Modal>
    );
}

export default CreateNewCarModal;