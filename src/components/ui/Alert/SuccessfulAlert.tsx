import {Dispatch, SetStateAction} from 'react';
import { Snackbar, SnackbarContent} from '@material-ui/core';
import Image from "next/image";

type SuccessSnackbarProps = {
    open: boolean
    message: string
    onClose:  Dispatch<SetStateAction<boolean>>
}

const SuccessSnackbar = ({ open, message, onClose }: SuccessSnackbarProps) => {
    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={ () => onClose(false)} anchorOrigin={{horizontal: "right", vertical: "bottom"}}>
            <SnackbarContent
                message={
                    <div>
                        <Image src='/success.svg' alt='success' width={30} height={30}/>
                        <span>{message}</span>
                    </div>
                }
                action={
                    <Image src='/x-mark.svg' alt='X' width={20} height={20} onClick={() => onClose(false)}/>
                }
            />
        </Snackbar>
    );
};

export default SuccessSnackbar;
