import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { hobbiesQuery } from "@/lib/sanity.query";
import { HobbyType } from "@/types";
import { sanityFetch } from "@/lib/sanity.client";
import { Slide } from "../animation/Slide";
import PageHeading from "../components/shared/PageHeading";
import { BiArrowBack } from "react-icons/bi";
export const metadata: Metadata = {
  title: "Hobbies | Deekshith Goud",
  description: "Explore my interests and hobbies beyond coding.",
};

import HobbyCard from "../components/shared/HobbyCard";

export default async function HobbiesPage() {
  const hobbies: HobbyType[] = await sanityFetch({
    query: hobbiesQuery,
    tags: ["hobby"],
  });

  return (
    <main className="max-w-7xl mx-auto md:px-16 px-6 lg:mt-32 mt-20">
      <Slide>
        <Link
          href="/about"
          className="flex items-center gap-x-2 text-zinc-500 hover:text-primary-color mb-6 group"
        >
          <BiArrowBack className="group-hover:-translate-x-1 duration-300" />
          Back to About
        </Link>
        <PageHeading
          title="Hobbies & Interests"
          description="A deeper look into the things that keep me inspired and creative outside of my professional work. From photography to gaming, these are the passions that shape my perspective."
        />
      </Slide>


      <section className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8 mt-12 mb-20">
        {hobbies.map((hobby, index) => (
          <Slide key={hobby._id}>
            <HobbyCard hobby={hobby} index={index} layout="grid" />
          </Slide>
        ))}
      </section>
    </main>
  );
}
