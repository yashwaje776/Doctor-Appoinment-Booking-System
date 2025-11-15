import {
  getPendingDoctors,
  getVerifiedDoctors,
  getAllPatients,
} from "@/actions/admin";

import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PendingDoctorsClient from "./_components/PendingDoctorsClient";
import { User } from "lucide-react";

export default async function AdminPage() {
  const [pendingDoctors, verifiedDoctors, patients] = await Promise.all([
    getPendingDoctors(),
    getVerifiedDoctors(),
    getAllPatients(),
  ]);

  return (
    <>
      <TabsContent value="pending" className="border-none p-0 space-y-4">
        <p className="text-emerald-400 text-xl font-bold">
          Pending Doctor Verifications
        </p>
        <Card className="border-emerald-900/40   ">
          <CardContent>
            {pendingDoctors?.length === 0 ? (
              <p className="text-muted-foreground">No pending requests.</p>
            ) : (
              <PendingDoctorsClient doctors={pendingDoctors} />
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="doctors" className="border-none p-0 space-y-4">
        <p className="text-emerald-400 text-xl font-bold">Manage Doctors </p>

        <Card className="border-emerald-900/40">
          <CardContent>
            {verifiedDoctors?.length === 0 && (
              <p className="text-muted-foreground ">No verified doctors yet.</p>
            )}

            <div className="space-y-3">
              {verifiedDoctors?.map((doc) => (
                <div
                  key={doc._id}
                  className="p-4 border border-emerald-900/30 rounded-md bg-background"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white flex gap-2">
                        <User className="h-5 w-5 text-emerald-400" />
                        {doc.user?.name}
                      </h3>

                      <p className="text-sm text-emerald-400">
                        {doc.speciality}
                      </p>

                      <p className="text-xs text-muted-foreground mt-1">
                        Experience: {doc.experience} years
                      </p>
                    </div>

                    <Badge variant="outline" className="border-green-500">
                      Verified
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="patients" className="border-none p-0 space-y-4">
        <p className="text-emerald-400 text-xl font-bold">All Patients</p>
        <Card className="border-emerald-900/40">
          <CardContent>
            {patients?.length === 0 && (
              <p className="text-muted-foreground ">No patients registered.</p>
            )}

            <div className="space-y-3">
              {patients?.map((patient) => (
                <div
                  key={patient._id}
                  className="p-4 border border-emerald-900/30 bg-background rounded-md"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white">
                        {patient.name}
                      </h3>

                      <p className="text-xs text-muted-foreground">
                        Email: {patient.email}
                      </p>
                    </div>

                    <Badge variant="outline" className="border-blue-500">
                      Patient
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="appointments" className="border-none p-0 space-y-4">
        <p className="text-emerald-400 text-xl font-bold">Appointments</p>
        <Card className="border-emerald-900/40">
          <CardContent>
            <p className="text-muted-foreground ">
              Appointments module coming soon.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );
}
