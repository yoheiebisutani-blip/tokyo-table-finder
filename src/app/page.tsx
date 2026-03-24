import Link from "next/link";
import PricingSection from "./pricing/PricingSection";
import FAQSection from "./pricing/FAQSection";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative py-20 md:py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-light-100 leading-tight">
            Eat Where Tokyo <span className="text-primary">Locals</span> Eat
          </h1>
          <p className="mt-6 text-lg md:text-xl text-light-300 max-w-2xl mx-auto leading-relaxed">
            Find incredible restaurants that tourists never discover. Generate booking messages in perfect Japanese. No language skills needed.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/search"
              className="inline-flex items-center justify-center bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-lg text-lg font-medium transition-colors"
            >
              Find Restaurants — It&apos;s Free
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center border border-dark-600 hover:border-light-300 text-light-100 px-8 py-3.5 rounded-lg text-lg font-medium transition-colors"
            >
              See Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-16 px-4 bg-dark-800">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              q: "Can't find the real gems?",
              a: "Google shows tourist restaurants. We show you where locals actually eat.",
            },
            {
              q: "Can't read Japanese?",
              a: "Our AI translates everything and generates booking messages you can copy and send.",
            },
            {
              q: "Can't make reservations?",
              a: "Get perfectly written Japanese reservation messages in seconds.",
            },
          ].map((item) => (
            <div key={item.q} className="text-center p-6">
              <h3 className="text-xl font-bold text-primary mb-3">{item.q}</h3>
              <p className="text-light-300 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-light-100 mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Search", desc: "Pick your area, cuisine, and budget" },
              { step: "2", title: "Discover", desc: "See curated restaurants with difficulty ratings and booking tips" },
              { step: "3", title: "Book", desc: "Generate a Japanese booking message and send it" },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="text-lg font-bold text-light-100 mb-2">{s.title}</h3>
                <p className="text-light-300">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4 bg-dark-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-light-100 mb-12">Simple Pricing</h2>
          <PricingSection />
          <p className="text-center text-light-300 text-sm mt-6">
            Or pay $3 per message without a pass
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-light-100 mb-12">FAQ</h2>
          <FAQSection />
        </div>
      </section>
    </div>
  );
}
