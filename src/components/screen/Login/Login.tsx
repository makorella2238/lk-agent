'use client'

import md5 from 'md5'
import {useForm, SubmitHandler} from "react-hook-form"
import {ILogin} from "@/interfaces/types";

const LoginForm = () => {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<ILogin>()

    const doubleMd5 = (password: string) => {
        const hash1 = md5(password).toString();
        return md5(hash1).toString();
    };

    const onSubmit: SubmitHandler<ILogin> = (data: ILogin) => {
        const {password, login} = data
        console.log( login, doubleMd5(password))
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-white p-10 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-5">Login</h2>
                <form className="space-y-4" onSubmit={ handleSubmit(onSubmit) }>
                    <div>
                        <label htmlFor="login" className="block text-gray-600">Login</label>
                        <input type="text"
                               id="login"
                               className="w-full border rounded-md py-2 px-3 text-gray-700 mt-1 focus:outline-none focus:ring focus:border-blue-300"
                               { ...register("login", {required: true}) }/>
                        {errors.login && <span className='text-red-600'>Это поле обязательное для заполнения</span>}

                    </div>
                    <div>
                        <label htmlFor="password" className="block text-gray-600">Password</label>
                        <input type="password"
                               id="password"
                               className="w-full border rounded-md py-2 px-3 text-gray-700 mt-1 focus:outline-none focus:ring focus:border-blue-300"
                               { ...register("password", {required: true}) }/>
                        {errors.password && <span className='text-red-600'>Это поле обязательное для заполнения</span>}
                    </div>
                    <button type="submit"
                            className="w-full bg-blue-500 text-white font-semibold rounded-md py-2 hover:bg-blue-600 transition duration-300">Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;
