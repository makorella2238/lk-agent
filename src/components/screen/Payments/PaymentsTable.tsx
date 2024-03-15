import React from 'react';
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import {IPaymentsAgent} from "@/interfaces/types";

type PaymentsTableProps = {
    data: IPaymentsAgent
}
function PaymentsTable({data}: PaymentsTableProps) {
    return (
        <TableContainer component={ Paper }>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Номер платежа</TableCell>
                        <TableCell>Дата следующего платежа</TableCell>
                        <TableCell>Расчетный счет</TableCell>
                        <TableCell>Описание</TableCell>
                        <TableCell>Сумма</TableCell>
                        <TableCell>Статус</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(!data || !data.payments || data.payments.length < 1) && (
                        <TableRow>
                            <TableCell colSpan={ 7 } align="center">
                                Нет данных
                            </TableCell>
                        </TableRow>
                    ) }
                    { data && data.payments && data.payments?.map((payment) => (
                        <TableRow key={ payment.paymentId } className='hover:bg-gray-100 cursor-pointer'>
                            <TableCell>{ payment.paymentId }</TableCell>
                            <TableCell>
                                { payment.dateRequestPayment.split('T')[0].split('-').reverse().join('.') }
                            </TableCell>
                            <TableCell>{ payment.checkingAccount }</TableCell>
                            <TableCell>{ payment.description }</TableCell>
                            <TableCell>{ `${ payment.summa } ₽` }</TableCell>
                            <TableCell>
                                { payment.status === 2 && 'Выполнено' }
                                { payment.status === 1 && 'Отправлено в банк' }
                                { payment.status === -1 && 'Ошибка' }
                            </TableCell>
                        </TableRow>
                    )) }
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default PaymentsTable;