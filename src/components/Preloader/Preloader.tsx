import s from './Preloader.module.scss'

const Preloader = () => {
    return (
        <div className={ s.plContainer }>
            <div className={ s.pl }>
                <div className={ s.pl__dot }></div>
                <div className={ s.pl__dot }></div>
                <div className={ s.pl__dot }></div>
                <div className={ s.pl__dot }></div>
                <div className={ s.pl__dot }></div>
                <div className={ s.pl__dot }></div>
                <div className={ s.pl__dot }></div>
                <div className={ s.pl__dot }></div>
                <div className={ s.pl__dot }></div>
                <div className={ s.pl__dot }></div>
                <div className={ s.pl__dot }></div>
                <div className={ s.pl__dot }></div>
                <div className={ s.pl__text }>Loading…</div>
            </div>
        </div>
    );
};

export default Preloader;
