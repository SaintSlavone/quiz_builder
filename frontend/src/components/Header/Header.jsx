"use client";

import Link from "next/link";
import "./Header.scss";
import { use } from "react";
import { usePathname } from "next/navigation";

export default function Header(){

    const path = usePathname();

    return (
        <header className="header">
            <Link href="/" className={`link ${path === "/" ? "active" : ""}`}>
                Quiz List
            </Link>
            <Link href="/create" className={`link ${path === "/create" ? "active" : ""}`}>
                Quiz Create
            </Link>
        </header>
    );
};
