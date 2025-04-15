import { FeaturedProducts } from "@/components/featured-products"
import { Categories } from "@/components/categories"
import { HeroSection } from "@/components/hero-section"

export default function Home() {
  return (
    <>
      <HeroSection />
      <section className="container py-10">
        <h2 className="mb-6 text-2xl font-bold text-pharmacy-dark">Featured Categories</h2>
        <Categories />
      </section>
      <section className="container py-10">
        <h2 className="mb-6 text-2xl font-bold text-pharmacy-dark">Featured Products</h2>
        <FeaturedProducts />
      </section>
      <section className="bg-pharmacy-light py-12">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
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
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <line x1="2" x2="22" y1="10" y2="10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-pharmacy-dark">Secure Payment</h3>
              <p className="text-muted-foreground">Multiple secure payment options for your convenience</p>
            </div>
            <div className="flex flex-col items-center text-center">
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
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-pharmacy-dark">Fast Delivery</h3>
              <p className="text-muted-foreground">Get your medications delivered quickly to your doorstep</p>
            </div>
            <div className="flex flex-col items-center text-center">
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
                  <path d="M21.73 18l-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <path d="M12 9v4" />
                  <path d="M12 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-pharmacy-dark">Verified Products</h3>
              <p className="text-muted-foreground">All medications are verified by licensed pharmacists</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
