import Image from "next/image";
import sanitylogo from "@/public/sanity.png";
import vercellogo from "@/public/vercel.svg";
import nextjslogo from "@/public/nextjs.svg";
import UnmountStudio from "./Unmount";
import AudioPlayer from "./AudioPlayer";

export default function Footer() {
  return (
    <UnmountStudio>
      <footer className="border-t dark:border-zinc-800 border-zinc-100 mt-44 lg:min-h-[250px] min-h-full relative">
        <div className="max-w-7xl mx-auto flex flex-col gap-y-10 md:px-16 px-6 py-16">
          {/* Audio Player Section */}
          <div className="flex justify-end w-full">
            <AudioPlayer />
          </div>

          {/* Divider */}
          <hr className="border-t border-dashed dark:border-zinc-800 border-zinc-200" />

          {/* Bottom Footer Details */}
          <div className="flex lg:flex-row flex-col items-center lg:justify-between justify-center gap-y-4 pt-2">
            <div className="flex md:flex-row flex-col items-center gap-x-2">
              <h3 className="font-inter">Built with:</h3>
              <ul className="flex items-center gap-x-2 text-sm dark:text-zinc-600 text-zinc-400 md:mt-0 mt-3">
                <li>
                  <a
                    href="https://sanity.io"
                    rel="noreferrer noopener"
                    target="_blank"
                    className="flex items-center gap-x-2 dark:text-white text-zinc-600 hover:underline"
                  >
                    <Image
                      src={sanitylogo}
                      width={20}
                      height={20}
                      alt="sanity logo"
                    />{" "}
                    Sanity
                  </a>
                </li>
                <li>
                  <a
                    href="https://nextjs.org"
                    rel="noreferrer noopener"
                    target="_blank"
                    className="flex items-center gap-x-2 dark:text-white text-zinc-600 hover:underline"
                  >
                    <Image
                      src={nextjslogo}
                      width={20}
                      height={20}
                      alt="nextjs logo"
                    />{" "}
                    Next.js
                  </a>
                </li>
                <li>
                  <a
                    href="https://vercel.com"
                    rel="noreferrer noopener"
                    target="_blank"
                    className="flex items-center gap-x-2 dark:text-white text-zinc-600 hover:underline"
                  >
                    <Image
                      src={vercellogo}
                      width={20}
                      height={20}
                      alt="vercel logo"
                    />{" "}
                    Vercel
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex flex-col lg:items-end items-center lg:text-start text-center">
              <small className="text-zinc-500">
                Copyright &copy; Deekshith Goud {new Date().getFullYear()} All rights
                Reserved
              </small>
            </div>
          </div>
        </div>
      </footer>
    </UnmountStudio>
  );
}
