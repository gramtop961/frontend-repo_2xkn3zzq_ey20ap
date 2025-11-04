export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(16,185,129,0.15),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(147,51,234,0.15),transparent_40%)] pointer-events-none" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Solana Protocol Tools
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-gray-600">
            A fast, elegant toolkit for working with the Solana ecosystem—validate addresses, convert
            units, and transform data with zero setup, right in your browser.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href="#tools" className="inline-flex items-center justify-center rounded-md bg-emerald-600 text-white px-5 py-3 font-medium shadow-sm hover:bg-emerald-700">
              Open Tools
            </a>
            <a href="#learn" className="inline-flex items-center justify-center rounded-md bg-white text-gray-900 px-5 py-3 font-medium shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-50">
              Learn Basics
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
