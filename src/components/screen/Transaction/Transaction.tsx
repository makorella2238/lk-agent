'use client'

import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {IDriverTransactions} from "@/interfaces/types";

type TransactionsProps = {
    data: IDriverTransactions
}

const Transactions = ({data}: TransactionsProps) => {
    return (
        <div className="container mx-auto">
            <h2 className="ml-2 text-2xl font-bold mb-3 sm:mb-6">История баланса</h2>
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
                                <TableCell>{transaction.dateTime.split('T').join(', ')}</TableCell>
                                <TableCell>{transaction.balance}</TableCell>
                                <TableCell>
                                    {transaction.delta > 0 ? '+' : ''}
                                    {transaction.delta}
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