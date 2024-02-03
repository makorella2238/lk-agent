import React, { FC } from "react";
import {usePathname, useRouter} from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import s from "@/components/ui/genetal-css/general.module.css";

type NavLink = {
    path: string;
    label: string;
};

const navLinks: NavLink[] = [
    { path: "/", label: "Водители" },
    { path: "/payments", label: "Выплаты" },
    { path: "/analytics", label: "Аналитика" },
    { path: "/admin", label: "Администратор" },
];

const Header: FC = () => {
    const pathname = usePathname();
    const router = useRouter()

    return (
        <div className="p-1 sm:p-3 flex justify-between w-full text-2xl shadow-sm items-center border-b-2">
            <div className="flex items-center">
                <Link href="/">
                    <Image priority src="/logo.svg" alt="Logo" width={175} height={125} />
                </Link>
            </div>
            <div className="">
                {navLinks.map((link) => (
                    <Link
                        key={link.path}
                        href={link.path}
                        className={`${
                            pathname === link.path ? "relative" : ""
                        } mr-6 text-black font-bold text-sm sm:text-2xl transition-color hover:text-emerald-500 ml-5`}
                    >
                        {link.label}
                        {pathname === link.path && (
                            <span
                                className="absolute bottom-[-25px] left-0 w-full h-1 bg-emerald-600"
                                aria-hidden="true"
                            ></span>
                        )}
                    </Link>
                ))}
            </div>
            <div>
                <button
                    className={`${s.BaseButton} min-w-16 text-xl mr-3.5`}
                    type="submit"
                    onClick={() => router.push('/login')}
                >
                    Войти
                </button>
            </div>
        </div>
    );
};

export default Header;