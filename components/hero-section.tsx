import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-pharmacy-light to-white">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-pharmacy-dark">
                Your Health, Delivered
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Get your medications delivered to your doorstep. Fast, reliable, and secure.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/products">
                <Button size="lg" className="w-full bg-pharmacy-primary hover:bg-pharmacy-dark">
                  Shop Now
                </Button>
              </Link>
              <Link href="/prescriptions">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-pharmacy-primary text-pharmacy-primary hover:bg-pharmacy-light"
                >
                  Upload Prescription
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[400px] w-full overflow-hidden rounded-xl">
              <Image
                src="https://images.unsplash.com/photo-1581595219315-a187dd40c322?q=80&w=800&auto=format&fit=crop"
                alt="Pharmacy hero image"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

