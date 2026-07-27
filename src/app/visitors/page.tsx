import MarksGallery from "@/components/global/VisitorMarks/MarksGallery";

export const metadata = {
  title: "Visitors | Deekshith",
  description: "A canvas of chaos, gallery of giggles. Leave your mark.",
};

export default function VisitorsPage() {
  return (
    <main className="max-w-7xl mx-auto md:px-16 px-6">
      <MarksGallery />
    </main>
  );
}
