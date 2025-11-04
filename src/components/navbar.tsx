import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b bg-white/80 backdrop-blur dark:bg-zinc-900/60">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-sm font-semibold">
          ShopEase
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/">Home</Link>
          <Link href="/signin">Sign in</Link>
          <Link
            href="/signup"
            className="rounded-md bg-black px-3 py-1.5 text-white dark:bg-zinc-800"
          >
            Sign up
          </Link>
        </div>
      </nav>
    </header>
  );
}