import Header from "@/components/Layout/Header/Header";

function Layout({children}) {
    return (
        <>
            <Header/>
            <main className='mt-4 sm:mt-10'>
                { children }
            </main>
        </>
    )
}

export default Layout