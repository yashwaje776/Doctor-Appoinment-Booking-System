import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, User } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Meera Sharma",
    role: "Dermatologist",
    feedback:
      "BookMyDoc has streamlined my appointment process. Patients can easily book online, and I can manage my schedule effortlessly.",
  },
  {
    name: "Rahul Verma",
    role: "Patient",
    feedback:
      "The video consultation feature is amazing! I booked a same-day appointment and spoke to my doctor without leaving home.",
  },
  {
    name: "Dr. Ananya Patel",
    role: "Pediatrician",
    feedback:
      "It’s so easy to manage consultations and follow-ups. BookMyDoc helps me focus more on patient care and less on admin work.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24  text-gray-100">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
            What Our Users Say
          </span>
        </h2>

        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-14">
          Hear from doctors and patients who trust{" "}
          <span className="text-emerald-400 font-semibold">BookMyDoc</span> to
          make healthcare faster, simpler, and more connected.
        </p>

        <div className="grid gap-10 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="relative hover:shadow-lg hover:shadow-emerald-700/10 transition-transform duration-300 hover:-translate-y-2 border border-gray-800 "
            >
              <CardHeader>
                <div className="absolute top-4 left-4 text-emerald-600/20">
                  <Quote className="w-8 h-8" />
                </div>

                <div className="flex flex-col items-center mt-6">
                  <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 shadow-md mb-4">
                    <User className="w-10 h-10 text-white" />
                  </div>

                  <CardTitle className="text-xl font-semibold text-gray-100">
                    {testimonial.name}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    {testimonial.role}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-gray-300 italic mb-4">
                  “{testimonial.feedback}”
                </p>

                <div className="flex justify-center mb-3">
                  <Badge
                    variant="outline"
                    className="text-sm text-emerald-400 border-emerald-700/50"
                  >
                    Verified User
                  </Badge>
                </div>

                <div className="flex justify-center space-x-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
