import { Slide } from "@/animation/Slide";
import Image from "next/image";
import { Metadata } from "next";
import PageHeading from "@/components/shared/PageHeading";
import { photosQuery } from "@/sanity/lib/sanity.query";
import { PhotoType } from "@/types";
import { sanityFetch } from "@/sanity/lib/sanity.client";
import EmptyState from "@/components/shared/EmptyState";

export const metadata: Metadata = {
  title: "Photos | Deekshith Goud",
  metadataBase: new URL("https://deekshith-goud.vercel.app/photos"),
  description: "Explore photos taken by Deekshith Goud",
  openGraph: {
    title: "Photos | Deekshith Goud",
    url: "https://deekshith-goud.vercel.app/photos",
    description: "Explore photos taken by Deekshith Goud",
    images:
      "/images/logo.png",
  },
};

import PhotoCard from "@/components/pages/PhotoCard";

export default async function Photos() {
  const photos: PhotoType[] = await sanityFetch({
    query: photosQuery,
    tags: ["photo"],
  });

  return (
    <main className="max-w-7xl mx-auto md:px-16 px-6 lg:mt-32 mt-20">
      <PageHeading
        title="Photos"
        description="A collection of photos I've taken over the years."
      />
      
      <section className="mt-12">
        <Slide delay={0.12}>
          {photos.length > 0 ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {photos.map((photo) => (
                <PhotoCard key={photo._id} photo={photo} />
              ))}
            </div>
          ) : (
            <EmptyState value="Photos" />
          )}
        </Slide>
      </section>
    </main>
  );
}


