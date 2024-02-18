import {Button} from "@material-ui/core";

export const renderPagination = (currentPage: number, total: number, pageSize: number, handleChangePage: (page: number) => void) => {
    const pagesCount = Math.ceil(total / pageSize);
    const pages = [];

    for (let i = 1; i <= pagesCount; i++) {
        pages.push(i);
    }

    return (
        <div className='flex justify-center mt-3'>
            {pages.map((page) => (
                <Button
                    key={page}
                    variant={currentPage === page ? 'contained' : 'outlined'}
                    color={currentPage === page ? 'primary' : 'default'}
                    className='m-1'
                    onClick={() => handleChangePage(page)}
                >
                    {page}
                </Button>
            ))}
        </div>
    );
};