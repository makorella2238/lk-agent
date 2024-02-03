'use client'

import {FC, PropsWithChildren, Suspense} from "react";
import Header from "@/components/layout/Header/Header";

const Layout: FC<PropsWithChildren> = ({children}) => {

    return (
        <div>
            <Header/>
            <Suspense >
                <main className='mt-10'>
                    { children }
                </main>
            </Suspense>
        </div>
    );
}

export default Layout;