import Image from "next/image";
import { Metadata } from "next";
import { profileQuery } from "@/lib/sanity.query";
import type { ProfileType } from "@/types";
import { PortableText } from "@portabletext/react";
import { BiEnvelope, BiLinkExternal, BiSolidDownload } from "react-icons/bi";
import { CustomPortableText } from "../components/shared/CustomPortableText";
import Heroes from "../components/pages/Heroes";
import CoreTechnologies from "../components/pages/CoreTechnologies";
import { Slide } from "../animation/Slide";
import { sanityFetch } from "@/lib/sanity.client";
import RefLink from "../components/shared/RefLink";
import { hobbiesQuery } from "@/lib/sanity.query";
import { HobbyType } from "@/types";
import HobbiesSection from "../components/pages/Hobbies";
import { urlFor } from "@/lib/sanity.image";
import { TextReveal } from "../animation/TextReveal";

import {
  BiLogoGithub,
  BiLogoLinkedinSquare,
  BiLogoGmail,
} from "react-icons/bi";
import { SiLeetcode } from "react-icons/si";


export const metadata: Metadata = {
  title: "About | Deekshith Goud",
  metadataBase: new URL("https://yourdomain.com/about"),
  description:
    "Learn more about my skills, experience and technical background",
  openGraph: {
    title: "About | Deekshith Goud",
    url: "https://yourdomain.com/about",
    description:
      "Learn more about my skills, experience and technical background",
    images:
      "/placeholder-og.png",
  },
};

export default async function About() {
  const profile: ProfileType = await sanityFetch({
    query: profileQuery,
    tags: ["profile"],
  });

  const hobbies: HobbyType[] = await sanityFetch({
    query: hobbiesQuery,
    tags: ["hobby"],
  });

  return (
    <main className="relative lg:max-w-7xl mx-auto max-w-3xl md:px-16 px-6">
      <div key={profile?._id}>
        <section className="relative grid lg:grid-cols-custom grid-cols-1 gap-x-6 justify-items-center">

          <div className="order-2 lg:order-none">
            <Slide>
              <h1 className="font-incognito font-semibold tracking-tight sm:text-5xl text-3xl lg:leading-tight basis-1/2 mb-8">
                <TextReveal text={`Hi, I'm ${profile?.fullName ?? "John Doe"}.`} />
              </h1>

              <div className="dark:text-zinc-400 text-zinc-600 leading-relaxed">
                {profile?.fullBio ? (
                  <PortableText
                    value={profile?.fullBio}
                    components={CustomPortableText}
                  />
                ) : (
                  "Your bio information will show up here"
                )}
              </div>
            </Slide>
          </div>

          <aside className="flex flex-col lg:justify-self-center justify-self-start gap-y-8 lg:order-1 order-none mb-12">
            <Slide delay={0.1}>
              <div className="sticky top-10">
                {profile?.profileImage ? (
                  <Image
                    className="rounded-2xl mb-4 object-cover max-h-96 min-h-96 bg-top"
                    src={urlFor(profile.profileImage).width(400).height(400).url()}
                    width={400}
                    height={400}
                    quality={100}
                    alt={profile.profileImage.alt || profile.fullName}
                    placeholder={profile?.lqip ? "blur" : "empty"}
                    blurDataURL={profile?.lqip || ""}
                    priority
                  />
                ) : (
                  <div className="h-96 w-[400px] bg-zinc-500 mb-4"></div>
                )}

                <div className="flex flex-col text-center gap-y-4">
                  <div className="flex items-center gap-x-3">
                    <RefLink
                      href="https://deekshithgoud-resume.netlify.app/"
                      className="relative overflow-hidden flex items-center justify-center text-center gap-x-2 basis-[90%] dark:bg-primary-bg bg-zinc-100 border border-transparent dark:hover:border-zinc-700 hover:border-zinc-200 rounded-md py-2 text-lg font-incognito font-semibold group"
                    >
                      View Résumé <BiLinkExternal className="text-base" />
                      {/* Rainbow underline */}
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[linear-gradient(90deg,#8B5CF6,#F97316,#FBBF24,#34D399,#3B82F6)] opacity-80 group-hover:opacity-100 transition-opacity" />
                    </RefLink>
                    <a
                      href={`${profile?.resumeURL}?dl=${profile?.fullName}-resume.pdf`}
                      className="relative overflow-hidden flex items-center justify-center text-center dark:text-primary-color text-secondary-color hover:underline basis-[10%] dark:bg-primary-bg bg-zinc-100 border border-transparent dark:hover:border-zinc-700 hover:border-zinc-200 rounded-md py-3 text-lg group"
                      title="Download Resume"
                    >
                      <BiSolidDownload
                        className="text-lg"
                        aria-label="Download Resume"
                      />
                      {/* Rainbow underline */}
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[linear-gradient(90deg,#8B5CF6,#F97316,#FBBF24,#34D399,#3B82F6)] opacity-80 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </div>

                  <a
                    href={`mailto:${profile?.email}`}
                    className="flex items-center gap-x-2 hover:text-primary-color mb-4"
                  >
                    <BiEnvelope className="text-lg" />
                    {profile?.email ?? "Email address no available"}
                  </a>

                  <div className="flex items-center justify-center gap-x-6 text-2xl border-t dark:border-zinc-800 border-zinc-200 pt-6">
                    <RefLink
                      href="https://github.com/Deekshith-goud"
                      title="GitHub"
                    >
                      <BiLogoGithub className="hover:text-zinc-500 duration-300" />
                    </RefLink>
                    <RefLink
                      href="https://linkedin.com/in/yourusername"
                      title="LinkedIn"
                    >
                      <BiLogoLinkedinSquare className="text-blue-500 hover:text-blue-600 duration-300" />
                    </RefLink>
                    <RefLink href={`mailto:${profile?.email}`} title="Gmail">
                      <BiLogoGmail className="text-red-500 hover:text-red-600 duration-300" />
                    </RefLink>
                    <RefLink
                      href="https://leetcode.com/u/Deekshith_goud/"
                      title="LeetCode"
                    >
                      <SiLeetcode className="text-orange-500 hover:text-orange-600 duration-300" />
                    </RefLink>
                  </div>
                </div>
              </div>
            </Slide>
          </aside>

        </section>
        <Slide delay={0.14}>
          <CoreTechnologies />
          <HobbiesSection hobbies={hobbies} />
        </Slide>
        <Heroes />

      </div>
    </main>
  );
}
