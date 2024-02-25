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
            const {agentId, token} = data;
            if (data.answer === '0') {
                debugger
                Cookies.set('token', token);
                Cookies.set('admin', String(data.admin));
                Cookies.set('agentId', String(agentId));
                router.push('/')
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
