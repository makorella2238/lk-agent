import React from 'react';
import {Dialog, DialogContent, DialogTitle} from '@material-ui/core';
import {useDeleteDriver} from "@/hooks/drivers/drivers";
import s from '@/components/ui/genetal-css/general.module.css'

type DeleteDriverModalProps = {
    open: boolean
    onClose: () => void
    driverId: number
}

const DeleteDriverModal = ({open, onClose, driverId}: DeleteDriverModalProps) => {
    const handleDriverDelete = useDeleteDriver()

    const handleDelete = () => {
        handleDriverDelete(driverId)
        onClose();
    };

    return (
        <Dialog open={ open } onClose={ onClose } aria-labelledby="form-dialog-title" maxWidth='md'>
            <DialogTitle id="form-dialog-title"><h2 className="text-center text-xl sm:text-2xl font-bold p-2 sm:p-5">Удаление
                водителя</h2>
            </DialogTitle>
            <DialogContent>
                <div className='px-2 sm:px-5'>
                    <p className='text-lg mx-3 my-5'>Вы точно хотите удалить водителя?</p>
                    <div className='flex flex-col gap-2 w-full mt-10 mb-4'>
                        <button className={ `${ s.BaseButton } w-full` } onClick={ onClose }>Отмена</button>
                        <button className={ `${ s.buttonRed } ${ s.easeInOut } w-full` }
                                onClick={ handleDelete }>Удалить
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteDriverModal;