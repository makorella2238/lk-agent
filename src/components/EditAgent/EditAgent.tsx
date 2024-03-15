import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import s from "@/components/ui/genetal-css/general.module.css";
import {inputField} from "@/interfaces/types";
import Preloader from "@/components/Preloader/Preloader";
import {Dialog, DialogContent, DialogTitle} from "@material-ui/core";
import {useEditAgent, useGetAgentInfo, useGetCafeList} from "@/hooks/admin/admin";
import {inputAgentFields} from "@/components/CreateNewAgent/CreateNewAgent";

interface CreateNewDriverProps {
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    isModalOpen: boolean;
    agentId: number | null
}

const EditDriver = ({
                        setIsModalOpen,
                        isModalOpen,
                        agentId
                    }: CreateNewDriverProps) => {
    const {
        register,
        handleSubmit,
        formState: {errors},
        watch,
        setValue,
        reset
    } = useForm();
    const [enabled, setEnabled] = useState(false);
    const categoryValue = watch("category");
    const myCouriersValue = watch("myCouriers");

    const {data, isFetching, error} = useGetAgentInfo(agentId)

    useEffect(() => {
        if (data && data.myCouriers !== 1 || myCouriersValue === 1) {
            setEnabled(true)
        }
    }, [data, myCouriersValue]);

    const {
        data: cafeListData,
        isFetching: cafeListIsFetching,
        error: cafeListError
    } = useGetCafeList(categoryValue, enabled)

    useEffect(() => {
        if (data) {
            setValue("city", data.city);
            setValue("name", data.name);
            setValue("legalName", data.legalName);
            setValue("workUsl", data.workUsl);
            setValue("addressLegal", data.addressLegal);
            setValue("addressFact", data.addressFact);
            setValue("addressMail", data.addressMail);
            setValue("email", data.email);
            setValue("telephoneCeo", data.telephoneCeo);
            setValue("telephoneCommon", data.telephoneCommon);
            setValue("myCouriers", data.myCouriers === -1 ? '-1' : '1');
            setValue("cafe", data.myCouriers !== -1 && data.myCouriers);
            setValue("category", data.myCouriersCategory);
            setValue("block", data.block);
            setValue("inn", data.inn || "");
            setValue("ogrnip", data.ogrnip || "");
            setValue("ogrn", data.ogrn || "");
        }
    }, [data, setValue]);

    if (error || cafeListError) {
        return <p className="text-red-600">Ошибка при получении данных</p>;
    }

    const [editAgentLoading, setEditAgentLoading] = useState(false);

    const [requestErrors, setRequestErrors] = useState('');
    const handleAgentEdit = useEditAgent(setRequestErrors, setEditAgentLoading)

    const onSubmit = (requestData: any) => {
        const {category, cafe, ...formattedData} = requestData;
        if (agentId != null) {
            delete formattedData.cafe
            if (requestData.ogrn === '') {
                delete formattedData.ogrn
            }
            if (requestData.ogrnip === '') {
                delete formattedData.ogrnip
            }
            if (cafe) {
                formattedData.myCouriers = cafe;
            } else {
                formattedData.myCouriers = '-1';

            }
            handleAgentEdit({requestData: formattedData, agentId})
        }
        setIsModalOpen(false)
    };

    const workUslValue = watch("workUsl");

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

    function handleCloseModal() {
        setIsModalOpen(false);
        reset({
            city: '',
            name: '',
            legalName: '',
            workUsl: '',
            addressLegal: '',
            addressFact: '',
            addressMail: '',
            email: '',
            telephoneCeo: '',
            telephoneCommon: '',
            myCouriers: '',
            block: -1,
            inn: '',
            ogrnip: '',
            ogrn: ''
        });
    }

    return (
        <Dialog open={ isModalOpen } onClose={ handleCloseModal } aria-labelledby="form-dialog-title"
                maxWidth='md'>
            <DialogTitle id="form-dialog-title"><p className="text-center text-2xl font-bold">Редактирование
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
                                <label htmlFor="block" className="text-xs sm:text-base block mb-1 sm:font-bold">
                                    Блокировка
                                </label>
                                <select
                                    id="block"
                                    { ...register("block", {required: true}) }
                                    className="border border-gray-300 p-2 rounded-lg w-full"
                                >
                                    <option value="">Выберите блокировку</option>
                                    <option value="1">Да</option>
                                     <option value="-1">Нет</option>
                                </select>
                            </div>

                            <div className="col-span-2">
                                <label htmlFor='inn' className='text-xs sm:text-base sm:font-bold'>Программа «Свои
                                    курьеры» </label>
                                <select { ...register('myCouriers') }
                                        className="border border-gray-300 p-2 rounded-lg w-full"
                                        onChange={ handleMyCouriersChange }>
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
                                    { categoryValue && cafeListData && <div className='col-span-2'>
                                        <label>Заведение:</label>
                                        <select { ...register('cafe') }
                                                className="border border-gray-300 p-2 rounded-lg w-full">
                                            <option value="">Выберите заведения</option>
                                            { cafeListData && cafeListData.cafes.map((cafe) => (
                                                <option key={ cafe.id } value={ cafe.id }>{ cafe.name }</option>
                                            )) }
                                        </select>
                                    </div> }
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
                        <button
                            type="submit"
                            className={ `w-full my-3 ${ s.BaseButton }` }
                        >
                            Редактировать
                        </button>
                        { requestErrors && <span className='text-red-600'>{ requestErrors }</span> }
                    </form>
                    { editAgentLoading || isFetching || cafeListIsFetching && <Preloader/> }
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EditDriver;