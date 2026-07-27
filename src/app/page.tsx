import { profileQuery } from "@/sanity/lib/sanity.query";
import type { ProfileType } from "@/types";
import HeroSvg from "@/assets/icons/HeroSvg";
import Job from "@/components/pages/Job";
import Social from "@/components/shared/Social";
import { Slide } from "@/animation/Slide";
import { sanityFetch } from "@/sanity/lib/sanity.client";
import dynamic from "next/dynamic";

const CoreTechnologies = dynamic(() => import("@/components/pages/CoreTechnologies"), {
  loading: () => <div className="min-h-[150px] w-full animate-pulse bg-zinc-50 dark:bg-zinc-900 rounded-2xl" />
});

const GithubCalendarComponent = dynamic(() => import("@/components/pages/GithubCalendarComponent"), {
  loading: () => <div className="min-h-[180px] w-full animate-pulse bg-zinc-50 dark:bg-zinc-900 rounded-2xl" />
});

import VisitorWidget from "@/components/global/VisitorWidget";


export default async function Home() {
  const profile: ProfileType = await sanityFetch({
    query: profileQuery,
    tags: ["profile"],
  });

  return (
    <main className="max-w-7xl mx-auto md:px-16 px-6 lg:mt-32 mt-20 overflow-x-clip">
      <section className="flex xl:flex-row flex-col xl:items-center items-start xl:justify-center justify-between gap-x-12 mb-16">
        <div key={profile?._id} className="lg:max-w-2xl max-w-2xl opacity-0 animate-fade-in-up">
          <VisitorWidget />
          <h1 className="font-incognito font-semibold tracking-tight text-3xl sm:text-5xl mb-6 lg:leading-[3.7rem] leading-tight lg:min-w-[700px] min-w-full">
            {profile?.headline ?? "Job Title"}
          </h1>
          <p className="text-base dark:text-zinc-400 text-zinc-600 leading-relaxed">
            {profile?.shortBio ?? "Short bio description"}
          </p>
          <Slide delay={0.1}>
            <Social type="social" />
          </Slide>
        </div>
        <div className="w-full hidden md:flex justify-center mt-10 xl:mt-0">
          <Slide delay={0.14}>
            <HeroSvg />
          </Slide>
        </div>
      </section>
      <GithubCalendarComponent />
      <CoreTechnologies />
      <Job />
    </main>
  );
}
