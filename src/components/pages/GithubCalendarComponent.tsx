import ContributionGraph from "./ContributionGraph";
import { Slide } from "@/animation/Slide";

export default function GithubCalendarComponent() {
  return (
    <section className="mt-32">
      <Slide delay={0.16} className="mb-8">
        <h2 className="font-incognito text-4xl font-bold tracking-tight">
          Contribution Graph
        </h2>
      </Slide>

      <Slide delay={0.18}>
        <ContributionGraph />
      </Slide>
    </section>
  );
}
