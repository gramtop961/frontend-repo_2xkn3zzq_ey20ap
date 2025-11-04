export default function Footer() {
  return (
    <footer id="about" className="border-t border-black/5 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-500">Built for the Solana ecosystem. No wallet connection required.</p>
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} Solana Tools. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
