'use client'

import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {IDriverTransactions} from "@/interfaces/types";
import {formatDateAndClock, formatPrice} from "@/utils/formateData";
import s from "@/components/ui/genetal-css/general.module.css";
import Image from "next/image";
import {useRouter} from "next/navigation";

type TransactionsProps = {
    data: IDriverTransactions
}

const Transactions = ({data}: TransactionsProps) => {
    const router = useRouter()
    return (
        <div className="container mx-auto relative">
            <div className={ `absolute top-1 left-1 ${ s.BaseButton } p-2 flex  transition-colors ` }
                 onClick={ () => router.back() }>
                <Image className='sm:mr-3' src='/arrow_back.svg' alt='arrow_back' width={ 20 } height={ 20 }/>
                <p className='hidden sm:block'>Назад</p>
            </div>
            <h2 className="ml-2 text-2xl font-bold mb-3 sm:mb-6 text-center">История баланса</h2>
            <TableContainer component={Paper}>
                <Table aria-label="balance history table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Дата и время</TableCell>
                            <TableCell>Баланс</TableCell>
                            <TableCell>Изменение</TableCell>
                            <TableCell>Описание</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.transactions.map(transaction => (
                            <TableRow key={transaction.id}>
                                <TableCell>{formatDateAndClock(transaction.dateTime)}</TableCell>
                                <TableCell>{formatPrice(transaction.balance)}</TableCell>
                                <TableCell>
                                    {transaction.delta > 0 ? '+' : ''}
                                    {formatPrice(transaction.delta)}
                                </TableCell>
                                <TableCell>{transaction.description}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default Transactions;