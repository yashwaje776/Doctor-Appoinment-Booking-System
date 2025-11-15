import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Video, FileCheck2 } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Book Your Appointment",
    description:
      "Choose a doctor, select a convenient time, and confirm your booking — all in just a few clicks.",
    icon: <Calendar className="w-10 h-10 text-white" />,
  },
  {
    step: "02",
    title: "Join a Video Consultation",
    description:
      "Meet your doctor online from anywhere with our secure, high-quality video call system.",
    icon: <Video className="w-10 h-10 text-white" />,
  },
  {
    step: "03",
    title: "Get Prescription & Follow-Up",
    description:
      "Receive digital prescriptions instantly and easily schedule follow-ups for ongoing care.",
    icon: <FileCheck2 className="w-10 h-10 text-white" />,
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 ">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
            How It Works
          </span>
        </h2>

        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-16">
          Book appointments in minutes, consult securely online, and get care
          that fits your schedule — it’s that simple.
        </p>

        <div className="grid md:grid-cols-3 gap-10 mt-10">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="relative overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
            >
              <CardHeader className="flex flex-col items-center">
                <Badge
                  variant="secondary"
                  className="mb-3 px-3 py-1 text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                >
                  Step {step.step}
                </Badge>

                <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 shadow-md mb-4">
                  {step.icon}
                </div>

                <CardTitle className="text-2xl font-semibold">
                  {step.title}
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400 mt-2">
                  {step.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Separator className="my-4 bg-gray-200 dark:bg-gray-700" />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Simple, secure, and designed for better healthcare access.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
