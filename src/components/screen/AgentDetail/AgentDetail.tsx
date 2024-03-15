'use client'

import s from '@/components/ui/genetal-css/general.module.css'
import React from "react";
import Image from "next/image";
import {useParams, useRouter} from "next/navigation";
import {IAddEditAgent} from "@/interfaces/types";
import {formatWorkUsl} from "@/components/screen/Drivers/Drivers";
import {useGetCafeList} from "@/hooks/admin/admin";
import Preloader from "@/components/Preloader/Preloader";

type AgentDetailProps = {
    data: IAddEditAgent
}

const AgentDetail = ({data}: AgentDetailProps) => {
    const enabled = true
    const {data: cafeListData, isFetching: cafeListIsFetching, error: cafeListError} = useGetCafeList(data.myCouriersCategory, enabled)

    if (cafeListError) {
        return  <p className='text-red-600'>Ошибка при получении данных</p>
    }

    const cafeName = data.myCouriers !== -1 && cafeListData && cafeListData.cafes && cafeListData.cafes.filter(item => item.id === data.myCouriers)[0].name
    const router = useRouter();
    const params = useParams()

    return (
        <div className="mt-3 sm:mt-4 relative container mx-auto max-w-2xl">
            <div className={ `absolute top-4 left-2 sm:left-3 ${ s.BaseButton } p-2 flex sm:ml-5 transition-colors ` }
                 onClick={ () => router.back() }>
                <Image className='sm:mr-3' src='/arrow_back.svg' alt='arrow_back' width={ 20 } height={ 20 }/>
                <p className='hidden sm:block'>Назад</p>
            </div>
            <div className="card border-2 border-gray-300 shadow-lg p-4">
                <h2 className="ml-8 sm:ml-0 title text-2xl font-bold text-center mb-4 sm:mb-6">
                    Подробности агента
                </h2>

                <div className={ s.borderContainer }>
                    ID:{ ' ' }
                    <span className={ s.bodyText }>{ params.agentId }</span>
                </div>
                <div className={ s.borderContainer }>
                    Город:{ ' ' }
                    <span className={ s.bodyText }>{ data.city }</span>
                </div>

                <div className={ s.borderContainer }>
                    Наименование:{ ' ' }
                    <span className={ s.bodyText }>{ data.name }</span>
                </div>

                <div className={ s.borderContainer }>
                    Наименование юридического лица:{ ' ' }
                    <span className={ s.bodyText }>{ data.legalName }</span>
                </div>

                <div className={ s.borderContainer }>
                    Тип юридического лица:{ ' ' }
                    <span className={ s.bodyText }>{ formatWorkUsl(data.workUsl ) }</span>
                </div>

                <div className={ s.borderContainer }>
                    «Свои курьеры»:{ ' ' }
                    <span className={ s.bodyText }>{ data.myCouriers !== -1 ? 'Да' : 'Нет' }</span>
                </div>

                <div className={ s.borderContainer }>
                    Наименование заведения:{ ' ' }
                    <span className={ s.bodyText }>{ cafeName }</span>
                </div>

                <div className={ s.borderContainer }>
                    ИНН:{ ' ' }
                    <span className={ s.bodyText }>{ data.inn }</span>
                </div>

                { data && data.ogrn && <div className={ s.borderContainer }>
                    ОГРН:{ ' ' }
                    <span className={ s.bodyText }>{ data.ogrn }</span>
                </div>}

                { data && data.ogrnip && <div className={ s.borderContainer }>
                    ОГРНИП:{ ' ' }
                    <span className={ s.bodyText }>{ data.ogrnip }</span>
                </div>}

                <div className={ s.borderContainer }>
                    Юридический адрес:{ ' ' }
                    <span className={ s.bodyText }>{ data.addressLegal }</span>
                </div>

                <div className={ s.borderContainer }>
                    Фактический адрес:{ ' ' }
                    <span className={ s.bodyText }>{ data.addressFact }</span>
                </div>

                <div className={ s.borderContainer }>
                    Адрес для корреспонденции:{ ' ' }
                    <span className={ s.bodyText }>{ data.addressMail }</span>
                </div>
                <div className={ s.borderContainer }>
                    E-mail:{ ' ' }
                    <span className={ s.bodyText }>{ data.email }</span>
                </div>
                <div className={ s.borderContainer }>
                    Телефон руководителя:{ ' ' }
                    <span className={ s.bodyText }>+{ data.telephoneCeo }</span>
                </div>
                <div className={ s.borderContainer }>
                    Телефон общий:{ ' ' }
                    <span className={ s.bodyText }>+{ data.telephoneCommon }</span>
                </div>
            </div>
            {cafeListIsFetching && <Preloader/>}
        </div>
    );
};

export default AgentDetail;