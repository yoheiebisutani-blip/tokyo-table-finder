import PricingSection from "./PricingSection";
import FAQSection from "./FAQSection";

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-light-100 mb-4">
        Simple, Transparent Pricing
      </h1>
      <p className="text-center text-light-300 mb-12 max-w-xl mx-auto">
        Search and browse restaurants for free. Purchase a pass to generate booking messages.
      </p>

      <PricingSection />

      <p className="text-center text-light-300 text-sm mt-6 mb-16">
        All plans include the same features — only the duration differs.
      </p>

      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-light-100 mb-6">Frequently Asked Questions</h2>
        <FAQSection />
      </div>
    </div>
  );
}
