import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"


const categories = [
  {
    id: 1,
    name: "Prescription Drugs",
    icon: "pill",
    description: "Medications that require a prescription",
    slug: "prescription",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Over-the-Counter",
    icon: "medicine",
    description: "Medications available without a prescription",
    slug: "otc",
    image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Vitamins & Supplements",
    icon: "vitamin",
    description: "Nutritional supplements and vitamins",
    slug: "vitamins",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Medical Devices",
    icon: "stethoscope",
    description: "Healthcare equipment and devices",
    slug: "devices",
    image: "https://images.unsplash.com/photo-1581595219315-a187dd40c322?q=80&w=800&auto=format&fit=crop",
  },
]

export function Categories() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((category) => (
        <Link key={category.id} href={`/categories/${category.slug}`} className="group">
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
            <div className="relative h-40 w-full overflow-hidden">
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="text-lg font-bold text-white">{category.name}</h3>
              </div>
            </div>
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 rounded-full bg-pharmacy-primary/10 p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-pharmacy-primary"
                >
                  {category.icon === "pill" && (
                    <>
                      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
                      <path d="m8.5 8.5 7 7" />
                    </>
                  )}
                  {category.icon === "medicine" && (
                    <>
                      <path d="m19 20-9-9" />
                      <path d="M5 4h4" />
                      <path d="M7 6V2" />
                      <path d="M5 10h4" />
                      <path d="M9 12a9.37 9.37 0 0 1-1 4" />
                      <path d="M4 19a2 2 0 0 1-2-2v-1a3 3 0 0 1 3-3h1" />
                      <path d="M14 21v-4a3 3 0 0 1 3-3h1a3 3 0 0 1 3 3v1a2 2 0 0 1-2 2" />
                      <path d="M12 11a2 2 0 0 1 2-2h1a3 3 0 0 1 3 3v1" />
                    </>
                  )}
                  {category.icon === "vitamin" && (
                    <>
                      <circle cx="12" cy="12" r="7" />
                      <circle cx="12" cy="12" r="3" />
                      <line x1="12" x2="12" y1="5" y2="3" />
                      <line x1="12" x2="12" y1="21" y2="19" />
                      <line x1="5" x2="3" y1="12" y2="12" />
                      <line x1="21" x2="19" y1="12" y2="12" />
                    </>
                  )}
                  {category.icon === "stethoscope" && (
                    <>
                      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
                      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
                      <circle cx="20" cy="10" r="2" />
                    </>
                  )}
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">{category.description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
