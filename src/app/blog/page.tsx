import { Metadata } from "next";
import { BiDetail } from "react-icons/bi";
import Posts from "@/components/pages/Posts";
import Social from "@/components/shared/Social";
import { Slide } from "@/animation/Slide";
import PageHeading from "@/components/shared/PageHeading";

export const metadata: Metadata = {
  title: "Blog | Deekshith Goud",
  metadataBase: new URL("https://deekshith-goud.vercel.app/blog"),
  description: "Read latest stories from Deekshith Goud's Blog",
  openGraph: {
    title: "Blog | Deekshith Goud",
    url: "https://deekshith-goud.vercel.app/blog",
    description: "Read latest stories from Deekshith Goud's Blog",
    images:
      "/images/placeholder-blog.png",
  },
};

import FeaturedPosts from "@/components/pages/FeaturedPosts";
import { BiStar } from "react-icons/bi";

export default async function Blog() {
  return (
    <main className="max-w-7xl mx-auto md:px-16 px-6">
      <PageHeading
        title="Blog"
        description="Welcome to my blog domain where I share personal stories about things I've learned, projects I'm hacking on and just general findings. I also write for other publications."
      >
        <Social type="publication" />
      </PageHeading>

      <Slide delay={0.1}>
        <div className="flex items-center gap-x-3 mb-6">
          <BiStar className="text-xl text-emerald-500" />
          <h2 className="text-xl font-semibold tracking-tight">Featured Stories</h2>
        </div>
        <div className="mb-12">
          <FeaturedPosts />
        </div>

        <div className="flex items-center gap-x-3 mb-8">
          <BiDetail className="text-xl" />
          <h2 className="text-xl font-semibold tracking-tight">Explore All</h2>
        </div>
        <Posts />
      </Slide>
    </main>
  );
}
