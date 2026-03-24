import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-dark-800 border-t border-dark-600 py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-light-300">
            <span className="text-primary font-semibold">Tokyo</span> Table Finder
          </div>
          <nav className="flex gap-6 text-sm text-light-300">
            <Link href="/search" className="hover:text-light-100 transition-colors">Search</Link>
            <Link href="/pricing" className="hover:text-light-100 transition-colors">Pricing</Link>
            <Link href="/login" className="hover:text-light-100 transition-colors">Login</Link>
          </nav>
          <p className="text-xs text-light-300">&copy; 2026 Tokyo Table Finder</p>
        </div>
      </div>
    </footer>
  );
}
