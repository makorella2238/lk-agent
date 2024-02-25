'use client'

import axios from 'axios';
import md5 from "md5";
import {
    IAllDriverOrders,
    IAllDrivers,
    ICarInfo,
    IDriverAnalytic,
    IDriverInfo,
    IDriverTransactions,
    IPaymentsAgent
} from "@/interfaces/types";
import Cookies from 'js-cookie';
import {IOrderDetails} from "@/components/screen/DetailOrder/DetailOrder";

const instance = axios.create({
    withCredentials: true,
    baseURL: 'http://95.154.93.88:32768/'
});

axios.interceptors.response.use(
    config => config,
    async error => {
        const originalRequest = error.config;

        if (
            error?.response?.data?.answer === -1 && // Проверка значения answer
            originalRequest &&
            !originalRequest._isRetry
        ) {
            originalRequest._isRetry = true;
            Cookies.remove('token');
            Cookies.remove('agentId');
        }

        throw error;
    }
);

const doubleMd5 = (password: string) => {
    const hash1 = md5(password).toString();
    return md5(hash1).toString();
};

const agentId = Cookies.get('agentId')
const token = Cookies.get('token')
export const mainService = {
    // @ts-ignore
    async login({login, password}) {
        const {data} = await instance.get(`api/?method=agent.auth&login=${ login }&password=${ doubleMd5(password) }`);
        return data;
    },
    async getPaymentsAgent() {
        const {data} = await instance.get<IPaymentsAgent>(`api/?method=agent.payments&token=${token}&agentId=${ agentId }`);
        return data;
    },
    async getAllDrivers({offset, count, idAgent, newToken}: { offset: number, count: number, idAgent: string, newToken: string }) {
        const {data} = await instance.get<IAllDrivers>(`api/?method=driver.getall&token=${newToken}&agentId=${ idAgent }&offset=${ offset }&count=${ count }`);
        return data;
    },

    async getAllOrders({offset, count, driverId}: { offset: number, count: number, driverId: string }) {
        const {data} = await instance.get<IAllDriverOrders>(`api/?method=driver.orderlist&token=${token}&driverId=${ driverId }&offset=${ offset }&count=${ count }`);
        return data;
    },

    async gerOrderDetails({driverId, orderId}: { driverId: string, orderId: string }) {
        const {data} = await instance.get<IOrderDetails>(`api/?method=driver.orderinfo&token=${token}&driverId=${ driverId }&orderId=${ orderId }`,);
        return data;
    },
    async getDriverInfo({driverId}: { driverId: number }) {
        const {data} = await instance.get<IDriverInfo>(`api/?method=driver.get&token=${token}&driverId=${ driverId }`,);
        return data;
    },

    async getCarInfo({driverId}: { driverId: number }) {
        const {data} = await instance.get<ICarInfo>(`api/?method=driver.cars&token=${token}&driverId=${ driverId }`);
        return data;
    },
    async getDriverAnalytics({driverId, dateFrom, dateTo}: { driverId: number, dateFrom: string, dateTo: string }) {
        const {data} = await instance.get<IDriverAnalytic>(`api/?method=driver.analytics&token=${token}&driverId=${ driverId }&dateFrom=${ dateFrom }&dateTo=${ dateTo }`);
        return data;
    },
    async getDriverTransactions({driverId}: { driverId: string }) {
        const {data} = await instance.get<IDriverTransactions>(`api/?method=driver.transactions&token=${token}&driverId=${ driverId }`);
        return data;
    },

    async createNewCar(requestData: ICarInfo, driverId: string) {
        const formData = new FormData();
        //@ts-ignore
        formData.append('agentId', agentId);
        //@ts-ignore
        formData.append('driverId', requestData.driverId);
        formData.append('token', token);
        formData.append('method', 'driver.car_addedit');

        //@ts-ignore
        Object.entries(requestData.requestData).forEach(([key, value]) => {// @ts-ignore
            console.log(formData)
            // @ts-ignore
            formData.append(key, value);
        });

        const {data} = await instance.post('api/?method=', formData);
        return data;
    },

    async createNewDriver({requestData}: any) {
        const modifiedRequestData = new FormData();
        //@ts-ignore
        modifiedRequestData.append('agentId', agentId);
        modifiedRequestData.append('token', token);
        modifiedRequestData.append('method', 'driver.addedit');

        Object.entries(requestData.requestData).forEach(([key, value]) => {// @ts-ignore
            console.log(modifiedRequestData)
            // @ts-ignore
            modifiedRequestData.append(key, value);
        });

        const {data} = await instance.post('api/?method=', modifiedRequestData);

        return data;
    },

    async editDriver({requestData, driverId}: any) {
        const modifiedRequestData = new FormData();
        // @ts-ignore
        modifiedRequestData.append('agentId', agentId);
        modifiedRequestData.append('token', token);
        modifiedRequestData.append('method', 'driver.addedit');
        modifiedRequestData.append('editid', requestData.driverId);

        Object.entries(requestData.requestData).forEach(([key, value]) => {
            // @ts-ignore
            modifiedRequestData.append(key, value);
        });

        const {data} = await instance.post('api/?method=', modifiedRequestData);
        return data;
    },

    async deleteDriver(driverId: number) {
        const modifiedRequestData = new FormData();
        // @ts-ignore
        modifiedRequestData.append('agentId', agentId);
        modifiedRequestData.append('token', token);
        modifiedRequestData.append('method', 'driver.addedit');
        // @ts-ignore
        modifiedRequestData.append('remove', 1);
        // @ts-ignore
        modifiedRequestData.append('editid', driverId.toString());

        const {data} = await instance.post('api/?method=', modifiedRequestData);
        return data;
    }

}