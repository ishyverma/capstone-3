"use client";

import Link from "next/link";
import { useAuth } from "./auth-provider";
import { ShoppingCart, User, LogOut, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur dark:bg-zinc-900/60">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          ShopEase
        </Link>
        
        <div className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="/products" className="transition-colors hover:text-primary">
            Products
          </Link>
          {user ? (
            <>
              {user.role === "ADMIN" && (
                <Link href="/admin" className="transition-colors hover:text-primary">
                  Admin
                </Link>
              )}
              <Link href="/cart" className="flex items-center gap-2 transition-colors hover:text-primary">
                <ShoppingCart className="h-5 w-5" />
                <span>Cart</span>
              </Link>
              <Link href="/profile" className="flex items-center gap-2 transition-colors hover:text-primary">
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout} className="gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/signin">Sign in</Link>
              <Link
                href="/signup"
                className="rounded-md bg-black px-4 py-2 text-white transition-colors hover:bg-black/80 dark:bg-zinc-800 dark:hover:bg-zinc-700"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t bg-white dark:bg-zinc-900 md:hidden">
          <div className="flex flex-col gap-4 px-4 py-4">
            <Link 
              href="/products" 
              className="transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Products
            </Link>
            {user ? (
              <>
                {user.role === "ADMIN" && (
                  <Link 
                    href="/admin" 
                    className="transition-colors hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <Link 
                  href="/cart" 
                  className="flex items-center gap-2 transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Cart</span>
                </Link>
                <Link 
                  href="/profile" 
                  className="flex items-center gap-2 transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }} 
                  className="w-full justify-start gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link 
                  href="/signin"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="rounded-md bg-black px-4 py-2 text-center text-white transition-colors hover:bg-black/80 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}