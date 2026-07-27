import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { projectsQuery } from "@/sanity/lib/sanity.query";
import type { ProjectType } from "@/types";
import EmptyState from "@/components/shared/EmptyState";
import { Slide } from "@/animation/Slide";
import { sanityFetch } from "@/sanity/lib/sanity.client";
import PageHeading from "@/components/shared/PageHeading";
import { urlFor } from "@/sanity/lib/sanity.image";
import dynamic from "next/dynamic";

const GithubStats = dynamic(() => import("@/components/pages/GithubStats"), {
  loading: () => <div className="min-h-[400px] w-full animate-pulse bg-zinc-50 dark:bg-zinc-900 rounded-2xl" />
});

export const metadata: Metadata = {
  title: "Projects | Deekshith Goud",
  metadataBase: new URL("https://deekshith-goud.vercel.app/projects"),
  description: "Explore projects built by Deekshith Goud",
  openGraph: {
    title: "Projects | Deekshith Goud",
    url: "https://deekshith-goud.vercel.app/projects",
    description: "Explore projects built by Deekshith Goud",
    images:
      "/images/placeholder-projects.png",
  },
};

export default async function Project() {
  const projects: ProjectType[] = await sanityFetch({
    query: projectsQuery,
    tags: ["project"],
  });

  return (
    <main className="max-w-7xl mx-auto md:px-16 px-6">
      <PageHeading
        title="Projects"
        description="I've worked on tons of little projects over the years but these are the ones that I'm most proud of. Many of them are open-source, so if you see something that piques your interest, check out the code and contribute if you have ideas on how it can be improved."
      />

      {projects.length > 0 ? (
        <section className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 mb-12">
          {projects.map((project, index) => (
            <Slide key={project._id} delay={(index % 6) * 0.1}>
              <Link
                href={`/projects/${project.slug}`}
                className="relative overflow-hidden group flex items-center gap-x-4 dark:bg-primary-bg bg-zinc-50 border border-transparent dark:hover:border-zinc-700 hover:border-zinc-200 p-4 rounded-lg"
              >
                {project.logo ? (
                  <Image
                    src={urlFor(project.logo).width(300).height(300).url()}
                    width={180}
                    height={180}
                    quality={95}
                    alt={project.name}
                    className="dark:bg-zinc-800 bg-zinc-100 rounded-md p-2 w-[60px] h-[60px] object-contain"
                  />
                ) : (
                  <div className="dark:bg-primary-bg bg-zinc-50 border border-transparent dark:hover:border-zinc-700 hover:border-zinc-200 p-2 rounded-lg text-3xl">
                    🪴
                  </div>
                )}
                <div>
                  <h2 className="text-lg tracking-wide mb-1">{project.name}</h2>
                  <div className="text-sm dark:text-zinc-400 text-zinc-600">
                    {project.tagline}
                  </div>
                </div>
                {/* Rainbow hover underline */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[linear-gradient(90deg,#8B5CF6,#F97316,#FBBF24,#34D399,#3B82F6)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </Slide>
          ))}
        </section>
      ) : (
        <EmptyState value="Projects" />
      )}
      
      {/* GitHub Stats section */}
      <GithubStats />
    </main>
  );
}
