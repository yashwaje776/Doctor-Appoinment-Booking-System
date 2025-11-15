import { getDoctorById } from "@/actions/doctor";
import { redirect } from "next/navigation";
import TimeSelector from "../../_components/TimeSelctor";
import { checkUser } from "@/lib/checkUser";
import { Calendar, Clock } from "lucide-react";

export default async function DoctorSpecialtyPage({ params }) {
  let user = await checkUser();
  const { speciality, id } = await params;

  if (!speciality || !id) redirect("/doctors");

  let docInfo = await getDoctorById(speciality, id);
  if (!docInfo) redirect("/doctors");

  user = JSON.parse(JSON.stringify(user));
  docInfo = JSON.parse(JSON.stringify(docInfo));

  const availability = { start: "9:00", end: "17:00" };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      <div className="md:col-span-1">
        <div className="md:sticky md:top-24">
          <div className="bg-muted/20 border border-emerald-900/20 rounded-xl p-6 text-center">
            <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden bg-emerald-900/20 mb-4">
              <img
                src={docInfo.user.imageUrl}
                alt={docInfo.user.name}
                className="object-cover w-full h-full"
              />
            </div>

            <h2 className="text-xl font-bold text-white">
              Dr. {docInfo.user.name}
            </h2>

            <p className="mt-1 text-emerald-400 capitalize">
              {docInfo.speciality}
            </p>

            <div className="text-muted-foreground mt-3 text-sm">
              {docInfo.experience} years experience
            </div>

            <div className="mt-4 border border-emerald-900/20 rounded-lg p-3">
              <p className="text-sm">
                Appointment Fee:{" "}
                <span className="text-primary">₹ {docInfo.fees}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="md:col-span-2 space-y-6">
        <div className="bg-muted/20 border border-emerald-900/20 rounded-xl p-6 space-y-4">
          <h1 className="text-2xl font-bold text-white">About</h1>
          <p className="text-sm text-gray-300 mt-4 leading-relaxed">
            {docInfo.about}
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-emerald-400" />
              <h3 className="text-white font-medium">Availability</h3>
            </div>

            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-emerald-400 mr-2" />
              <p className="text-muted-foreground">
                45 time slots available for booking over the next 4 days
              </p>
            </div>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 text-white">
          <h2 className="text-xl font-semibold mb-2">Book Appointment</h2>

          <TimeSelector
            availability={availability}
            docInfo={docInfo}
            user={user}
          />
        </div>
      </div>
    </div>
  );
}
