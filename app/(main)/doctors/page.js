import React from "react";
import { Card } from "@/components/ui/card";
import { SPECIALTIES } from "@/lib/specialityData";
import Link from "next/link";

export default function Page() {
  return (
    <div>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-semibold text-white">
          Find by Speciality
        </h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
          Browse our extensive list of trusted doctors and easily schedule your
          appointment hassle-free.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {SPECIALTIES.map((spec) => (
          <Link
            href={`/doctors/${encodeURIComponent(spec.name)}`}
            key={spec.name}
            className="
              p-8
              border-emerald-900/20 
              bg-muted/20
              hover:border-emerald-700/50 
              hover:bg-muted/10
              transition-all 
              cursor-pointer 
              rounded-xl
            "
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-emerald-900/20 rounded-full mb-4">
                {spec.icon}
              </div>

              <h3 className="text-lg font-semibold text-white">{spec.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
