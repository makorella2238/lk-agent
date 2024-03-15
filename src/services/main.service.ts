'use client'

import axios from 'axios';
import md5 from "md5";
import {
    IAddEditAgent,
    IAllAgent,
    IAllDriverOrders,
    IAllDrivers, ICafeList,
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
            error?.response?.data?.answer === -1
            // originalRequest &&
            // !originalRequest._isRetry
        ) {
            originalRequest._isRetry = true;
            Cookies.remove('token');
        }
        throw error;
    }
);
const doubleMd5 = (password: string) => {
    const hash1 = md5(password).toString();
    return md5(hash1).toString();
};

const token = Cookies.get('token')
export const mainService = {
    // @ts-ignore
    async login({login, password}) {
        const {data} = await instance.get(`api/?method=agent.auth&login=${ login }&password=${ doubleMd5(password) }`);
        return data;
    },
    async getAgentId() {
        const newToken = Cookies.get('token')
        const {data} = await instance.get(`api/?method=agent.id&token=${newToken}`);
        if (data.answer === '-1' || data.answer === '1') {
            Cookies.remove('token');
        }
        return data;
    },
    async getPaymentsAgent(filter_dateRequestPayment1?: string, filter_dateRequestPayment2?: string, filter_status?: string) {
        const agentIdData = await mainService.getAgentId()
        const CookieAgentId = Cookies.get('agentId')
        let queryString = `api/?method=agent.payments&token=${token}&agentId=${ CookieAgentId || agentIdData.agentId }`

        if (filter_dateRequestPayment1) {
            queryString += `&filter_dateRequestPayment1=${filter_dateRequestPayment1}`;
        }
        if (filter_dateRequestPayment2) {
            queryString += `&filter_dateRequestPayment2=${filter_dateRequestPayment2}`;
        }
        if (filter_status) {
            queryString += `&filter_status=${filter_status}`;
        }

        const {data} = await instance.get<IPaymentsAgent>(queryString);
        return data;
    },
    async getAllAgents({offset, count, filter_name, filter_legalName, filter_inn, filter_city}: { offset: number, count: number, filter_city?: string, filter_name?: string, filter_legalName?: string, filter_inn?: string}) {
        debugger
        const newToken = Cookies.get('token')
        let queryString = `api/?method=agent.getall&token=${newToken}&offset=${ offset }&count=${ count }`

        if (filter_city) {
            queryString += `&filter_city=${ filter_city }`;
        }
        if (filter_name) {
            queryString += `&filter_name=${ filter_name }`;
        }
        if (filter_legalName) {
            queryString += `&filter_legalName=${ filter_legalName }`;
        }
        if (filter_inn) {
            queryString += `&filter_inn=${ filter_inn }`;
        }
        const {data} = await instance.get<IAllAgent>(queryString);
        debugger
        return data;
    },
    async getCafeList({type}: { type: string}) {
        const {data} = await instance.get<ICafeList>(`api/?method=cafe.getlist&token=${token}&type=${type}`);
        return data;
    },
    async getAllDrivers({offset, count, filter_patronymic, filter_surname, filter_telephone, filter_status, filter_workUsl, filter_name}: { offset: number, count: number, filter_surname?: string, filter_name?: string, filter_patronymic?: string, filter_telephone?: string, filter_status?: string, filter_workUsl?: string}) {
        const agentIdData = await mainService.getAgentId();
        const CookieAgentId = Cookies.get('agentId');
        const newToken = Cookies.get('token');

        let queryString = `api/?method=driver.getall&token=${newToken}&agentId=${CookieAgentId || agentIdData.agentId}&offset=${offset}&count=${count}`;

        if (filter_surname) {
            queryString += `&filter_surname=${filter_surname}`;
        }

        if (filter_name) {
            queryString += `&filter_name=${filter_name}`;
        }

        if (filter_patronymic) {
            queryString += `&filter_patronymic=${filter_patronymic}`;
        }

        if (filter_telephone) {
            queryString += `&filter_telephone=${filter_telephone}`;
        }

        if (filter_status) {
            queryString += `&filter_status=${filter_status}`;
        }

        if (filter_workUsl) {
            queryString += `&filter_workUsl=${filter_workUsl}`;
        }

        const {data} = await instance.get<IAllDrivers>(queryString);
        return data;
    },
    async getAllOrders({offset, count, driverId, filter_carMark, filter_carModel, filter_status, filter_type, filter_dateTimeCourierDone1, filter_dateTimeCourierDone2 }: { offset: number, count: number, driverId: string, filter_carMark?: string, filter_carModel?: string, filter_status?: string, filter_type?: string, filter_dateTimeCourierDone1?: string, filter_dateTimeCourierDone2?: string }) {
        let queryString =`api/?method=driver.orderlist&token=${token}&driverId=${ driverId }&offset=${ offset }&count=${ count }`

        if (filter_carMark) {
            queryString += `&filter_carMark=${filter_carMark}`;
        }
        if (filter_carModel) {
            queryString += `&filter_carModel=${filter_carModel}`;
        }
        if (filter_status) {
            queryString += `&filter_status=${filter_status}`;
        }
        if (filter_type) {
            queryString += `&filter_type=${filter_type}`;
        }
        if (filter_dateTimeCourierDone1) {
            queryString += `&filter_dateTimeCourierDone1=${filter_dateTimeCourierDone1}`;
        }
        if (filter_dateTimeCourierDone2) {
            queryString += `&filter_dateTimeCourierDone2=${filter_dateTimeCourierDone2}`;
        }

        const {data} = await instance.get<IAllDriverOrders>(queryString);
        return data;
    },
    async gerOrderDetails({driverId, orderId}: { driverId: string, orderId: string }) {
        const {data} = await instance.get<IOrderDetails>(`api/?method=driver.orderinfo&token=${token}&driverId=${ driverId }&orderId=${ orderId }`,);
        return data;
    },
    async getDriverInfo({driverId}: { driverId: number }) {
        const newToken = Cookies.get('token')

        const {data} = await instance.get<IDriverInfo>(`api/?method=driver.get&token=${newToken}&driverId=${ driverId }`,);
        return data;
    },
    async getAgentInfo({agentId}: { agentId: any }) {
        const newToken = Cookies.get('token')
        const {data} = await instance.get<IAddEditAgent>(`api/?method=agent.getinfo&token=${newToken}&agentId=${ agentId }`,);
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
    async getAllDriverAnalytics({ dateFrom, dateTo}: { dateFrom: string, dateTo: string }) {
        const CookieAgentId = Cookies.get('agentId')
        const agentIdData = await mainService.getAgentId()

        const {data} = await instance.get<IDriverAnalytic>(`api/?method=driver.analytics&token=${token}&driverId=${ CookieAgentId || agentIdData.agentId }&dateFrom=${ dateFrom }&dateTo=${ dateTo }`);
        return data;
    },
    async getDriverTransactions({driverId}: { driverId: string }) {
        const {data} = await instance.get<IDriverTransactions>(`api/?method=driver.transactions&token=${token}&driverId=${ driverId }`);
        return data;
    },

    async createNewAgent({requestData}: any) {
        const modifiedRequestData = new FormData();
        modifiedRequestData.append('token', token);
        modifiedRequestData.append('method', 'agent.addedit');

        Object.entries(requestData.requestData).forEach(([key, value]) => {// @ts-ignore
            modifiedRequestData.append(key, value);
        });

        const {data} = await instance.post('api/?method=', modifiedRequestData);

        return data;
    },
    async createNewDriver({requestData}: any) {
        const agentIdData = await mainService.getAgentId()
        const agentId = Cookies.get('agentId')

        const modifiedRequestData = new FormData();
        //@ts-ignore
        modifiedRequestData.append('agentId',  agentId || agentIdData.agentId);
        modifiedRequestData.append('token', token);
        modifiedRequestData.append('method', 'driver.addedit');

        Object.entries(requestData.requestData).forEach(([key, value]) => {// @ts-ignore
            modifiedRequestData.append(key, value);
        });

        const {data} = await instance.post('api/?method=', modifiedRequestData);

        return data;
    },

    async createNewCar(requestData: ICarInfo, driverId: string) {
        const agentIdData = await mainService.getAgentId()
        const agentId = Cookies.get('agentId')

        const formData = new FormData();
        formData.append('agentId', agentId || agentIdData.agentId);
        //@ts-ignore
        formData.append('driverId', requestData.driverId);
        formData.append('token', token);
        formData.append('method', 'driver.car_addedit');

        //@ts-ignore
        Object.entries(requestData.requestData).forEach(([key, value]) => {
            // @ts-ignore
            formData.append(key, value);
        });

        const {data} = await instance.post('api/?method=', formData);
        return data;
    },

    async editAgent({requestData, agentId}: {requestData: any, agentId: number}) {
        const modifiedRequestData = new FormData();
        modifiedRequestData.append('token', token);
        modifiedRequestData.append('method', 'agent.addedit');
        // @ts-ignore|
        modifiedRequestData.append('editid', agentId);

        if (requestData) {
            Object.entries(requestData).forEach(([key, value]) => {
                // @ts-ignore
                modifiedRequestData.append(key, value);
            });
        }

        const {data} = await instance.post('api/?method=', modifiedRequestData);
        return data;
    },

    async editDriver({requestData}: any) {
        const newToken = Cookies.get('token')

        const agentId = Cookies.get('agentId')
        const agentIdData = await mainService.getAgentId()
        const modifiedRequestData = new FormData();
        // @ts-ignore
        modifiedRequestData.append('agentId', agentId || agentIdData.agentId);
        modifiedRequestData.append('token', newToken);
        modifiedRequestData.append('method', 'driver.addedit');
        modifiedRequestData.append('editid', requestData.driverId);

        Object.entries(requestData.requestData).forEach(([key, value]) => {
            // @ts-ignore
            modifiedRequestData.append(key, value);
        });

        const {data} = await instance.post('api/?method=', modifiedRequestData);
        return data;
    },

    async deleteAgent(agentId: number) {
        const modifiedRequestData = new FormData();
        modifiedRequestData.append('token', token);
        modifiedRequestData.append('method', 'agent.addedit');
        // @ts-ignore
        modifiedRequestData.append('remove', 1);
        modifiedRequestData.append('editid', agentId.toString());

        const {data} = await instance.post('api/?method=', modifiedRequestData);
        return data;
    },

    async deleteDriver(driverId: number) {
        const agentIdData = await mainService.getAgentId()
        const agentId = Cookies.get('agentId')

        const modifiedRequestData = new FormData();
        modifiedRequestData.append('agentId', agentId || agentIdData.agentId);
        modifiedRequestData.append('token', token);
        modifiedRequestData.append('method', 'driver.addedit');
        // @ts-ignore
        modifiedRequestData.append('remove', 1);
        // @ts-ignore
        modifiedRequestData.append('editid', driverId.toString());

        const {data} = await instance.post('api/?method=', modifiedRequestData);
        return data;
    },

    async deleteCar(carId: number, driverId: string | string[]) {
        const agentIdData = await mainService.getAgentId()
        const agentId = Cookies.get('agentId')

        const modifiedRequestData = new FormData();
        // @ts-ignore
        modifiedRequestData.append('agentId', agentId || agentIdData.agentId);
        // @ts-ignore
        modifiedRequestData.append('driverId', driverId);
        modifiedRequestData.append('token', token);
        modifiedRequestData.append('method', 'driver.car_addedit');
        // @ts-ignore
        modifiedRequestData.append('remove', 1);
        // @ts-ignore
        modifiedRequestData.append('editid', carId.toString());

        const {data} = await instance.post('api/?method=', modifiedRequestData);
        return data;
    },
}