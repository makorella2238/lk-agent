import React from 'react';
import {Dialog, DialogContent, DialogTitle} from '@material-ui/core';
import s from '@/components/ui/genetal-css/general.module.css'
import Preloader from "@/components/Preloader/Preloader";

type DeleteDriverModalProps = {
    open: boolean
    onClose: () => void
    itemId: number
    title: string
    subtitle: string
    handleDeleteItem: (arg1: number) => void
}

const DeleteItemModal = ({
                               open,
                               onClose,
                               itemId,
                               title,
                               handleDeleteItem,
                               subtitle,
                           }: DeleteDriverModalProps) => {

    return (
        <Dialog open={ open } onClose={ onClose } aria-labelledby="form-dialog-title" maxWidth='md'>
            <DialogTitle id="form-dialog-title"><h2
                className="text-center text-xl sm:text-2xl font-bold p-2 sm:p-5">{ title }</h2>
            </DialogTitle>
            <DialogContent>
                    <div className='px-2 sm:px-5'>
                        <p className='text-lg mx-3 my-5'>{ subtitle }</p>
                        <div className='flex flex-col gap-2 w-full mt-10 mb-4'>
                            <button className={ `${ s.BaseButton } w-full` } onClick={ onClose }>Отмена</button>
                            <button className={ `${ s.buttonRed } ${ s.easeInOut } w-full` }
                                    onClick={ () =>  handleDeleteItem(itemId) }>Удалить
                            </button>
                        </div>
                    </div>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteItemModal;