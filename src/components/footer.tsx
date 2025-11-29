import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-white dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold">ShopEase</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Your one-stop shop for everything.
            </p>
          </div>
          <div>
            <h4 className="font-medium">Shop</h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="/products">All Products</Link></li>
              <li><Link href="/products?category=electronics">Electronics</Link></li>
              <li><Link href="/products?category=clothing">Clothing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium">Support</h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/shipping">Shipping</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium">Legal</h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} ShopEase. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
