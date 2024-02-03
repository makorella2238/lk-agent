"use client"

import {LoginService} from "@/services/login.service";
import {useQuery} from "@tanstack/react-query";
import {authResponse} from "@/interfaces/types";
export const useLogin = (login: string, password: string) => {
     // @ts-ignore
     return useQuery<authResponse>({queryKey:['login'], queryFn: LoginService.login(login, password)});
}
