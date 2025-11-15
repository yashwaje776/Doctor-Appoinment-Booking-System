import React from 'react'
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-30">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <Badge
                    variant="outline"
                    className="rounded-none bg-emerald-900/30 border-emerald-700/30 px-4 py-2 text-emerald-400 text-sm font-medium"
                  >
                    Your Health. Our Priority.
                  </Badge>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                    Quality healthcare <br />
                    <span className="gradient-title">just a click away</span>
                  </h1>
                  <p className="text-muted-foreground text-lg md:text-xl max-w-md">
                    Schedule appointments, consult specialists online, and access
                    your health records — all from the comfort of your home.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      asChild
                      size="lg"
                      className="bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      <Link href="/onboarding">
                        Book Now <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="border-emerald-700/30 hover:bg-muted/80"
                    >
                      <Link href="/doctors">Browse Doctors</Link>
                    </Button>
                  </div>
                </div>
    
                <div className="relative h-[400px] lg:h-[600px] rounded-xl overflow-hidden">
                  <Image
                    src="/header_img.png"
                    alt="Doctor consultation"
                    fill
                    priority
                    className="object-cover md:pt-12 rounded-xl"
                  />
                </div>
              </div>
            </div>
          </section>
  )
}

export default HeroSection
