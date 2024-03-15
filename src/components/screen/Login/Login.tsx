'use client'

import {useForm} from "react-hook-form"
import {ILogin} from "@/interfaces/types";
import {useEffect, useState} from "react";
import {LoginMutation} from "@/hooks/login/login";
import s from '@/components/ui/genetal-css/general.module.css'
import {useSelector} from "react-redux";
import {getIsAuth} from "@/Redux/app/app-selector";
import {useRouter} from "next/navigation";

const LoginForm = () => {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<ILogin>()
    const [requestErrors, setRequestErrors] = useState<string | null>(null)

    const handleLogin = LoginMutation(setRequestErrors)

    const onSubmit = (data: {password: string, login: string}) => {
        const {password, login} = data
        handleLogin({login, password})
    }

    useEffect(() => {
        const handleKeyPress = (event: { key: string; preventDefault: () => void; }) => {
            if (event.key === "Enter") {
                event.preventDefault();
                handleSubmit(onSubmit)();
            }
        };

        document.addEventListener("keypress", handleKeyPress);

        return () => {
            document.removeEventListener("keypress", handleKeyPress);
        };
    }, [handleSubmit, onSubmit]);

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-white p-10 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-5">Авторизация</h2>
                <form className="space-y-4" onSubmit={ handleSubmit(onSubmit) }>
                    <div>
                        <label htmlFor="login" className="block text-gray-600">Логин</label>
                        <input type="text"
                               id="login"
                               className="w-full border rounded-md py-2 px-3 text-gray-700 mt-1 focus:outline-none focus:border-3 focus:border-emerald-600"
                               { ...register("login", {required: true}) }/>
                        {errors.login && <span className='text-red-600'>Это поле обязательное для заполнения</span>}

                    </div>
                    <div>
                        <label htmlFor="password" className="block text-gray-600">Пароль</label>
                        <input type="password"
                               id="password"
                               className="w-full border rounded-md py-2 px-3 text-gray-700 mt-1 focus:outline-none focus:border-3 focus:border-emerald-600"
                               { ...register("password", {required: true}) }/>
                        {errors.password && <span className='text-red-600'>Это поле обязательное для заполнения</span>}
                    </div>
                    <span className='text-red-600 text-lg'>{requestErrors && requestErrors === '1' && 'не все аргументы заполнены' || requestErrors === '2' && 'Логин или пароль введён неверно'}</span>
                    <button type="submit"
                            className={`w-full ${s.BaseButton}`}>Войти
                    </button>
                </form>
            </div>
        </div>
    )
}

export default LoginForm;
