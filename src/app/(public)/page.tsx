import Link from "next/link";
import { Button } from "@/components/ui";

const businessHighlights = [
  "Wholesale Pharmaceutical Distribution",
  "Selected In-House Manufactured Products",
  "Pharmacy-Focused Ordering Platform",
  "Bulk & Regular Orders",
  "Order Tracking",
  "Dedicated Business Support",
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              4S HITECH PHARMA
            </p>

            <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Wholesale Pharmaceutical Supply, Built Around Your Pharmacy
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              Get access to a dependable pharmaceutical supply network
              designed for pharmacies, medical stores, hospitals, clinics, and
              healthcare businesses.
            </p>

            <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
              From everyday medicines to selected products manufactured by 4S
              HITECH PHARMA, we bring product availability, convenient
              ordering, competitive business pricing, and dependable
              fulfillment together in one platform.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register-pharmacy">
                <Button size="lg">Register Your Pharmacy</Button>
              </Link>

              <Link href="/pharmacy/dashboard">
                <Button variant="outline" size="lg">
                  Login & Order
                </Button>
              </Link>
            </div>
          </div>

          <div
            className="flex min-h-80 items-center justify-center rounded-xl border border-gray-200 bg-white p-8 shadow-sm"
            aria-label="Pharmaceutical supply visual placeholder"
          >
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-3xl">
                +
              </div>

              <h2 className="mt-5 text-xl font-semibold text-gray-900">
                Pharmaceutical Supply
              </h2>

              <p className="mt-2 max-w-sm text-sm leading-6 text-gray-600">
                Distribution, manufacturing, and pharmacy-focused ordering in
                one platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Business Highlights */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Business Highlights
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              A Pharmacy-Focused Supply Network
            </h2>

            <p className="mt-4 text-base leading-7 text-gray-600">
              4S HITECH PHARMA brings distribution, manufacturing, and
              technology-enabled ordering together to support pharmacy
              procurement.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {businessHighlights.map((highlight) => (
              <div
                key={highlight}
                className="rounded-xl border border-gray-200 bg-gray-50 p-6 transition hover:border-blue-200 hover:shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-lg font-semibold text-blue-600">
                  ✓
                </div>

                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {highlight}
                </h3>
              </div>
            ))}
          </div>
        </div>
           </section>

      {/* About Preview */}
      <section className="border-t border-gray-200 bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              About 4S HITECH PHARMA
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Connecting Pharmaceutical Products with the Pharmacies That Need
              Them
            </h2>

            <p className="mt-6 text-base leading-7 text-gray-600">
              4S HITECH PHARMA operates at the intersection of pharmaceutical
              distribution, manufacturing, and technology-enabled pharmacy
              supply.
            </p>

            <p className="mt-4 text-base leading-7 text-gray-600">
              Our objective is simple: help pharmacies procure medicines
              efficiently while building a dependable supply relationship based
              on product quality, availability, service, and transparency.
            </p>

            <p className="mt-4 text-base leading-7 text-gray-600">
              Through our wholesale distribution operations, we work to provide
              pharmacies with access to a broad range of pharmaceutical
              products. Alongside distribution, our manufacturing division
              develops and supplies selected products under the 4S HITECH
              PHARMA portfolio.
            </p>

            <div className="mt-8">
              <Link href="/about">
                <Button size="lg" variant="outline">
                  Learn More About Us
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-xl font-semibold text-gray-900">
              Our Approach
            </h3>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              We believe pharmaceutical distribution is more than moving
              products from one location to another. It is about building a
              dependable supply relationship with pharmacy partners.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900">Availability</h4>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Helping pharmacies access the products they need.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900">Reliability</h4>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Building consistent and dependable supply relationships.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900">Quality</h4>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Maintaining appropriate quality processes across sourcing,
                  handling, storage, and manufacturing.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900">Technology</h4>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Using digital tools to simplify product discovery, ordering,
                  tracking, and business communication.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900">Service</h4>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Supporting pharmacy partners throughout the ordering and
                  fulfillment process.
                </p>
              </div>
            </div>
          </div>
        </div>
          </section>

      {/* Product Categories */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                Products
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Find the Products Your Pharmacy Needs
              </h2>

              <p className="mt-4 text-base leading-7 text-gray-600">
                Browse our pharmaceutical product catalogue and find products
                available through our wholesale distribution network.
              </p>
            </div>

            <Link href="/products" className="shrink-0">
              <Button variant="outline">Browse All Products</Button>
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Tablets",
              "Capsules",
              "Syrups",
              "Suspensions",
              "Injections",
              "Creams",
              "Ointments",
              "Drops",
              "Powders",
              "Nutraceuticals",
              "Surgical / Healthcare Products",
              "Other Pharmaceutical Products",
            ].map((category) => (
              <Link
                key={category}
                href="/products"
                className="group rounded-xl border border-gray-200 bg-gray-50 p-5 transition hover:border-blue-200 hover:bg-white hover:shadow-sm"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-semibold text-gray-900">{category}</h3>

                  <span
                    aria-hidden="true"
                    className="text-lg text-gray-400 transition group-hover:translate-x-1 group-hover:text-blue-600"
                  >
                    →
                  </span>
                </div>

                <p className="mt-2 text-sm text-gray-600">
                  Explore products
                </p>
              </Link>
            ))}
          </div>
        </div>
            </section>

      {/* Distribution Preview */}
      <section className="border-t border-gray-200 bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Distribution
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Reliable Pharmaceutical Distribution for Pharmacy Partners
            </h2>

            <p className="mt-6 text-base leading-7 text-gray-600">
              Our wholesale distribution operations are designed to help
              pharmacies access the pharmaceutical products they need through a
              dependable supply relationship.
            </p>

            <p className="mt-4 text-base leading-7 text-gray-600">
              From product discovery and ordering to fulfillment and delivery,
              the platform brings important parts of the procurement process
              together in one place.
            </p>

            <div className="mt-8">
              <Link href="/distribution">
                <Button>Explore Distribution</Button>
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900">
              Distribution at a Glance
            </h3>

            <div className="mt-6 space-y-5">
              <div>
                <h4 className="font-semibold text-gray-900">
                  Product Availability
                </h4>

                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Access products through the wholesale pharmaceutical supply
                  network.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900">
                  Convenient Ordering
                </h4>

                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Find and order products through the pharmacy-focused
                  platform.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900">
                  Order Fulfillment
                </h4>

                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Follow the procurement process from order placement through
                  fulfillment.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900">
                  Pharmacy Support
                </h4>

                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Maintain a dependable business relationship with pharmacy
                  partners.
                </p>
              </div>
            </div>
          </div>
        </div>
           </section>

      {/* Manufacturing Preview */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Manufacturing
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Selected Products Manufactured by 4S HITECH PHARMA
            </h2>

            <p className="mt-6 text-base leading-7 text-gray-600">
              Alongside pharmaceutical distribution, 4S HITECH PHARMA
              manufactures selected products under its own portfolio.
            </p>

            <p className="mt-4 text-base leading-7 text-gray-600">
              Our manufacturing activities focus on appropriate processes,
              quality practices, and the needs of the healthcare market.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900">
              Manufacturing Capabilities
            </h3>

            <div className="mt-6 space-y-5">
              <div className="rounded-lg border border-gray-200 p-5">
                <h4 className="font-semibold text-gray-900">
                  Selected Product Manufacturing
                </h4>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Development and supply of selected products under the
                  4S HITECH PHARMA portfolio.
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 p-5">
                <h4 className="font-semibold text-gray-900">
                  Quality-Focused Processes
                </h4>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Appropriate quality practices across manufacturing,
                  handling, and storage activities.
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 p-5">
                <h4 className="font-semibold text-gray-900">
                  Healthcare Market Focus
                </h4>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Manufacturing activities aligned with the needs of the
                  healthcare and pharmaceutical market.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <Link href="/manufacturing">
                <Button variant="outline">Explore Manufacturing</Button>
              </Link>
            </div>
          </div>
        </div>
           </section>

      {/* Why Choose Us */}
      <section className="border-t border-gray-200 bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Why Choose Us
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Built Around the Needs of Pharmacy Partners
            </h2>

            <p className="mt-4 text-base leading-7 text-gray-600">
              Our approach combines pharmaceutical supply, technology, and
              service to support a dependable pharmacy procurement experience.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="font-semibold text-gray-900">Availability</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Helping pharmacy partners access the products they need.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="font-semibold text-gray-900">Reliability</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Building dependable supply relationships with pharmacy
                partners.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="font-semibold text-gray-900">Quality</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Supporting appropriate quality practices across operations.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="font-semibold text-gray-900">Technology</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Using digital tools to simplify discovery, ordering, and
                tracking.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="font-semibold text-gray-900">Service</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Supporting pharmacy partners throughout the ordering process.
              </p>
            </div>
          </div>
        </div>
           </section>

      {/* Pharmacy Ordering Process */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Pharmacy Ordering
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              A Simple Way to Order for Your Pharmacy
            </h2>

            <p className="mt-4 text-base leading-7 text-gray-600">
              The pharmacy-focused platform brings product discovery, ordering,
              and order tracking together in one place.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 font-semibold text-blue-600">
                1
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                Register Your Pharmacy
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Create your pharmacy account and provide the required business
                information.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 font-semibold text-blue-600">
                2
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                Browse and Order
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Browse available products, select quantities, and place your
                pharmacy order.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 font-semibold text-blue-600">
                3
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                Track Your Order
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Follow your order through the fulfillment and delivery process.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/register-pharmacy">
              <Button>Register Your Pharmacy</Button>
            </Link>
          </div>
        </div>
          </section>

      {/* Pharmacy Registration CTA */}
      <section className="border-t border-gray-200 bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center shadow-sm sm:px-10 sm:py-12">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Join Our Pharmacy Network
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ready to Start Ordering?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600">
              Register your pharmacy to access the pharmacy-focused ordering
              platform and begin exploring available pharmaceutical products.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/register-pharmacy">
                <Button size="lg">Register Your Pharmacy</Button>
              </Link>

              <Link href="/contact">
                <Button variant="outline" size="lg">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
            </section>

      {/* FAQ Preview */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              FAQ
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>

            <p className="mt-4 text-base leading-7 text-gray-600">
              Find answers to common questions about pharmacy registration,
              ordering, products, and support.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            <details className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <summary className="cursor-pointer font-semibold text-gray-900">
                Who can register on the pharmacy platform?
              </summary>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Pharmacies and eligible healthcare businesses can use the
                registration process to request access to the ordering
                platform.
              </p>
            </details>

            <details className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <summary className="cursor-pointer font-semibold text-gray-900">
                How can I find pharmaceutical products?
              </summary>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Registered pharmacy users can browse the available product
                catalogue and use the ordering platform to find products.
              </p>
            </details>

            <details className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <summary className="cursor-pointer font-semibold text-gray-900">
                Can I track my pharmacy orders?
              </summary>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                The platform is designed to support order tracking through the
                pharmacy ordering and fulfillment process.
              </p>
            </details>

            <details className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <summary className="cursor-pointer font-semibold text-gray-900">
                How can I contact 4S HITECH PHARMA?
              </summary>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Visit the Contact page to find the available contact options
                and submit an enquiry.
              </p>
            </details>
          </div>

          <div className="mt-8 text-center">
            <Link href="/contact">
              <Button variant="outline">Have More Questions?</Button>
            </Link>
          </div>
        </div>
            </section>

      {/* Contact Preview */}
      <section className="border-t border-gray-200 bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                Contact Us
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Let&apos;s Connect
              </h2>

              <p className="mt-4 max-w-xl text-base leading-7 text-gray-600">
                Have a question about our products, distribution services,
                manufacturing, or pharmacy ordering platform? Get in touch with
                our team.
              </p>

              <div className="mt-8">
                <Link href="/contact">
                  <Button>Contact Us</Button>
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">
                How We Can Help
              </h3>

              <div className="mt-6 space-y-5">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Product Enquiries
                  </h4>

                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Ask about pharmaceutical products and catalogue
                    availability.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Distribution Enquiries
                  </h4>

                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Learn more about our wholesale distribution services.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Pharmacy Support
                  </h4>

                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Get assistance with pharmacy registration and the ordering
                    platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}