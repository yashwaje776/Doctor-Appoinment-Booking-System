"use client";

import { Stethoscope, Video, Calendar, ShieldCheck } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function Features() {
  const features = [
    {
      title: "Book Appointments Instantly",
      description:
        "Find doctors by specialty and book appointments in seconds — no waiting, no hassle.",
      icon: <Calendar className="h-6 w-6 text-emerald-400" />,
    },
    {
      title: "Secure Video Consultations",
      description:
        "Talk to your doctor from anywhere using encrypted, high-quality video calls.",
      icon: <Video className="h-6 w-6 text-emerald-400" />,
    },
    {
      title: "Verified & Trusted Doctors",
      description:
        "Every professional on BookMyDoc is verified for credentials and experience.",
      icon: <Stethoscope className="h-6 w-6 text-emerald-400" />,
    },
    {
      title: "Data Privacy & Protection",
      description:
        "We use end-to-end encryption and HIPAA-compliant storage to protect your health data.",
      icon: <ShieldCheck className="h-6 w-6 text-emerald-400" />,
    },
  ];

  return (
    <section className="py-20 text-gray-100 ">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-5">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
              Powerful Features for Better Healthcare
            </span>
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-16">
            BookMyDoc helps you connect with trusted doctors, book appointments
            instantly, and access secure video consultations — all in one
            seamless and modern platform.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border border-gray-800 hover:border-emerald-700/40 transition-colors shadow-mdtext-center"
            >
              <CardHeader className="flex flex-col items-center justify-center text-center space-y-3">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-emerald-900/30">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg font-semibold text-gray-100">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
