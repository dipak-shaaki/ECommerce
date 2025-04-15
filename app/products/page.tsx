"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Search, ShoppingCart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/contexts/cart-context"

// Mock data for products with Unsplash images
const allProducts = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    description: "Pain reliever and fever reducer",
    price: 5.99,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop",
    category: "Over-the-Counter",
    prescription: false,
  },
  {
    id: 2,
    name: "Vitamin C 1000mg",
    description: "Immune system support",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=800&auto=format&fit=cro",
    category: "Vitamins & Supplements",
    prescription: false,
  },
  {
    id: 3,
    name: "Amoxicillin 500mg",
    description: "Antibiotic for bacterial infections",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=800&auto=format&fit=crop",
    category: "Prescription",
    prescription: true,
  },
  {
    id: 4,
    name: "Digital Thermometer",
    description: "Accurate temperature readings",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=800&auto=format&fit=crop",
    category: "Medical Devices",
    prescription: false,
  },
  {
    id: 5,
    name: "Ibuprofen 200mg",
    description: "Anti-inflammatory pain reliever",
    price: 6.99,
    image: "https://images.unsplash.com/photo-1550572017-edd951b55104?q=80&w=800&auto=format&fit=crop",
    category: "Over-the-Counter",
    prescription: false,
  },
  {
    id: 6,
    name: "Multivitamin Daily",
    description: "Complete daily nutritional support",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1581595219315-a187dd40c322?q=80&w=800&auto=format&fit=crop",
    category: "Vitamins & Supplements",
    prescription: false,
  },
  {
    id: 7,
    name: "Blood Pressure Monitor",
    description: "Digital blood pressure monitoring device",
    price: 45.99,
    image: "https://images.unsplash.com/photo-1581595219315-a187dd40c322?q=80&w=800&auto=format&fit=crop",
    category: "Medical Devices",
    prescription: false,
  },
  {
    id: 8,
    name: "Lisinopril 10mg",
    description: "Treatment for high blood pressure",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1550572017-edd951b55104?q=80&w=800&auto=format&fit=crop",
    category: "Prescription",
    prescription: true,
  },
]

// Categories for filtering
const categories = ["All Categories", "Prescription", "Over-the-Counter", "Vitamins & Supplements", "Medical Devices"]

export default function ProductsPage() {
  const { toast } = useToast()
  const { addItem } = useCart()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["All Categories"])
  const [priceRange, setPriceRange] = useState<number[]>([0])
  const [prescriptionFilter, setPrescriptionFilter] = useState<string | null>(null)
  const [products, setProducts] = useState(allProducts)
  const [maxPrice, setMaxPrice] = useState(50)

  // Find the maximum price for the slider
  useEffect(() => {
    const highestPrice = Math.ceil(Math.max(...allProducts.map((product) => product.price)))
    setMaxPrice(highestPrice)
    setPriceRange([highestPrice])
  }, [])

  // Apply search filter immediately when typing
  useEffect(() => {
    let filteredProducts = [...allProducts]

    // Apply search filter
    if (searchQuery) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply category filter
    if (!selectedCategories.includes("All Categories")) {
      filteredProducts = filteredProducts.filter((product) => selectedCategories.includes(product.category))
    }

    // Apply price filter
    filteredProducts = filteredProducts.filter((product) => product.price <= priceRange[0])

    // Apply prescription filter
    if (prescriptionFilter === "required") {
      filteredProducts = filteredProducts.filter((product) => product.prescription)
    } else if (prescriptionFilter === "not-required") {
      filteredProducts = filteredProducts.filter((product) => !product.prescription)
    }

    setProducts(filteredProducts)
  }, [searchQuery, selectedCategories, priceRange, prescriptionFilter])

  const handleCategoryChange = (category: string) => {
    if (category === "All Categories") {
      setSelectedCategories(["All Categories"])
    } else {
      const newSelectedCategories = selectedCategories.includes("All Categories")
        ? [category]
        : selectedCategories.includes(category)
          ? selectedCategories.filter((c) => c !== category)
          : [...selectedCategories, category]

      setSelectedCategories(newSelectedCategories.length === 0 ? ["All Categories"] : newSelectedCategories)
    }
  }

  const handlePrescriptionFilterChange = (value: string) => {
    setPrescriptionFilter(prescriptionFilter === value ? null : value)
  }

  const addToCart = (product: any) => {
    if (product.prescription) {
      toast({
        title: "Prescription Required",
        description: "Please upload a valid prescription to purchase this item.",
      })
      return
    }

    addItem({
      id: "",
      productId: product.id.toString(),
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
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-pharmacy-dark">All Products</h1>
          <p className="text-muted-foreground">Browse our wide range of medications and healthcare products</p>
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-medium text-pharmacy-dark">Categories</h3>
              <div className="space-y-3">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => handleCategoryChange(category)}
                    />
                    <label
                      htmlFor={`category-${category}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-medium text-pharmacy-dark">Price Range</h3>
              <Slider
                defaultValue={[maxPrice]}
                max={maxPrice}
                step={1}
                value={priceRange}
                onValueChange={setPriceRange}
                className="py-4"
              />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">$0</span>
                <span className="text-sm text-muted-foreground">${priceRange[0]}</span>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-medium text-pharmacy-dark">Prescription</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="prescription-required"
                    checked={prescriptionFilter === "required"}
                    onCheckedChange={() => handlePrescriptionFilterChange("required")}
                  />
                  <label
                    htmlFor="prescription-required"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Prescription Required
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="no-prescription"
                    checked={prescriptionFilter === "not-required"}
                    onCheckedChange={() => handlePrescriptionFilterChange("not-required")}
                  />
                  <label
                    htmlFor="no-prescription"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    No Prescription Needed
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.length > 0 ? (
              products.map((product) => (
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
                      onClick={() => addToCart(product)}
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
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                <h3 className="mb-2 text-lg font-medium">No products found</h3>
                <p className="mb-6 text-muted-foreground">Try adjusting your filters or search query</p>
                <Button
                  variant="outline"
                  className="border-pharmacy-primary/20 text-pharmacy-primary"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategories(["All Categories"])
                    setPriceRange([maxPrice])
                    setPrescriptionFilter(null)
                    setProducts(allProducts)
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
