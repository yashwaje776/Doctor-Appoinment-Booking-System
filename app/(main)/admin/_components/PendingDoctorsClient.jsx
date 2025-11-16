"use client";

import { useState } from "react";
import { Check, X, ExternalLink, Medal, FileText, User } from "lucide-react";
import { format } from "date-fns";
import { BarLoader } from "react-spinners";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { updateVerification } from "@/actions/admin";


export default function PendingDoctorsClient({ doctors }) {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleViewDetails = (doc) => setSelectedDoctor(doc);

  const handleClose = () => setSelectedDoctor(null);

  const handleUpdateStatus = async (id, status) => {
    if (loading) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("doctorId", id);
    formData.append("status", status);

    const result = await updateVerification(formData);

    setLoading(false);

    if (result?.success) {
      toast.success(
        status === "VERIFIED"
          ? "Doctor approved successfully!"
          : "Doctor rejected."
      );
      handleClose();
    } else {
      toast.error(result?.message || "Failed to update status.");
    }
  };

  return (
    <>
      <div className="space-y-4">
        {doctors.map((doc) => (
          <Card
            key={doc._id}
            className="bg-background border-emerald-900/20 hover:border-emerald-700/30 transition-all"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-muted/20 p-2 rounded-full">
                    <User className="h-5 w-5 text-emerald-400" />
                  </div>

                  <div>
                    <h3 className="font-medium text-white">{doc.user?.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {doc.speciality} • {doc.experience} years experience
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Badge
                    variant="outline"
                    className="border-amber-900/30 bg-amber-900/20 text-amber-400"
                  >
                    Pending
                  </Badge>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewDetails(doc)}
                    className="border-emerald-900/30 hover:bg-muted/80"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedDoctor && (
        <Dialog open onOpenChange={handleClose}>
          <DialogContent className="max-w-4xl lg:min-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl text-white">
                Doctor Verification Details
              </DialogTitle>
              <DialogDescription>
                Review the doctor's information before approving or rejecting.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div>
                  <h4 className="text-sm text-muted-foreground">Name</h4>
                  <p className="text-white">{selectedDoctor.user?.name}</p>
                </div>

                <div>
                  <h4 className="text-sm text-muted-foreground">Email</h4>
                  <p className="text-white">
                    {selectedDoctor.user?.email}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm text-muted-foreground">Applied On</h4>
                  <p className="text-white">
                    {format(new Date(selectedDoctor.createdAt), "PPP")}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Medal className="h-5 w-5 text-emerald-400" />
                  <h3 className="text-white font-medium">
                    Professional Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm text-muted-foreground">
                      Speciality
                    </h4>
                    <p className="text-white">
                      {selectedDoctor.speciality}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm text-muted-foreground">
                      Experience
                    </h4>
                    <p className="text-white">
                      {selectedDoctor.experience} years
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm text-muted-foreground">
                      Credential Document
                    </h4>
                    <a
                      href={selectedDoctor.degree}
                      target="_blank"
                      className="text-emerald-400 flex items-center"
                    >
                      View Credentials{" "}
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  </div>

                  <div>
                    <h4 className="text-sm text-muted-foreground">
                      Fees
                    </h4>
                    <p>₹ {selectedDoctor.fees} per consultation</p>
                  </div>
                </div>
              </div>

              <Separator className="bg-emerald-900/20" />

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-emerald-400" />
                  <h3 className="text-white font-medium">
                    Service Description
                  </h3>
                </div>
                <p className="text-muted-foreground whitespace-pre-line">
                  {selectedDoctor.about}
                </p>
              </div>
            </div>

            {loading && <BarLoader width="100%" />}

            <DialogFooter className="flex justify-between">
              <Button
                variant="destructive"
                onClick={() =>
                  handleUpdateStatus(selectedDoctor._id, "REJECTED")
                }
                disabled={loading}
              >
                <X className="mr-2 h-4 w-4" />
                Reject
              </Button>

              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() =>
                  handleUpdateStatus(selectedDoctor._id, "VERIFIED")
                }
                disabled={loading}
              >
                <Check className="mr-2 h-4 w-4" />
                Approve
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
