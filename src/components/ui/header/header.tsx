"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
// import { FiMenu } from "react-icons/fi";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  return (
    <>
      <div
        className="
        text-rgba[(0,71,255)] 
        sticky top-0 
        z-50 
        flex 
        h-[55px] 
        justify-between
        bg-none
        p-3
        "
      >
        <div>
          <Link href="/">
            <span className="cursor-pointer text-2xl font-bold">
              ADMIN_YOBESTUDIO
            </span>
          </Link>
        </div>
        <div className="hidden space-x-4 text-sm text-gray-400 sm:flex">
          <p> This is admin page for YOBESTUDIO.</p>
        </div>

        {/* <div className="flex items-center sm:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <FiMenu size={24} color="rgba(0,71,255)" />
          </button>
        </div> */}
      </div>
      {menuOpen && (
        <div
          className="
        fixed
        left-0
        top-0
        z-10 
        flex 
        min-h-screen
        w-screen 
        flex-col
        bg-black/70
        px-4
        py-16 
        text-right 
        text-2xl
        text-white 
        sm:hidden"
          onClick={() => setMenuOpen(false)}
        >
          <Link href="/" onClick={() => setMenuOpen(false)}>
            <span
              className={`py-1 ${pathname === "/" ? "font-light text-[rgba(0,71,255,1)]" : "font-light hover:opacity-50"}`}
            >
              HOME
            </span>
          </Link>
          <Link href="/photography" onClick={() => setMenuOpen(false)}>
            <span
              className={`py-1 ${pathname === "/photography" ? "font-light text-[rgba(0,71,255,1)]" : "font-light hover:opacity-50"}`}
            >
              Photography
            </span>
          </Link>
        </div>
      )}
    </>
  );
}
