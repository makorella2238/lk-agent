import s from './Preloader.module.css'

const Preloader = () => {
    return (
        <div className='flex justify-center items-center' style={ {height: '75vh'} }>
            <div className={ s.loader }>
                <div className={ s.loader__bar }></div>
                <div className={ s.loader__bar }></div>
                <div className={ s.loader__bar }></div>
                <div className={ s.loader__bar }></div>
                <div className={ s.loader__bar }></div>
                <div className={ s.loader__ball }></div>
            </div>
        </div>

    );
};

export default Preloader;
