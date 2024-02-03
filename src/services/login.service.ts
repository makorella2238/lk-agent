import axios from 'axios';
import {authResponse} from "@/interfaces/types";

axios.defaults.baseURL = process.env.API_URL;

export const LoginService = {
    async login(login: string, password: string) {
        // @ts-ignore
        const { data } = await axios.get<authResponse>('agent.auth&token=a5842677d46463e1f5b9de0db8d0d6aba17b158d8a', {login, password});
        return data;
    },
};