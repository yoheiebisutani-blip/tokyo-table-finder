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
            Don&apos;t Waste Your Tokyo Nights on{" "}
            <span className="text-primary">Bad Restaurant Choices</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-light-300 max-w-2xl mx-auto leading-relaxed">
            Find special sushi and wagyu spots you can actually book — with booking difficulty ratings, reservation tips, and AI-generated Japanese messages ready to send.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/search"
              className="inline-flex items-center justify-center bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-lg text-lg font-medium transition-colors"
            >
              Browse Restaurants — Free
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
              q: "Picked the wrong restaurant?",
              a: "We show booking difficulty so you know before you commit — not after you've wasted a Tokyo night.",
            },
            {
              q: "Stuck at the reservation step?",
              a: "Many top Tokyo restaurants only take reservations in Japanese. Our AI generates the message for you in seconds.",
            },
            {
              q: "Not sure if you can even get in?",
              a: "We show exactly how to book each restaurant — phone, email, or online — so you never hit a dead end.",
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
              { step: "1", title: "Search", desc: "Filter by area, cuisine, and budget. See booking difficulty at a glance." },
              { step: "2", title: "Check", desc: "See exactly how hard a restaurant is to book, and which method works best." },
              { step: "3", title: "Book", desc: "Generate a perfect Japanese reservation message and send it — done." },
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
          <h2 className="text-3xl font-bold text-center text-light-100 mb-4">Simple Pricing</h2>
          <p className="text-center text-light-300 mb-12 max-w-xl mx-auto">
            Browse and search for free. Purchase a pass to unlock AI booking messages for your entire trip.
          </p>
          <PricingSection />
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
