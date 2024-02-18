'use client'

import Home from "@/components/screen/Home/Home";
import Cookies from "js-cookie";
import {useRouter} from "next/navigation";

const HomePage = () => {
    const {push} = useRouter()
    const token = Cookies.get('token')
    if (!token) {
        push('/login')
    }

    return  (
        <div>
            <Home/>
        </div>
    )
}

export default HomePage