"use client";

import { Stethoscope, Video, Calendar, ShieldCheck } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function Features() {
  const features = [
    {
      title: "Book Appointments Instantly",
      description:
        "Find doctors by specialty and book appointments in seconds — no waiting, no hassle.",
      Icon: Calendar,
    },
    {
      title: "Secure Video Consultations",
      description:
        "Talk to your doctor from anywhere using encrypted, high-quality video calls.",
      Icon: Video,
    },
    {
      title: "Verified & Trusted Doctors",
      description:
        "Every professional on BookMyDoc is verified for credentials and experience.",
      Icon: Stethoscope,
    },
    {
      title: "Data Privacy & Protection",
      description:
        "We use end-to-end encryption and HIPAA-compliant storage to protect your health data.",
      Icon: ShieldCheck,
    },
  ];

  return (
    <section className="py-20 text-gray-100">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 space-y-5">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
              Powerful Features for Better Healthcare
            </span>
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            BookMyDoc helps you connect with trusted doctors, book appointments
            instantly, and access secure video consultations — all in one
            seamless and modern platform.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ title, description, Icon }, index) => (
            <Card
              key={index}
              className="border border-gray-800 hover:border-emerald-700/40 transition-colors shadow-md text-center"
            >
              <CardHeader className="flex flex-col items-center justify-center space-y-3">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-emerald-900/30">
                  <Icon className="h-6 w-6 text-emerald-400" />
                </div>

                <CardTitle className="text-lg font-semibold text-gray-100">
                  {title}
                </CardTitle>

                <CardDescription className="text-gray-400 text-sm leading-relaxed">
                  {description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
