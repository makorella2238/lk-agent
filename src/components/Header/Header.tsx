'use client'

import React, {FC, useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import s from "@/components/ui/genetal-css/general.module.css";
import {useDispatch} from "react-redux";
import {setIsAuthFalse} from "@/Redux/app/app-slice";
import Cookies from "js-cookie";

type NavLink = {
    path: string;
    label: string;
};

const navLinks: NavLink[] = [
    {path: "/", label: "Водители"},
    {path: "/payments", label: "Выплаты"},
    {path: "/analytics", label: "Аналитика"},
    {path: "/admin", label: "Администратор"},
];

const Header: FC = () => {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    function handleLogout() {
        Cookies.remove("token");
        Cookies.remove("agentId");
        dispatch(setIsAuthFalse());
        router.push("login");
    }

    return (
        <div className="p-1 sm:p-3 flex justify-between w-full text-2xl shadow-sm items-center border-b-2">
            <div className="flex items-center">
                <Link href="/">
                    <div className="flex items-center cursor-pointer">
                        <Image
                            priority={ true }
                            src="/logo.svg"
                            alt="Logo"
                            width={ 175 }
                            height={ 115 }
                        />
                    </div>
                </Link>
            </div>
            <div className="sm:hidden mr-3">
                <button
                    className="block text-black"
                    onClick={ () => setIsMenuOpen(!isMenuOpen) }
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={ 2 }
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
            </div>
            { isMenuOpen && (
                <div className="fixed inset-0 bg-white z-50 sm:hidden">
                    <div className="flex flex-col items-center py-8">
                        { navLinks.map((link) => (
                            <Link
                                key={ link.path }
                                href={ link.path }
                                onClick={ () => setIsMenuOpen(false) }
                                className={ `${
                                    pathname === link.path ? "relative" : ""
                                } text-black font-bold text-2xl transition-color hover:text-emerald-500 mb-4` }
                            >
                                { link.label }
                                { pathname === link.path && (
                                    <span
                                        className="absolute bottom-[-5px] left-0 w-full h-1 bg-emerald-600"
                                        aria-hidden="true"
                                    ></span>
                                ) }
                            </Link>
                        )) }
                        <button
                            className="absolute top-3 right-3"
                            onClick={ () => setIsMenuOpen(!isMenuOpen) }
                        >
                            <Image src="/x-mark.svg" alt="X" width={ 30 } height={ 30 }/>
                        </button>
                    </div>
                </div>
            ) }
            <div
                className={ `${
                    isMenuOpen ? "block" : "hidden"
                } block sm:flex sm:items-center sm:ml-5` }
            >
                { navLinks.map((link) => (
                    <Link
                        key={ link.path }
                        href={ link.path }
                        className={ `${
                            pathname === link.path ? "relative" : ""
                        }  sm:mr-3 lg:mr-6 text-black font-bold text-lg lg:text-2xl transition-color hover:text-emerald-500 lg:ml-5` }
                    >
                        { link.label }
                        { pathname === link.path && (
                            <span
                                className="absolute bottom-[-24px] left-0 w-full h-1 bg-emerald-600"
                                aria-hidden="true"
                            ></span>
                        ) }
                    </Link>
                )) }
            </div>
            <div className={ `${ isMenuOpen ? "block" : "hidden" } block sm:flex sm:items-center sm:ml-5` }>
                <button
                    className={ `${ s.BaseButton } min-w-16 text-xl mt-0 lg:mr-3.5` }
                    type="submit"
                    onClick={ handleLogout }
                >
                    Выйти
                </button>
            </div>
        </div>
    );
};

export default Header;