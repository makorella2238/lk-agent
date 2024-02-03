'use client'

import s from './Detail.module.css'

const DetailOrder = () => {
    const orderDetails = {
        id: 123,
        uid: 'ORD-456',
        carId: 789,
        carName: 'Toyota Camry',
        type: 'food',
        dateTimeCourierAccept: '2024-01-30 10:00',
        dateTimeCourierPickUp: '2024-01-30 10:15',
        dateTimeCourierDone: '2024-01-30 11:00',
        status: 1,
        distance: '10 км',
        pointFromName: 'Ресторан XYZ',
        pointFromLat: 55.12345,
        pointFromLon: 37.98765,
        pointToName: 'Адрес доставки',
        pointToLat: 55.54321,
        pointToLon: 37.56789,
        paymentMethod: 'sbp',
        summaDelivery: 150,
        summaService: 50,
        summaAgent: 80,
        summaCourierFinal: 20,
    };

    const open2GIS = (lat: number, lon: number) => {
        // const url = https://2gis.com/maps/?r=${lat},${lon};
        const url = `https://2gis.ru/search/${ lat }%2C${ lon }`
        window.open(url, '_blank');
    };

    // Верните JSX-элемент, который отображает детали заказа
    return (
        // Добавьте div-элемент с классом container, который центрирует содержимое и задает максимальную ширину
        <div className="container mx-auto max-w-2xl">
            <div className="card border-2 border-gray-300 shadow-lg p-4">
                <h1 className="title text-2xl font-bold text-center mb-4">
                    Детали заказа
                </h1>

                <div className={ s.borderContainer }>
                    Номер заказа:{ ' ' }
                    <span className={ s.bodyText }>{ orderDetails.uid }</span>
                </div>

                <div className={ s.borderContainer }>
                    Водитель:{ ' ' }
                    <span className={ s.bodyText }>{ orderDetails.carName }</span>
                </div>

                <div className={ s.borderContainer }>
                    Автомобиль:{ ' ' }
                    <span className={ s.bodyText }>{ orderDetails.carName }</span>
                </div>

                <div className={ s.borderContainer }>
                    Категория:{ ' ' }
                    <span className={ s.bodyText }>{ orderDetails.type }</span>
                </div>

                <div className={ s.borderContainer }>
                    Дата и время принятия заказа:{ ' ' }
                    <span className={ s.bodyText }>{ orderDetails.dateTimeCourierAccept }</span>
                </div>

                <div className={ s.borderContainer }>
                    Дата и время подачи:{ ' ' }
                    <span className={ s.bodyText }>{ orderDetails.dateTimeCourierPickUp }</span>
                </div>

                <div className={ s.borderContainer }>
                    Дата и время завершения:{ ' ' }
                    <span className={ s.bodyText }>{ orderDetails.dateTimeCourierDone }</span>
                </div>

                <div className={ s.borderContainer }>
                    Статус:{ ' ' }
                    <span className={ s.bodyText }>{ orderDetails.status }</span>
                </div>

                <div className={`flex items-center mb-2 ${s.borderContainer}`}>
                    <p className="mr-3">Точка А:</p>
                    <a
                        href="#"
                        className="link text-blue-500 underline hover:text-green-500"
                        onClick={ () =>
                            open2GIS(orderDetails.pointFromLat, orderDetails.pointFromLon)
                        }
                    >
                        { orderDetails.pointFromName }
                    </a>
                </div>
                <div className={`flex items-center mb-2 ${s.borderContainer}`}>
                    <p className="mr-3 mb-1">Точка Б:</p>
                    <a
                        href="#"
                        className="link text-blue-500 underline hover:text-green-500"
                        onClick={ () =>
                            open2GIS(orderDetails.pointToLat, orderDetails.pointToLon)
                        }
                    >
                        { orderDetails.pointToName }
                    </a>
                </div>
                <div className={ s.borderContainer }>
                    Путь:{ ' ' }
                    <span className={s.bodyText}>{ orderDetails.distance }</span>
                </div>
                <div className={ s.borderContainer }>
                    Тип оплаты: { ' ' } <span className={s.bodyText}>{ orderDetails.paymentMethod == 'sbp' && 'Безналично' || orderDetails.paymentMethod == 'aquiring' && 'Получающий' || orderDetails.paymentMethod == 'done' && 'Уже оплачено' }</span>
                </div>
                <div className={ s.borderContainer }>
                    Общая стоимость:{ ' ' }
                    <span className={s.bodyText}>{ orderDetails.summaDelivery }</span>
                </div>
                <div className={ s.borderContainer }>
                    Работа сервиса:{ ' ' }
                    <span className={s.bodyText}>{ orderDetails.summaService }</span>
                </div>
                <div className={ s.borderContainer }>
                   Заработок Агента:{ ' ' }
                    <span className={s.bodyText}>{ orderDetails.summaAgent }</span>
                </div>
                <div className={ s.borderContainer }>
                    Заработок Курьера:{ ' ' }
                    <span className={s.bodyText}>{ orderDetails.summaCourierFinal }</span>
                </div>
            </div>
        </div>
    );
};

export default DetailOrder;