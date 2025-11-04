import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Tools from "./components/Tools";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900">
      <Navbar />
      <main>
        <Hero />
        <Tools />
        <section id="learn" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16">
          <div className="rounded-2xl bg-gradient-to-r from-emerald-500/10 to-purple-500/10 border border-emerald-200/40 p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-2">New to Solana?</h2>
            <p className="text-gray-700 mb-4">
              Solana is a high-performance blockchain known for low fees and fast confirmations. Start by learning
              about accounts, transactions, and programs.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://solana.com/developers"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-gray-900 text-white px-4 py-2 text-sm shadow-sm hover:bg-gray-800"
              >
                Developer Portal
              </a>
              <a
                href="https://solana.com/docs"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-white text-gray-900 px-4 py-2 text-sm shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-50"
              >
                Documentation
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default App;
