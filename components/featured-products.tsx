"use client"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/contexts/cart-context"
import Image from "next/image"

// Mock data for featured products with Unsplash images
const featuredProducts = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    description: "Pain reliever and fever reducer",
    price: 5.99,
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=800&auto=format&fit=crop",
    category: "Over-the-Counter",
    prescription: false,
  },
  {
    id: "2",
    name: "Vitamin C 1000mg",
    description: "Immune system support",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=800&auto=format&fit=crop",
    category: "Vitamins & Supplements",
    prescription: false,
  },
  {
    id: "3",
    name: "Amoxicillin 500mg",
    description: "Antibiotic for bacterial infections",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=800&auto=format&fit=crop",
    category: "Prescription",
    prescription: true,
  },
  {
    id: "4",
    name: "Digital Thermometer",
    description: "Accurate temperature readings",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=800&auto=format&fit=crop",
    category: "Medical Devices",
    prescription: false,
  },
]

export function FeaturedProducts() {
  const { toast } = useToast()
  const { addItem } = useCart()

  const handleAddToCart = (product: any) => {
    if (product.prescription) {
      toast({
        title: "Prescription Required",
        description: "Please upload a valid prescription to purchase this item.",
      })
      return
    }

    addItem({
      id: "",
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {featuredProducts.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <CardHeader className="p-0">
            <div className="relative">
              <div className="h-48 w-full relative">
                <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
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
              onClick={() => handleAddToCart(product)}
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
  )
}
