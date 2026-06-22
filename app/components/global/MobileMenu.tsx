// @ts-nocheck
"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import {
  HiBeaker,
  HiBookmarkAlt,
  HiCamera,
  HiOutlineX,
  HiUser,
} from "react-icons/hi";
import Logo from "../../../public/logo.png";

import { motion, AnimatePresence } from "framer-motion";

export default function MobileMenu() {
  const [navShow, setNavShow] = useState(false);
  const data = [
    {
      title: "About",
      href: "/about",
      icon: HiUser,
    },
    {
      title: "Projects",
      href: "/projects",
      icon: HiBeaker,
    },
    {
      title: "Blog",
      href: "/blog",
      icon: HiBookmarkAlt,
    },
    {
      title: "Photos",
      href: "/photos",
      icon: HiCamera,
    },
  ];

  const onToggleNav = () => {
    setNavShow((status) => {
      if (status) {
        document.body.style.overflow = "auto";
      } else {
        document.body.style.overflow = "hidden";
      }
      return !status;
    });
  };

  return (
    <>
      <motion.button
        aria-label="Toggle Menu"
        {...({ onClick: onToggleNav } as any)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="md:hidden dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 rounded-md p-2"
      >
        <RxHamburgerMenu className="text-xl" />
      </motion.button>
      <AnimatePresence>
        {navShow && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="md:hidden fixed left-0 top-0 z-50 h-full w-full dark:bg-zinc-900 bg-white"
          >
            <div className="flex items-center justify-between mt-6 px-8">
              <Link href="/" onClick={onToggleNav}>
                <Image src={Logo} width={35} height={35} alt="logo" />
              </Link>

              <motion.button
                aria-label="Toggle Menu"
                {...({ onClick: onToggleNav } as any)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="md:hidden dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 rounded-full p-2"
              >
                <HiOutlineX className="text-xl" />
              </motion.button>
            </div>
            <nav className="flex flex-col mt-6">
              {data.map((link, i) => (
                <motion.div
                  key={link.title}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="flex items-center gap-x-2 font-incognito font-semibold text-lg dark:shadow-line-dark shadow-line-light p-6 group"
                    onClick={onToggleNav}
                  >
                    <link.icon
                      className="text-zinc-500 group-hover:dark:text-white group-hover:text-zinc-800 duration-300"
                      aria-hidden="true"
                    />
                    {link.title}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
