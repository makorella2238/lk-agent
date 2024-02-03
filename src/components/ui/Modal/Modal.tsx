import React from "react";
import s from './Modal.module.css'
import styles from './Modal.module.css'


const Modal = ({children}: { children: React.ReactNode }) => {

    return (
        <div className={`${ s.Modal} ${styles.fadeIn} `}>
            <div className={ s.ModalContent }>
                { children }
            </div>
        </div>
    );
};

export default Modal;
