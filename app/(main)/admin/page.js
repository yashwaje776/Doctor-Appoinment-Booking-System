import {
  getPendingDoctors,
  getVerifiedDoctors,
  getAllPatients,
  getAllAppointments,
} from "@/actions/admin";

import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PendingDoctorsClient from "./_components/PendingDoctorsClient";
import { User } from "lucide-react";

export default async function AdminPage() {
  const [pendingDoctors, verifiedDoctors, patients, appointment] =
    await Promise.all([
      getPendingDoctors(),
      getVerifiedDoctors(),
      getAllPatients(),
      getAllAppointments(),
    ]);

  return (
    <>
      <TabsContent value="pending" className="border-none p-0 space-y-5">
        <p className="text-emerald-400 text-2xl font-semibold tracking-wide">
          Pending Doctor Verifications
        </p>

        <Card className="rounded-2xl border border-emerald-900/40 bg-[#0d1712] shadow-lg">
          <CardContent className="p-6">
            {pendingDoctors?.length === 0 ? (
              <p className="text-muted-foreground">No pending requests.</p>
            ) : (
              <PendingDoctorsClient doctors={pendingDoctors} />
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="doctors" className="border-none p-0 space-y-5">
        <p className="text-emerald-400 text-2xl font-semibold tracking-wide">
          Manage Doctors
        </p>

        <Card className="rounded-2xl border border-emerald-900/40 bg-[#0d1712] shadow-lg">
          <CardContent className="p-6">
            {verifiedDoctors?.length === 0 && (
              <p className="text-muted-foreground">No verified doctors yet.</p>
            )}

            <div className="space-y-4">
              {verifiedDoctors?.map((doc) => (
                <div
                  key={doc._id}
                  className="p-4 bg-[#122019] border border-emerald-900/40 rounded-xl hover:border-emerald-700/50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-white font-medium">
                        <User className="h-5 w-5 text-emerald-400" />
                        {doc.user?.name}
                      </div>

                      <p className="text-sm text-emerald-400">
                        {doc.speciality}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Experience: {doc.experience} years
                      </p>
                    </div>

                    <Badge className="border-emerald-500 text-emerald-400">
                      Verified
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="patients" className="border-none p-0 space-y-5">
        <p className="text-emerald-400 text-2xl font-semibold tracking-wide">
          All Patients
        </p>

        <Card className="rounded-2xl border border-emerald-900/40 bg-[#0d1712] shadow-lg">
          <CardContent className="p-6">
            {patients?.length === 0 && (
              <p className="text-muted-foreground">No patients registered.</p>
            )}

            <div className="space-y-4">
              {patients?.map((patient) => (
                <div
                  key={patient._id}
                  className="p-4 bg-[#122019] border border-emerald-900/40 rounded-xl hover:border-blue-700/40 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white">
                        {patient.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {patient.email}
                      </p>
                    </div>

                    <Badge className="border-blue-500 text-blue-400">
                      Patient
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="appointments" className="border-none p-0 space-y-5">
        <p className="text-emerald-400 text-2xl font-semibold tracking-wide">
          All Appointments
        </p>

        <Card className="rounded-2xl border border-emerald-900/40 bg-[#0d1712] shadow-lg">
          <CardContent className="p-6">
            {appointment?.length === 0 && (
              <p className="text-muted-foreground">No appointments found.</p>
            )}

            <div className="space-y-4">
              {appointment?.map((a) => (
                <div
                  key={a._id}
                  className="p-4 bg-[#122019] border border-emerald-900/40 rounded-xl hover:border-emerald-600/40 transition-all"
                >
                  <div className="flex justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-white">
                        {a.patientId?.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {a.patientId?.email}
                      </p>

                      <h4 className="font-semibold text-emerald-400 mt-2">
                        Dr. {a.doctorId?.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {a.doctorId?.email}
                      </p>
                    </div>

                    <Badge className="border-emerald-500 text-emerald-400">
                      {a.status}
                    </Badge>
                  </div>

                  <div className="h-px bg-emerald-900/20 my-3" />

                  <p className="text-sm text-white">
                    Date:{" "}
                    <span className="text-emerald-400">
                      {new Date(a.date).toLocaleDateString()}
                    </span>
                  </p>

                  <p className="text-sm text-white">
                    Time:{" "}
                    <span className="text-emerald-400">{a.time}</span>
                  </p>

                  <p className="text-sm text-white mt-2">
                    Payment:{" "}
                    <span className="text-emerald-400">{a.paymentStatus}</span>
                  </p>

                  <p className="text-sm text-white">
                    Amount:{" "}
                    <span className="text-emerald-400">₹{a.amount}</span>
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );
}
