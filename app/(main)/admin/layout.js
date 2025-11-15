import { redirect } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, AlertCircle, Users, CalendarCheck } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { checkAdmin } from "@/actions/admin";

export const metadata = {
  title: "Admin Settings - BookmyDoc",
  description: "Manage doctors, patients, and platform settings",
};

export default async function AdminLayout({ children }) {
  const isAdmin = await checkAdmin();

  if (!isAdmin) {
    redirect("/onboarding");
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <PageHeader icon={<ShieldCheck />} title="Admin Settings" />

      <div className="mt-8">
        <Tabs
          defaultValue="pending"
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <TabsList
            className="
              md:col-span-1
              bg-muted/20
              border
              rounded-md
              p-2
              flex
              flex-row
              md:flex-col
              gap-2
              h-auto
              md:h-[230px]
            "
          >
            <TabsTrigger
              value="pending"
              className="
                flex-1
                md:flex
                md:items-center
                md:justify-start
                w-full
                md:px-4
                py-2
              "
            >
              <AlertCircle className="h-4 w-4 mr-2 hidden md:inline" />
              Pending Verification
            </TabsTrigger>

            <TabsTrigger
              value="doctors"
              className="
                flex-1
                md:flex
                md:items-center
                md:justify-start
                w-full
                md:px-4
                py-2
              "
            >
              <Users className="h-4 w-4 mr-2 hidden md:inline" />
              Doctors
            </TabsTrigger>

            <TabsTrigger
              value="patients"
              className="
                flex-1
                md:flex
                md:items-center
                md:justify-start
                w-full
                md:px-4
                py-2
              "
            >
              <Users className="h-4 w-4 mr-2 hidden md:inline" />
              Patients
            </TabsTrigger>

            <TabsTrigger
              value="appointments"
              className="
                flex-1
                md:flex
                md:items-center
                md:justify-start
                w-full
                md:px-4
                py-2
              "
            >
              <CalendarCheck className="h-4 w-4 mr-2 hidden md:inline" />
              Appointments
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
