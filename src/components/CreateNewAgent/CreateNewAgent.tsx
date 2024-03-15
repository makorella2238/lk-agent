import React, {Dispatch, SetStateAction, useState} from "react";
import {useForm} from "react-hook-form";
import s from "@/components/ui/genetal-css/general.module.css";
import {inputField} from "@/interfaces/types";
import Preloader from "@/components/Preloader/Preloader";
import {Dialog, DialogContent, DialogTitle} from "@material-ui/core";
import {useCreateNewAgent, useGetCafeList} from "@/hooks/admin/admin";

interface CreateNewAgentProps {
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    isModalOpen: boolean;
}

export const inputAgentFields: inputField[] = [
    {name: "city", placeholder: "Город", required: true},
    {name: "name", placeholder: "Наименование", required: true},
    {name: "legalName", placeholder: "Наименование юридического лица", required: true},
    {name: "addressLegal", placeholder: "Юридический адрес", required: true},
    {name: "addressFact", placeholder: "Фактический адрес", required: true},
    {name: "addressMail", placeholder: "Адрес для корреспонденции", required: true},
    {name: "email", placeholder: "E-mail", required: true},
    {name: "telephoneCeo", placeholder: "Телефон руководителя", required: true},
    {name: "telephoneCommon", placeholder: "Телефон общий", required: true},
];

const CreateNewAgent = ({
                             setIsModalOpen,
                             isModalOpen,
                         }: CreateNewAgentProps) => {
    const {
        register,
        handleSubmit,
        formState: {errors},
        watch,
        reset,
        setValue,
    } = useForm();
    const [enabled, setEnabled] = useState(false);
    const [requestErrors, setRequestErrors] = useState('');
    const [createNewAgentLoading, setCreateNewAgentLoading] = useState(false);
    const handleCreateNewDriver = useCreateNewAgent(setRequestErrors, setCreateNewAgentLoading)
    const workUslValue = watch("workUsl");
    const categoryValue = watch("category");
    const myCouriersValue = watch("myCouriers");

    const {data, isFetching, error} = useGetCafeList(categoryValue, enabled)
    if (error) {
        return <p className="text-red-600">Ошибка при получении данных</p>;
    }

    const onSubmit = (requestData: any) => {
        const {category, cafe, ...formattedData} = requestData;
        formattedData.block = -1;

        if (cafe) {
            formattedData.myCouriers = cafe;
        } else {
            formattedData.myCouriers = -1;
        }

        handleCreateNewDriver(formattedData);
        setIsModalOpen(false);
    };

    function handleCloseModal() {
        setIsModalOpen(false);
        reset()
    }

    const handleCategoryChange = (e: { target: { value: any; }; }) => {
        const categoryValue = e.target.value;
        setValue("category", categoryValue);
        if (categoryValue === 'food' || categoryValue === 'product') {
            setEnabled(true);
        }
    };

    const handleMyCouriersChange = (e: { target: { value: any; }; }) => {
        const myCouriers = e.target.value
        setValue('myCouriers', myCouriers)
        setValue('category', '');
        setValue('cafe', '');
    };

    return (
        <Dialog open={ isModalOpen } onClose={ handleCloseModal } aria-labelledby="form-dialog-title"
                maxWidth='md'>
            <DialogTitle id="form-dialog-title"><p className="text-center text-2xl font-bold">Добавление
                агента</p></DialogTitle>
            <DialogContent>
                <div className="bg-white p-1 sm:p-8 rounded-lg shadow-lg max-w-3xl">
                    <form onSubmit={ handleSubmit(onSubmit) }>
                        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-2">
                            { inputAgentFields.map((field: inputField) => (
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


                            <div className="col-span-2">
                                <label htmlFor='inn' className='text-xs sm:text-base sm:font-bold'>Программа «Свои курьеры» </label>
                                <select { ...register('myCouriers') }
                                        className="border border-gray-300 p-2 rounded-lg w-full" onChange={handleMyCouriersChange}>
                                    <option value="">Выберите вариант</option>
                                    <option value="1">Да</option>
                                    <option value="-1">Нет</option>
                                </select>
                            </div>

                            { myCouriersValue === '1' && (
                                <>
                                    <div className='col-span-2'>
                                        <label>Категория:</label>
                                        <select { ...register('category') } onChange={ handleCategoryChange }
                                                className="border border-gray-300 p-2 rounded-lg w-full">
                                            <option value="">Выберите категорию</option>
                                            <option value="food">Еда</option>
                                            <option value="product">Товары</option>
                                        </select>
                                    </div>
                                    { categoryValue && data && data.cafes && <div className='col-span-2'>
                                        <label>Заведение:</label>
                                        <select { ...register('cafe') }
                                                className="border border-gray-300 p-2 rounded-lg w-full">
                                            <option value="">Выберите заведения</option>
                                            { data && data.cafes.map((cafe) => (
                                                <option key={ cafe.id } value={ cafe.id }>{ cafe.name }</option>
                                            )) }
                                        </select>
                                    </div>}
                                </>
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
                                        id='inn'
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
                                        id='ogrnip'
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
                                        id='ogrn'
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
                    { createNewAgentLoading || isFetching && <Preloader/> }
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CreateNewAgent;