"use client";

import { socialLinks } from "../../data/social";
import RefLink from "./RefLink";
import Magnetic from "../global/Magnetic";
import { motion } from "framer-motion";

export default function Social({ type }: { type: "social" | "publication" }) {
  return (
    <ul className="flex items-center flex-wrap gap-x-5 gap-y-4 my-10">
      {socialLinks
        .filter((item) => item.status === type)
        .map((value) => {
          const Icon = value.icon;
          return (
          <li key={value.id}>
            <Magnetic>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <RefLink
                  href={value.url}
                  className="flex items-center border-b dark:border-b-zinc-800 border-zinc-200 group pb-1"
                >
                  <Icon
                    className="flex-shrink-0 h-5 w-5 text-zinc-500 group-hover:dark:text-white group-hover:text-zinc-800 duration-300"
                    aria-hidden="true"
                  />{" "}
                  &nbsp;
                  {value.name}
                </RefLink>
              </motion.div>
            </Magnetic>
          </li>
        )})}
    </ul>
  );
}
