"use client"

import {useMutation} from "@tanstack/react-query";
import {Dispatch, SetStateAction} from "react";
import {ILoginResponse} from "@/interfaces/types";
import {mainService} from "@/services/main.service";
import {useRouter} from "next/navigation";
import Cookies from "js-cookie";


export const LoginMutation = (setRequestErrors: Dispatch<SetStateAction<string | null>>) => {
    const router = useRouter()
    const Login = useMutation({
        mutationKey: ['login'],
        mutationFn: ({password, login}: {password: string, login: string}) => {
            return mainService.login({password, login})
        },
        onSuccess: (data: ILoginResponse) => {
            setRequestErrors(data.answer)
            const {token} = data;
            if (data.answer === '0' && data.admin === -1) {
                Cookies.set('token', token, {secure: true, sameSite: 'strict' });
                router.push('/')
            }
            if (data.answer === '0' && data.admin === 1) {
                Cookies.set('token', token, {secure: true, sameSite: 'strict' });
                router.push('/admin')
            }
        },
        onError: (error: string) => {
            console.log(error)
        }
    })

    // @ts-ignore
    const handleLogin = ({password, login}) => {
        // @ts-ignore
        Login.mutate({password, login});
    };
    return handleLogin
}
