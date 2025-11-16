import { User, Star, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function DoctorCard({ doctor }) {
  return (
    <Card className="border border-emerald-900/20 bg-neutral-900 hover:border-emerald-700/40 shadow-md hover:shadow-emerald-700/20 transition-all rounded-xl">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">

          <div className="w-14 h-14 rounded-full overflow-hidden bg-emerald-900/20 flex items-center justify-center flex-shrink-0 shadow-inner">
            {doctor.user.imageUrl ? (
              <img
                src={doctor.user.imageUrl}
                alt={doctor.user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-6 w-6 text-emerald-400" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
              <h3 className="font-semibold text-white text-lg">
                {doctor.user.name}
              </h3>

              <Badge
                variant="outline"
                className="bg-emerald-900/30 border-emerald-700/50 text-emerald-400 flex items-center gap-1"
              >
                <Star className="h-3 w-3" />
                Verified
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge className="bg-emerald-700/20 text-emerald-300 border border-emerald-700/40">
                {doctor.speciality}
              </Badge>

              <p className="text-sm text-neutral-400">
                {doctor.experience}+ years experience
              </p>
            </div>

            <p className="text-sm text-white font-semibold mb-2">
              ₹ {doctor.fees} / Consultation
            </p>

            <p className="line-clamp-2 text-sm text-neutral-400 mb-4">
              {doctor.about}
            </p>

            <Button
              asChild
              className="w-full bg-emerald-600 hover:bg-emerald-700 transition-all rounded-lg"
            >
              <Link href={`/doctors/${doctor.speciality}/${doctor._id}`}>
                <Calendar className="h-4 w-4 mr-2" />
                View Profile & Book
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
