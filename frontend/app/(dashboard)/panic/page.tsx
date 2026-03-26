import type { Metadata } from "next";
import PanicUpload from "@/app/components/PanicUpload";

export const metadata: Metadata = {
  title: "PanicButton | Cueforth",
  description: "Use PanicButton by Cueforth to upload a syllabus, review likely deadlines, and export a working calendar.",
};

export default function PanicDashboardPage() {
  return <PanicUpload />;
}
