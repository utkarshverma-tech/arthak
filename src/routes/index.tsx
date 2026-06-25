import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/HeroSection";
import { Header } from "@/components/Header";
import { ProblemSection } from "@/components/ProblemSection";
import { CareerPathsSection } from "@/components/CareerPathsSection";
import { JourneySection } from "@/components/JourneySection";
import { FeaturesSection } from "@/components/FeaturesSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Arthak — Career Operating System for Students" },
      { name: "description", content: "From confused student to career-ready professional. Career assessments, roadmaps, projects, ATS resume builder, hackathons and internships — all in one place." },
      { property: "og:title", content: "Arthak — Career Operating System for Students" },
      { property: "og:description", content: "From confused student to career-ready professional. Roadmaps, projects, ATS resume, hackathons and internships in one place." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Header />
      <HeroSection />
      <ProblemSection />
      <CareerPathsSection />
      <JourneySection />
      <FeaturesSection />
    </>
  );
}
