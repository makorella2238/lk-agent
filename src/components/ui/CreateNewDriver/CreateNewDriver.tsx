import { Dispatch, SetStateAction } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Modal } from "@material-ui/core";
import s from "@/components/ui/genetal-css/general.module.css";
import Image from "next/image";

interface CreateNewDriverProps {
    setIsCreateNewDriverModal: Dispatch<SetStateAction<boolean>>;
    isModalOpen: boolean;
}

type FormData = {
    editid?: string;
    remove?: string;
    agentId: string;
    surname: string;
    name: string;
    patronymic?: string;
    dateBirth: string;
    telephone: string;
    driverLicenceSeries: string;
    driverLicenceNumber: string;
    driverLicenceCountry: string;
    driverLicenceDate: string;
    driverExpDate?: string;
    workUsl: string;
    inn?: string;
    ogrn?: string;
    ogrnip?: string;
    restrictOrders: string;
    restrictOrdersTime1?: string;
    restrictOrdersTime2?: string;
    restrictPayments: string;
    restrictPaymentsPercent?: string;
};

type inputField = {
    name: string;
    placeholder: string;
    required?: boolean;
};

const inputFields: inputField[] = [
    // {name: "editid", placeholder: "ID для редактирования"},
    // {name: "remove", placeholder: "remove"},
    // {name: "agentId", placeholder: "agentId", required: true},
    { name: "surname", placeholder: "Фамилия", required: true },
    { name: "name", placeholder: "Имя", required: true },
    { name: "patronymic", placeholder: "Отчество" },
    { name: "dateBirth", placeholder: "Дата рождения", required: true },
    { name: "telephone", placeholder: "Телефон", required: true },
    {
        name: "driverLicenceSeries",
        placeholder: "Серия ВУ",
        required: true,
    },
    {
        name: "driverLicenceNumber",
        placeholder: "Номер ВУ",
        required: true,
    },
    {
        name: "driverLicenceCountry",
        placeholder: "Страна выдачи ВУ",
        required: true,
    },
    {
        name: "driverLicenceDate",
        placeholder: "Дата выдачи ВУ",
        required: true,
    },
    { name: "driverExpDate", placeholder: "Водительский стаж" },
    { name: "workUsl", placeholder: "Условия работы", required: true },
    {
        name: "restrictOrders",
        placeholder: "Ограничение водителя для заказов",
        required: true,
    },
    { name: "restrictOrdersTime1", placeholder: "Время ОТ", required: true },
    { name: "restrictOrdersTime2", placeholder: "Время ДО", required: true },
    {
        name: "restrictPayments",
        placeholder: "Ограничение водителя для выплат",
        required: true,
    },
    {
        name: "restrictPaymentsPercent",
        placeholder: "Значение процента",
        required: true,
    },
];

const CreateNewDriver = ({
                             setIsCreateNewDriverModal,
                             isModalOpen,
                         }: CreateNewDriverProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<FormData>();
    const onSubmit: SubmitHandler<FormData> = (data) => {
        setIsCreateNewDriverModal(false);
        console.log(data);
    };

    const workUslValue = watch("workUsl");

    return (
        <Modal open={isModalOpen}>
            <div className="flex items-center justify-center h-screen">
                <div className="relative bg-white p-8 rounded-lg shadow-lg max-w-2xl">
                    <h2 className="text-center text-2xl font-bold mb-4">
                        Добавление водителя
                    </h2>
                    <Image
                        onClick={() => setIsCreateNewDriverModal(false)}
                        className="absolute top-3 right-3 cursor-pointer"
                        src="/x-mark.svg"
                        alt="X"
                        width={25}
                        height={25}
                    />
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-2 gap-4">
                            {inputFields.map((field: inputField) => (
                                <input
                                    key={field.name}
                                    {...register(field.name, { required: field.required })}
                                    type="text"
                                    placeholder={field.placeholder}
                                    className="border border-gray-300 p-2 rounded-lg"
                                />
                            ))}
                            <div className="col-span-2">
                                <label htmlFor="workUsl" className="block mb-1 font-medium">
                                    Условия работы
                                </label>
                                <select
                                    id="workUsl"
                                    {...register("workUsl", { required: true })}
                                    className="border border-gray-300 p-2 rounded-lg"
                                >
                                    <option value="">Выберите условия работы</option>
                                    <option value="Самозанятый">Самозанятый</option>
                                    <option value="ИП">ИП</option>
                                    <option value="ООО">ООО</option>
                                    <option value="физлицо">Физлицо</option>
                                </select>
                            </div>
                            {(workUslValue === "Самозанятый" ||
                                workUslValue === "ИП" ||
                                workUslValue === "ООО") && (
                                <input
                                    {...register("inn", { required: true })}
                                    type="text"
                                    placeholder="ИНН"
                                    className="border border-gray-300 p-2 rounded-lg"
                                />
                            )}
                            {(workUslValue === "ИП") && (
                                <input
                                    {...register("ogrnip", { required: true })}
                                    type="text"
                                    placeholder="ОГРНИП"
                                    className="border border-gray-300 p-2 rounded-lg"
                                />
                            )}
                            {(workUslValue === "ООО") && (
                                <input
                                    {...register("ogrn", { required: true })}
                                    type="text"
                                    placeholder="ОГРН"
                                    className="border border-gray-300 p-2 rounded-lg"
                                />
                            )}
                        </div>
                        <button
                            type="submit"
                            className={`w-full mt-3 ${s.BaseButton}`}
                        >
                            Отправить
                        </button>
                    </form>
                </div>
            </div>
        </Modal>
    );
};

export default CreateNewDriver;