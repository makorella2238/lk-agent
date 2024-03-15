import React from 'react';
import TableContainer from "@material-ui/core/TableContainer";
import {Button, Paper, Table, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import {IAllAgent} from "@/interfaces/types";
import s from "@/components/ui/genetal-css/general.module.css";
import Image from "next/image";
import {useRouter} from "next/navigation";

type AgentsTableProps = {
    data: IAllAgent
    setEditedAgentId: React.Dispatch<React.SetStateAction<number | null>>
    setIsEditAgentModal: React.Dispatch<React.SetStateAction<boolean>>
    setAgentDeleteModal: React.Dispatch<React.SetStateAction<boolean>>
    setDeleteAgentId: React.Dispatch<any>
}

function AgentsTable({
                         data,
                         setEditedAgentId,
                         setIsEditAgentModal,
                         setAgentDeleteModal,
                         setDeleteAgentId
                     }: AgentsTableProps) {
    const router = useRouter()
    return (
        <TableContainer component={ Paper }>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <p className='text-black/50 text-lg'>ID</p>
                            </TableCell>
                            <TableCell>
                                <p className='text-black/50 text-lg'>Город</p>
                            </TableCell>
                            <TableCell>
                                <p className='text-black/50 text-lg'>Наименование</p>
                            </TableCell>
                            <TableCell>
                                <p className='text-black/50 text-lg'>Юридическое лицо</p>
                            </TableCell>
                            <TableCell>
                                <p className='text-black/50 text-lg'>ИНН</p>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { (!data || !data.agents || data.agents.length < 1) && (
                            <TableRow>
                                <TableCell colSpan={ 7 } align="center">
                                    Нет данных
                                </TableCell>
                            </TableRow>
                        ) }
                        { data && data.agents && data.agents?.map((item) => (
                            <TableRow
                                key={ item.agentId }
                                onClick={ () => router.push(`/admin/agent/${ item.agentId }`) }
                                className='hover:bg-gray-100 cursor-pointer'
                            >
                                <TableCell>{ item.agentId }</TableCell>
                                <TableCell>{ item.city }</TableCell>
                                <TableCell>{ item.name }</TableCell>
                                <TableCell>{ item.legalName }</TableCell>
                                <TableCell>{ item.inn }</TableCell>
                                <TableCell>
                                    <div className={ s.buttonContainer }>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            className={ s.editButton }
                                            onClick={ (event) => {
                                                event.stopPropagation();
                                                setEditedAgentId(item.agentId)
                                                setIsEditAgentModal(true)
                                            } }
                                        >
                                            <Image src="/edit.svg" alt="edit" width={ 20 } height={ 20 }/>
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            className={ s.deleteButton }
                                            onClick={ (event) => {
                                                event.stopPropagation();
                                                setAgentDeleteModal(true)
                                                setDeleteAgentId(item.agentId)
                                            } }
                                        >
                                            <Image src="/remove.svg" alt="delete" width={ 20 } height={ 20 }/>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )) }
                    </TableBody>
                </Table>
            </Paper>
        </TableContainer>

    );
}

export default AgentsTable;