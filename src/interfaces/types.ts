export type ILogin = {
    login: string
    password: string
}

export type ILoginResponse = {
    answer: number
    token: string
    agentId: number
}

export type IPaymentsAgent = {
    answer: number
    balance: number
    dateNextPayment: string
    payments_total: number
    payments: [IPayments]
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
    answer: number
    total: number
    drivers: [IDriver]
}

export type IAddEditDriver = {
    editid?: string;
    remove?: string;
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
    workUsl: string;
    inn?: string;
    ogrn?: string;
    ogrnip?: string;
    restrictOrders: string;
    restrictOrdersTime1?: string;
    restrictOrdersTime2?: string;
    restrictPayments: string;
    restrictPaymentsPercent?: string;
};

export type IDriverInfo = {
    surname: string;
    name: string;
    patronymic?: string;
    dateBirth : string;
    telephone: string;
    status: 3 | 2 | 1
    driverLicenceSeries: string;
    driverLicenceNumber: string;
    driverLicenceCountry: string;
    driverLicenceDate: string;
    driverExpDate?: string;
    workUsl: string;
    inn?: string;
    ogrn?: string;
    ogrnip?: string;
    hireDate: string
    lastOrderDate: string
    restrictOrders: string;
    restrictOrdersTime1?: string;
    restrictOrdersTime2?: string;
    restrictPayments: string;
    restrictPaymentsPercent?: string;
}

export type ICarInfo = {
    answer: number
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
    workUsl: 'self' | 'fiz' | 'ip' | 'OOO'
    status: -1 | 1 | 2
    state: 1 | 2 | 3
    balance: number
    lastOrderDate: string
}

export type inputField = {
    name: string;
    placeholder: string;
    required?: boolean;
    pattern?: {
        value: RegExp
        message: string
    }
};

export type IDriverAnalytic = {
    orderCompeled: number
    orderCanceled: number
    incomeCourier: number
    incomeAgent: number
    incomeService : number
}

export type IDriverTransactions = {
    answer: number
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
    answer: number
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
