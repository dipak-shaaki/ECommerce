import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

// Mock data for categories with Unsplash images
const categories = [
  {
    id: 1,
    name: "Prescription Drugs",
    icon: "pill",
    description: "Medications that require a prescription from a licensed healthcare provider",
    slug: "prescription",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop",
    products: 120,
  },
  {
    id: 2,
    name: "Over-the-Counter",
    icon: "medicine",
    description: "Medications available without a prescription for common health concerns",
    slug: "otc",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx52XMICzHi7tulTqOxZseuPq_pwg2hWi05Q&s",
    products: 85,
  },
  {
    id: 3,
    name: "Vitamins & Supplements",
    icon: "vitamin",
    description: "Nutritional supplements and vitamins to support your health and wellness",
    slug: "vitamins",
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=800&auto=format&fit=crop",
    products: 64,
  },
  {
    id: 4,
    name: "Medical Devices",
    icon: "stethoscope",
    description: "Healthcare equipment and devices for home monitoring and care",
    slug: "devices",
    image: "https://images.unsplash.com/photo-1581595219315-a187dd40c322?q=80&w=800&auto=format&fit=crop",
    products: 42,
  },
  {
    id: 5,
    name: "Personal Care",
    icon: "shower",
    description: "Products for personal hygiene and skincare needs",
    slug: "personal-care",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=800&auto=format&fit=crop",
    products: 78,
  },
  {
    id: 6,
    name: "First Aid",
    icon: "bandage",
    description: "Essential supplies for treating minor injuries and emergencies",
    slug: "first-aid",
    image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?q=80&w=800&auto=format&fit=crop",
    products: 36,
  },
]

export default function CategoriesPage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-pharmacy-dark">Product Categories</h1>
          <p className="text-muted-foreground">Browse our wide range of healthcare products by category</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.slug}`} className="group">
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4">
                    <h3 className="text-xl font-bold text-white">{category.name}</h3>
                    <p className="text-sm text-white/80">{category.products} products</p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="mb-4 text-sm text-muted-foreground">{category.description}</p>
                  <Button
                    variant="ghost"
                    className="w-full justify-between border border-pharmacy-primary/20 text-pharmacy-primary hover:bg-pharmacy-light"
                  >
                    Browse Products
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
