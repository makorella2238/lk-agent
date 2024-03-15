import {ValidationValueMessage} from "react-hook-form";

export type ILogin = {
    login: string
    password: string
}
export type IGetAgentId = {
    agentId: number
    admin: 1 | -1
    answer: string
    myCouriers: 1 | -1
}

export type ILoginResponse = {
    answer: string
    token: string
    agentId: number
    admin: 1 | -1
}

export type IPaymentsAgent = {
    answer: string
    balance: number
    dateNextPayment: string
    payments_total: number
    payments: [IPayments]
}
export type ICafeList = {
    answer: string
    total: number
    cafes: [ICafe]
}
export type ICafe = {
    id: number
    name: string
    legalName: string
}
export type IPayments = {
    paymentId: string
    dateRequestPayment: string
    checkingAccount: string
    description: string
    summa: string
    status: -1 | 1 | 2
}

export type IAllDrivers = {
    answer: string
    total: number
    drivers: [IDriver]
}
export type IAllAgent = {
    answer: string
    total: number
    arg: number
    agents: [IAgent]
}

export type IAgent = {
    agentId: number
    city: string
    name: string
    legalName: string
    inn: string
}

export type IAddEditDriver = {
    editid?: string;
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
    workUsl: string
    inn?: string;
    ogrn?: string;
    ogrnip?: string;
    status: 2 | 1 | -1
    restrictOrders: string;
    restrictOrdersTimes: string
    restrictPayments: string;
    restrictPaymentsPercent?: string;
};
export type IAddEditAgent = {
    editid?: string;
    city: string;
    name: string;
    legalName: string;
    workUsl: string
    inn: string;
    ogrn?: string;
    ogrnip?: string;
    addressLegal: string;
    addressFact: string;
    addressMail: string;
    email: string;
    telephoneCeo: string;
    telephoneCommon: string;
    myCouriers: number;
    myCouriersCategory: 'food' | 'product'
    block: 1 | -1
};

export type IDriverInfo = {
    surname: string;
    name: string;
    patronymic?: string;
    dateBirth : string;
    telephone: string;
    status: 2 | 1 | -1
    state: 1 | 2 | 3
    driverLicenceSeries: string;
    driverLicenceNumber: string;
    driverLicenceCountry: string;
    driverLicenceDate: string;
    driverExpDate?: string;
    workUsl: 'self' | 'fiz' | 'ip' | 'ООО'
    inn?: string;
    ogrn?: string;
    ogrnip?: string;
    hireDate: string
    lastOrderDate: string
    restrictOrders: string;
    restrictOrdersTimes: string
    restrictPayments: string;
    restrictPaymentsPercent?: string;
}

export type ICarInfo = {
    answer: string
    cars: [ICar]
}

export type ICar = {
    carId: number
    mark: string
    model: string
    color: string
    year: number
    plateNumber: string
    vin: string
    bodyNumber: string
    certificateSeries: string
    certificateNumber: string
}

export type IDriver = {
    driverId: number
    surname: string
    name: string
    patronymic: string
    telephone: string
    workUsl: 'self' | 'fiz' | 'ip' | 'ООО'
    status: -1 | 1 | 2
    state: 1 | 2 | 3
    balance: number
    lastOrderDate: string
}

export type inputField = {
    pattern?: ValidationValueMessage<RegExp> | RegExp | undefined;
    name: string;
    placeholder: string;
    required?: boolean;
    type?: string
};

export type IDriverAnalytic = {
    orderCompeled: number
    orderCanceled: number
    incomeCourier: number
    incomeAgent: number
    incomeService : number
}

export type IDriverTransactions = {
    answer: string
    total: number
    transactions: [ITransactions]
}

export type ITransactions = {
    id: number
    dateTime: string
    delta: number
    balance: number
    description: string
}

export type IAllDriverOrders = {
    answer: string
    total: number
    orders: IDriverOrders[]
}

export type IDriverOrders = {
    id: number;
    uid: string;
    carId: number;
    carName: string;
    type: 'food' | 'product' | 'package';
    dateTimeCourierAccept: string
    dateTimeCourierPickUp: string;
    dateTimeCourierDone: string;
    status: -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5;
}
