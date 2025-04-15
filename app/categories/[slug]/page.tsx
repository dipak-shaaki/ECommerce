import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ShoppingCart, Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock data for category products
const categoryProducts = {
  prescription: {
    name: "Prescription Drugs",
    description: "Medications that require a prescription from a licensed healthcare provider",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop",
    products: [
      {
        id: 1,
        name: "Amoxicillin 500mg",
        description: "Antibiotic for bacterial infections",
        price: 15.99,
        image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=800&auto=format&fit=crop",
        prescription: true,
      },
      {
        id: 2,
        name: "Lisinopril 10mg",
        description: "Treatment for high blood pressure",
        price: 12.99,
        image: "https://images.unsplash.com/photo-1550572017-edd951b55104?q=80&w=800&auto=format&fit=crop",
        prescription: true,
      },
      {
        id: 3,
        name: "Metformin 500mg",
        description: "Medication for type 2 diabetes",
        price: 9.99,
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop",
        prescription: true,
      },
    ],
  },
  otc: {
    name: "Over-the-Counter",
    description: "Medications available without a prescription for common health concerns",
    image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?q=80&w=800&auto=format&fit=crop",
    products: [
      {
        id: 4,
        name: "Paracetamol 500mg",
        description: "Pain reliever and fever reducer",
        price: 5.99,
        image: "https://images.unsplash.com/photo-1550572017-37b34bd4b88e?q=80&w=800&auto=format&fit=crop",
        prescription: false,
      },
      {
        id: 5,
        name: "Ibuprofen 200mg",
        description: "Anti-inflammatory pain reliever",
        price: 6.99,
        image: "https://images.unsplash.com/photo-1550572017-d7b84bd0591f?q=80&w=800&auto=format&fit=crop",
        prescription: false,
      },
      {
        id: 6,
        name: "Loratadine 10mg",
        description: "Non-drowsy allergy relief",
        price: 8.49,
        image: "https://images.unsplash.com/photo-1550572017-47a0a7e837b8?q=80&w=800&auto=format&fit=crop",
        prescription: false,
      },
    ],
  },
  vitamins: {
    name: "Vitamins & Supplements",
    description: "Nutritional supplements and vitamins to support your health and wellness",
    image: "https://images.unsplash.com/photo-1577174881658-0f30ed549adc?q=80&w=800&auto=format&fit=crop",
    products: [
      {
        id: 7,
        name: "Vitamin C 1000mg",
        description: "Immune system support",
        price: 12.99,
        image: "https://images.unsplash.com/photo-1577174881658-0f30ed549adc?q=80&w=800&auto=format&fit=crop",
        prescription: false,
      },
      {
        id: 8,
        name: "Multivitamin Daily",
        description: "Complete daily nutritional support",
        price: 14.99,
        image: "https://images.unsplash.com/photo-1579165466741-7f35e4755182?q=80&w=800&auto=format&fit=crop",
        prescription: false,
      },
      {
        id: 9,
        name: "Omega-3 Fish Oil",
        description: "Heart and brain health support",
        price: 16.99,
        image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=800&auto=format&fit=crop",
        prescription: false,
      },
    ],
  },
  devices: {
    name: "Medical Devices",
    description: "Healthcare equipment and devices for home monitoring and care",
    image: "https://images.unsplash.com/photo-1581595219315-a187dd40c322?q=80&w=800&auto=format&fit=crop",
    products: [
      {
        id: 10,
        name: "Digital Thermometer",
        description: "Accurate temperature readings",
        price: 8.99,
        image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=800&auto=format&fit=crop",
        prescription: false,
      },
      {
        id: 11,
        name: "Blood Pressure Monitor",
        description: "Digital blood pressure monitoring device",
        price: 45.99,
        image: "https://images.unsplash.com/photo-1581595219315-a187dd40c322?q=80&w=800&auto=format&fit=crop",
        prescription: false,
      },
      {
        id: 12,
        name: "Pulse Oximeter",
        description: "Measures blood oxygen levels",
        price: 29.99,
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop",
        prescription: false,
      },
    ],
  },
  "personal-care": {
    name: "Personal Care",
    description: "Products for personal hygiene and skincare needs",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=800&auto=format&fit=crop",
    products: [
      {
        id: 13,
        name: "Moisturizing Lotion",
        description: "Daily hydration for all skin types",
        price: 7.99,
        image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=800&auto=format&fit=crop",
        prescription: false,
      },
      {
        id: 14,
        name: "Gentle Face Cleanser",
        description: "For sensitive skin",
        price: 9.99,
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop",
        prescription: false,
      },
      {
        id: 15,
        name: "Dental Care Kit",
        description: "Complete oral hygiene set",
        price: 12.99,
        image: "https://images.unsplash.com/photo-1559589311-5f3ebe9f5e46?q=80&w=800&auto=format&fit=crop",
        prescription: false,
      },
    ],
  },
  "first-aid": {
    name: "First Aid",
    description: "Essential supplies for treating minor injuries and emergencies",
    image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?q=80&w=800&auto=format&fit=crop",
    products: [
      {
        id: 16,
        name: "First Aid Kit",
        description: "Complete emergency kit for home",
        price: 24.99,
        image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?q=80&w=800&auto=format&fit=crop",
        prescription: false,
      },
      {
        id: 17,
        name: "Adhesive Bandages",
        description: "Assorted sizes for minor cuts",
        price: 4.99,
        image: "https://images.unsplash.com/photo-1583947581924-860bda6a26df?q=80&w=800&auto=format&fit=crop",
        prescription: false,
      },
      {
        id: 18,
        name: "Antiseptic Wipes",
        description: "For cleaning wounds",
        price: 3.99,
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop",
        prescription: false,
      },
    ],
  },
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const category = categoryProducts[slug as keyof typeof categoryProducts]

  if (!category) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold">Category not found</h1>
        <p className="mt-4">The category you are looking for does not exist.</p>
        <Link href="/categories">
          <Button className="mt-6">Back to Categories</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div className="relative mb-6 h-64 w-full overflow-hidden rounded-lg">
          <Image src={category.image || "/placeholder.svg"} alt={category.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6">
            <h1 className="text-3xl font-bold text-white">{category.name}</h1>
            <p className="text-white/80">{category.description}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[240px_1fr]">
          {/* Filters */}
          <div className="space-y-6">
            <div>
              <h3 className="mb-4 text-lg font-medium text-pharmacy-dark">Search</h3>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full bg-background pl-8 border-pharmacy-primary/20 focus-visible:ring-pharmacy-primary"
                />
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-medium text-pharmacy-dark">Price Range</h3>
              <Slider defaultValue={[50]} max={100} step={1} className="py-4" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">$0</span>
                <span className="text-sm text-muted-foreground">$100</span>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-medium text-pharmacy-dark">Prescription</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="prescription-required" />
                  <Label
                    htmlFor="prescription-required"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Prescription Required
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="no-prescription" />
                  <Label
                    htmlFor="no-prescription"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    No Prescription Needed
                  </Label>
                </div>
              </div>
            </div>

            <Button className="w-full bg-pharmacy-primary hover:bg-pharmacy-dark">Apply Filters</Button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {category.products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <CardHeader className="p-0">
                  <div className="relative">
                    <div className="h-48 w-full relative">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {product.prescription && (
                      <Badge className="absolute right-2 top-2 bg-pharmacy-secondary">Prescription Required</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-pharmacy-dark">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                    <p className="font-medium text-pharmacy-primary">${product.price.toFixed(2)}</p>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-pharmacy-primary text-pharmacy-primary hover:bg-pharmacy-light hover:text-pharmacy-dark"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                  <Link href={`/products/${product.id}`} className="w-full">
                    <Button variant="ghost" size="sm" className="w-full hover:text-pharmacy-primary">
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
