import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t bg-white">
      <div className="container py-10">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-medium text-pharmacy-dark">MediMart</h3>
            <p className="text-sm text-muted-foreground">Your trusted online pharmacy for all your healthcare needs.</p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-medium text-pharmacy-dark">Quick Links</h3>
            <ul className="grid gap-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-pharmacy-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-pharmacy-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-pharmacy-primary">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-medium text-pharmacy-dark">Categories</h3>
            <ul className="grid gap-2 text-sm">
              <li>
                <Link href="/categories/prescription" className="text-muted-foreground hover:text-pharmacy-primary">
                  Prescription Drugs
                </Link>
              </li>
              <li>
                <Link href="/categories/otc" className="text-muted-foreground hover:text-pharmacy-primary">
                  Over-the-Counter
                </Link>
              </li>
              <li>
                <Link href="/categories/wellness" className="text-muted-foreground hover:text-pharmacy-primary">
                  Wellness Products
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-medium text-pharmacy-dark">Contact</h3>
            <ul className="grid gap-2 text-sm">
              <li className="text-muted-foreground">Email: medimart@gmail.com</li>
              <li className="text-muted-foreground">Phone: +91 420-245</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t pt-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} MediMart. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
