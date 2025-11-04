import { Rocket, Settings } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b border-black/5">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-purple-600 grid place-items-center">
            <Rocket className="h-5 w-5 text-white" />
          </div>
          <span className="font-semibold tracking-tight text-gray-900">Solana Tools</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <a href="#tools" className="hover:text-gray-900">Tools</a>
          <a href="#learn" className="hover:text-gray-900">Learn</a>
          <a href="#about" className="hover:text-gray-900">About</a>
        </nav>
        <button className="inline-flex items-center gap-2 rounded-md bg-gray-900 text-white px-3 py-2 text-sm shadow-sm hover:bg-gray-800">
          <Settings className="h-4 w-4" />
          Settings
        </button>
      </div>
    </header>
  );
}
