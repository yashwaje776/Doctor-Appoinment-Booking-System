import { redirect } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  Users,
  CalendarCheck,
  Stethoscope,
  BarChart3,
  Clock,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { checkDoctor } from "@/actions/doctorDashboard";

export const metadata = {
  title: "Doctor Dashboard - BookmyDoc",
  description: "Manage appointments, earnings, and availability",
};

export default async function DoctorLayout({ children }) {
  const Doctor = await checkDoctor();

  if (!Doctor) redirect("/");

  return (
    <div className="container mx-auto px-4 py-24">
      <PageHeader icon={<Stethoscope />} title="Doctor Dashboard" />

      <div className="mt-8">
        <Tabs
          defaultValue="dashboard"
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <TabsList
            className="
              md:col-span-1
              bg-muted/20
              border border-emerald-900/20
              rounded-md
              p-2
              flex
              flex-row md:flex-col
              gap-2
              h-auto md:h-[300px]
            "
          >
            <TabsTrigger
              value="dashboard"
              className="w-full py-2 md:px-4 md:flex md:items-center md:justify-start"
            >
              <BarChart3 className="h-4 w-4 mr-2 hidden md:inline text-emerald-400" />
              Dashboard
            </TabsTrigger>

            <TabsTrigger
              value="pending"
              className="w-full py-2 md:px-4 md:flex md:items-center md:justify-start"
            >
              <AlertCircle className="h-4 w-4 mr-2 hidden md:inline text-emerald-400" />
              Appointment Requests
            </TabsTrigger>


            <TabsTrigger
              value="availability"
              className="w-full py-2 md:px-4 md:flex md:items-center md:justify-start"
            >
              <Clock className="h-4 w-4 mr-2 hidden md:inline text-emerald-400" />
              Availability
            </TabsTrigger>

            <TabsTrigger
              value="completed-appointments"
              className="w-full py-2 md:px-4 md:flex md:items-center md:justify-start"
            >
              <CalendarCheck className="h-4 w-4 mr-2 hidden md:inline text-emerald-400" />
              Completed Appointments
            </TabsTrigger>
          </TabsList>

          <div className="md:col-span-3 bg-muted/20 p-6 rounded-lg border border-emerald-900/30">
            {children}
          </div>
        </Tabs>
      </div>
    </div>
  );
}
