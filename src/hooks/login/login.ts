"use client"

import {useMutation} from "@tanstack/react-query";
import {setIsAuthTrue} from "@/Redux/app/app-slice";
import {Dispatch, SetStateAction} from "react";
import { ILoginResponse} from "@/interfaces/types";
import {mainService} from "@/services/main.service";
import {useDispatch} from "react-redux";
import {useRouter} from "next/navigation";
import Cookies from "js-cookie";



export const LoginMutation = (setRequestErrors:  Dispatch<SetStateAction<number | null>>) => {
    const dispatch = useDispatch()
    const router = useRouter()
    const Login = useMutation({
        mutationKey: ['login'],
        // @ts-ignore
        mutationFn: ({password, login}) => {
            return  mainService.login({password, login})
        },
        onSuccess: (data: ILoginResponse) => {
            setRequestErrors(data.answer)
            const {agentId, token} = data;
            Cookies.set('token', token);
            Cookies.set('agentId', String(agentId));
            router.push('/')
        },
        onError: (error: string) => {
            console.log(error)
        }
    })

    // @ts-ignore
    const handleLogin = ({password, login}) => {
        // @ts-ignore
        Login.mutate({ password, login});
    };
    return handleLogin
}
