import {
  getCompletedAppointments,
  getDoctorDashboardStats,
  getPendingAppointments,
} from "@/actions/doctorDashboard";

import { TabsContent } from "@/components/ui/tabs";
import AvailabilityForm from "./_component/AvailabilityForm";

export default async function DoctorPage() {
  const pendingAppointments = await getPendingAppointments();
  const completedAppointments = await getCompletedAppointments();
  const dashboard = await getDoctorDashboardStats();

  return (
    <>
      {/* ------------ DASHBOARD TAB ------------ */}
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

      {/* ------------ PENDING / CONFIRMED ------------ */}
      <TabsContent value="pending" className="border-none p-0 space-y-4">
        <h2 className="text-xl font-semibold">Pending / Confirmed Appointments</h2>

        {pendingAppointments.length === 0 ? (
          <p className="text-muted-foreground">No pending or confirmed appointments.</p>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">

            {pendingAppointments.map((app) => (
              <div key={app._id} className="p-4 border rounded-md shadow-sm">
                <p className="font-medium">{app.patientId?.name}</p>

                <p className="text-sm">
                  Date: {new Date(app.date).toLocaleDateString()} | Time: {app.time}
                </p>

                <p className="text-sm capitalize">Status: {app.status}</p>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-3">
                  <button
                    className="px-3 py-1 rounded bg-green-600 text-white text-sm"
                  >
                    Complete
                  </button>

                  <button
                    className="px-3 py-1 rounded bg-red-600 text-white text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}

          </div>
        )}
      </TabsContent>

     
      <TabsContent value="availability" className="border-none p-0 space-y-4">
        <h2 className="text-xl font-semibold">Set Availability</h2>
        <AvailabilityForm />
      </TabsContent>

      <TabsContent value="completed-appointments" className="border-none p-0 space-y-4">
        <h2 className="text-xl font-semibold">Completed Appointments</h2>

        {completedAppointments.length === 0 ? (
          <p className="text-muted-foreground">No completed appointments yet.</p>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {completedAppointments.map((app) => (
              <div key={app._id} className="p-4 border rounded-md shadow-sm bg-white">
                <p className="font-medium">{app.patient?.name}</p>
                <p className="text-sm">
                  Date: {new Date(app.date).toLocaleDateString()}
                </p>
                <p className="text-sm capitalize text-green-600">{app.status}</p>
              </div>
            ))}
          </div>
        )}
      </TabsContent>
    </>
  );
}
