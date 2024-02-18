'use client'

import Home from "@/components/screen/Home/Home";
import Cookies from "js-cookie";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

const HomePage = () => {
    const router = useRouter()
    const token = Cookies.get('token')
    useEffect(() => {
        if (!token) {
            router.push('/login')
        }
    }, [token]);


    return  (
        <div>
            <Home/>
        </div>
    )
}

export default HomePage