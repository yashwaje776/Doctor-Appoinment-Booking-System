import {
  getAvailability,
  getCompletedAppointments,
  getDoctorDashboardStats,
  getPendingAppointments,
} from "@/actions/doctorDashboard";

import { TabsContent } from "@/components/ui/tabs";
import AvailabilityForm from "./_component/AvailabilityForm";
import JoinMeetingButton from "./_component/JoinMeetingButton";
import AppointmentActions from "./_component/AppointmentActions";
import AppointmentDetails from "./_component/AppointmentDetails";

export default async function DoctorPage() {
  let pendingAppointments = await getPendingAppointments();
  let completedAppointments = await getCompletedAppointments();
  let dashboard = await getDoctorDashboardStats();
  let availability = await getAvailability();
  console.log(availability);

  pendingAppointments = JSON.parse(JSON.stringify(pendingAppointments));
  completedAppointments = JSON.parse(JSON.stringify(completedAppointments));
  dashboard = JSON.parse(JSON.stringify(dashboard));
  availability = JSON.parse(JSON.stringify(availability));

  return (
    <>
      <TabsContent value="dashboard" className="border-none p-0 space-y-4">
        <h2 className="text-xl font-semibold">Dashboard Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 border rounded-md shadow-sm">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold">{dashboard.pendingCount}</p>
          </div>

          <div className="p-4 border rounded-md shadow-sm">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold">{dashboard.completedCount}</p>
          </div>

          <div className="p-4 border rounded-md shadow-sm">
            <p className="text-sm text-muted-foreground">Total Appointments</p>
            <p className="text-2xl font-bold">{dashboard.totalAppointments}</p>
          </div>

          <div className="p-4 border rounded-md shadow-sm">
            <p className="text-sm text-muted-foreground">Earnings</p>
            <p className="text-2xl font-bold">Rs {dashboard.earnings}</p>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="pending" className="border-none p-0 space-y-4">
        <h2 className="text-xl font-semibold">
          Pending / Confirmed Appointments
        </h2>

        {pendingAppointments.length === 0 ? (
          <p className="text-muted-foreground">
            No pending or confirmed appointments.
          </p>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {pendingAppointments.map((app) => (
              <div key={app._id} className="p-4 border rounded-md shadow-sm">
                <p className="font-medium">{app.patientId?.name}</p>

                <p className="text-sm">
                  Date: {new Date(app.date).toLocaleDateString()} | Time:{" "}
                  {app.time}
                </p>

                <p className="text-sm capitalize">Status: {app.status}</p>

                <div className="flex gap-3 mt-3">
                  <AppointmentActions appointmentId={app._id} />
                  <AppointmentDetails appointment={app} />
                </div>
              </div>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="availability" className="border-none p-0 space-y-4">
        <h2 className="text-xl font-semibold">Set Availability</h2>
        <AvailabilityForm availability={availability} />
      </TabsContent>

      <TabsContent
        value="completed-appointments"
        className="border-none p-0 space-y-6"
      >
        <h2 className="text-2xl font-semibold tracking-tight">
          Completed Appointments
        </h2>

        {completedAppointments.length === 0 ? (
          <div className="flex items-center justify-center h-40 border rounded-xl bg-muted/30">
            <p className="text-muted-foreground text-lg">
              No completed appointments yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
            {completedAppointments.map((app) => (
              <div
                key={app._id}
                className="p-5 border rounded-xl  shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-lg">
                    {app.patientId?.name || "Unknown Patient"}
                  </p>

                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 capitalize">
                    {app.status}
                  </span>
                </div>

                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(app.date).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">Time:</span> {app.time}
                  </p>
                </div>

                <div className="mt-4">
                  <AppointmentDetails appointment={app} />
                </div>
              </div>
            ))}
          </div>
        )}
      </TabsContent>
    </>
  );
}
