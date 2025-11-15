"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Stethoscope } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { setUserRole } from "@/actions/onbording";
import { SPECIALTIES } from "@/lib/specialityData";

export default function OnboardingPage() {
  const [step, setStep] = useState("choose-role");

  if (step === "choose-role") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
        <form action={setUserRole}>
          <input type="hidden" name="role" value="PATIENT" />

          <Card
            className="border-emerald-900/20 hover:border-emerald-700/40 cursor-pointer transition-all"
            onClick={(e) => e.currentTarget.closest("form").requestSubmit()}
          >
            <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
              <div className="p-4 bg-emerald-900/20 rounded-full mb-4">
                <User className="h-8 w-8 text-emerald-400" />
              </div>
              <CardTitle className="text-xl font-semibold text-white mb-2">
                Join as a Patient
              </CardTitle>
              <CardDescription className="mb-4">
                Book appointments, consult with doctors, and manage your care
              </CardDescription>
              <Button className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700">
                Continue as Patient
              </Button>
            </CardContent>
          </Card>
        </form>

        <Card
          className="border-emerald-900/20 hover:border-emerald-700/40 cursor-pointer transition-all"
          onClick={() => setStep("doctor-form")}
        >
          <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
            <div className="p-4 bg-emerald-900/20 rounded-full mb-4">
              <Stethoscope className="h-8 w-8 text-emerald-400" />
            </div>
            <CardTitle className="text-xl font-semibold text-white mb-2">
              Join as a Doctor
            </CardTitle>
            <CardDescription className="mb-4">
              Create your professional doctor profile and start consulting
              patients{" "}
            </CardDescription>
            <Button className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700">
              Continue as Doctor
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "doctor-form") {
    return (
      <Card className="border-emerald-900/20 shadow-lg">
        <CardContent className="pt-8 pb-10 px-6 space-y-6">
          <div className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold text-white">
              Doctor Profile Setup
            </CardTitle>
            <CardDescription className="text-base">
              Enter your professional information for verification
            </CardDescription>
          </div>

          <form action={setUserRole} className="space-y-8">
            <input type="hidden" name="role" value="DOCTOR" />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-emerald-400">
                Professional Details
              </h3>

              <div className="space-y-2">
                <Label className="font-medium">Medical Specialty</Label>
                <Select name="speciality" className="w-full">
                  <SelectTrigger className="w-full bg-[#11261f] border-emerald-900/40">
                    <SelectValue placeholder="Select your speciality" />
                  </SelectTrigger>

                  <SelectContent className="w-full">
                    {SPECIALTIES.map((spec) => (
                      <SelectItem key={spec.name} value={spec.name}>
                        <span className="mr-2">{spec.icon}</span> {spec.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-medium">Years of Experience</Label>
                <Input
                  className="bg-[#11261f] border-emerald-900/40"
                  name="experience"
                  type="number"
                  placeholder="Example: 5"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-medium">
                  Degree / Medical Certificate URL
                </Label>
                <Input
                  className="bg-[#11261f] border-emerald-900/40"
                  name="degree"
                  type="url"
                  placeholder="https://example.com/my-degree.pdf"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-medium">Consultation Fees (₹)</Label>
                <Input
                  className="bg-[#11261f] border-emerald-900/40"
                  name="fees"
                  type="number"
                  placeholder="Example: 50"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-medium">About</Label>
                <Textarea
                  className="bg-[#11261f] border-emerald-900/40 min-h-[120px]"
                  name="about"
                  rows={4}
                  placeholder="Describe your expertise, services, and how you help patients..."
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <Button
                type="button"
                variant="outline"
                className="border-emerald-900/40 text-white hover:bg-emerald-900/20"
                onClick={() => setStep("choose-role")}
              >
                Back
              </Button>

              <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-md">
                Submit for Verification
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }
}
