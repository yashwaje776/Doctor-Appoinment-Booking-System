import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { getDoctorById } from "@/actions/doctor";

export async function generateMetadata({ params }) {
  const { speciality, id } = await params;
  console.log(speciality, id);
  if (!speciality || !id) redirect("/doctors");
  let doctor = await getDoctorById(speciality, id);
  return {
    title: `Dr. ${doctor.user.name} - bookmydoc`,
    description: `Book an appointment with Dr. ${doctor.name}, ${doctor.specialty} specialist with ${doctor.experience} years of experience.`,
  };
}

export default async function DoctorProfileLayout({ children, params }) {
  const { speciality, id } = await params;
  console.log(speciality, id);
  if (!speciality || !id) redirect("/doctors");
  let doctor = await getDoctorById(speciality, id);
  if (!doctor) redirect("/doctors");

  return (
    <div className="container mx-auto">
      <PageHeader
        title={"Dr. " + doctor.user.name}
        backLink={`/doctors/${doctor.speciality}`}
        backLabel={`Back to ${doctor.speciality}`}
      />

      {children}
    </div>
  );
}
