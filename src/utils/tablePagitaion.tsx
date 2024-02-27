import s from '@/components/ui/genetal-css/general.module.css'

export const renderPagination = (currentPage: number, total: number, pageSize: number, handleChangePage: (page: number) => void) => {
    const pagesCount = Math.ceil(total / pageSize);
    const pages = [];

    for (let i = 1; i <= pagesCount; i++) {
        pages.push(i);
    }

    return (
        <div className='flex justify-center gap-3 mt-3'>
            {pages.map((page) => (
                <button
                    key={page}
                    className={`m-1 ${currentPage === page && 'bg-emerald-700'} ${s.BaseButton}`}
                    onClick={() => handleChangePage(page)}
                >
                    {page}
                </button>
            ))}
        </div>
    );
};