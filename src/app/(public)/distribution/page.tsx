import Link from "next/link";
import { Button, Card } from "@/components/ui";

export default function DistributionPage() {
  const services = [
    {
      title: "Product Sourcing",
      description:
        "Supporting pharmacies with access to a broad range of pharmaceutical products through wholesale distribution.",
    },
    {
      title: "Inventory Coordination",
      description:
        "Coordinating product availability and inventory requirements to support dependable pharmacy supply.",
    },
    {
      title: "Wholesale Order Processing",
      description:
        "Managing wholesale orders efficiently from order placement through fulfillment.",
    },
    {
      title: "Pharmacy Supply",
      description:
        "Supplying pharmaceutical products to eligible pharmacy partners and healthcare businesses.",
    },
    {
      title: "Bulk Orders",
      description:
        "Supporting pharmacies and eligible healthcare businesses with bulk pharmaceutical requirements.",
    },
    {
      title: "Regular Replenishment",
      description:
        "Supporting recurring product requirements to help pharmacy partners maintain their supply.",
    },
    {
      title: "Order Fulfillment",
      description:
        "Coordinating order fulfillment to help ensure pharmacy orders are processed efficiently.",
    },
    {
      title: "Delivery Coordination",
      description:
        "Coordinating delivery activities as part of the pharmaceutical order fulfillment process.",
    },
    {
      title: "Business Support",
      description:
        "Providing support to pharmacy partners throughout the ordering and supply process.",
    },
  ];

  const pharmacyTypes = [
    "Retail Pharmacies",
    "Medical Stores",
    "Hospital Pharmacies",
    "Clinics",
    "Healthcare Institutions",
    "Authorized Healthcare Businesses",
    "Other Eligible Pharmaceutical Trade Partners",
  ];

  return (
    <div className="w-full min-w-0 overflow-x-hidden">
      {/* Hero */}
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto w-full max-w-7xl min-w-0 px-4 py-16 sm:px-6 lg:px-8">
          <div className="w-full max-w-3xl min-w-0">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-600">
              Pharmaceutical Distribution
            </p>

            <h1 className="break-words text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Reliable Wholesale Pharmaceutical Distribution
            </h1>

            <p className="mt-6 break-words text-lg leading-8 text-gray-600">
              Supporting pharmacies and eligible healthcare businesses with
              pharmaceutical product sourcing, wholesale order processing,
              supply coordination, fulfillment, and delivery support.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16">
        <div className="mx-auto w-full max-w-7xl min-w-0 px-4 sm:px-6 lg:px-8">
          <div className="grid min-w-0 gap-8 lg:grid-cols-2">
            <div className="min-w-0">
              <Card
                title="Wholesale Distribution for Pharmacies"
                description="Connecting pharmaceutical products with the businesses that need them."
              >
                <p className="break-words text-sm leading-6 text-gray-600">
                  4S HITECH PHARMA provides wholesale pharmaceutical
                  distribution services focused on helping pharmacy partners
                  procure products efficiently and maintain dependable supply
                  relationships.
                </p>
              </Card>
            </div>

            <div className="min-w-0">
              <Card
                title="A Supply-Focused Approach"
                description="Supporting the complete wholesale ordering process."
              >
                <p className="break-words text-sm leading-6 text-gray-600">
                  Our distribution service focuses on product sourcing,
                  inventory coordination, wholesale order processing, pharmacy
                  supply, fulfillment, delivery coordination, and business
                  support.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Distribution Services */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto w-full max-w-7xl min-w-0 px-4 sm:px-6 lg:px-8">
          <div className="mb-10 w-full max-w-2xl min-w-0">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Distribution Services
            </p>

            <h2 className="mt-2 break-words text-3xl font-bold text-gray-900">
              Supporting Every Stage of Pharmacy Supply
            </h2>

            <p className="mt-4 break-words text-gray-600">
              Our distribution operations are designed around the practical
              supply and ordering needs of pharmacy partners.
            </p>
          </div>

          <div className="grid min-w-0 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div key={service.title} className="min-w-0">
                <Card title={service.title}>
                  <p className="break-words text-sm leading-6 text-gray-600">
                    {service.description}
                  </p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-16">
        <div className="mx-auto w-full max-w-7xl min-w-0 px-4 sm:px-6 lg:px-8">
          <div className="grid min-w-0 gap-10 lg:grid-cols-2 lg:items-start">
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                Who We Serve
              </p>

              <h2 className="mt-2 break-words text-3xl font-bold text-gray-900">
                Supporting Eligible Healthcare Businesses
              </h2>

              <p className="mt-4 break-words leading-7 text-gray-600">
                Our wholesale distribution services are designed to support
                pharmacies and other eligible pharmaceutical trade partners
                with their product procurement and supply requirements.
              </p>
            </div>

            <div className="min-w-0">
              <Card title="Our Pharmacy Supply Network">
                <div className="grid min-w-0 gap-3 sm:grid-cols-2">
                  {pharmacyTypes.map((type) => (
                    <div
                      key={type}
                      className="min-w-0 break-words rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm font-medium text-gray-700"
                    >
                      {type}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pharmacy Supply Process */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto w-full max-w-7xl min-w-0 px-4 sm:px-6 lg:px-8">
          <div className="mb-10 w-full max-w-2xl min-w-0">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Pharmacy Supply Process
            </p>

            <h2 className="mt-2 break-words text-3xl font-bold text-gray-900">
              From Product Requirement to Delivery
            </h2>
          </div>

          <div className="grid min-w-0 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="min-w-0">
              <Card
                title="1. Product Requirement"
                description="Identify the pharmaceutical products required by the pharmacy."
              >
                <p className="break-words text-sm leading-6 text-gray-600">
                  Identify the pharmaceutical products required by the
                  pharmacy.
                </p>
              </Card>
            </div>

            <div className="min-w-0">
              <Card
                title="2. Wholesale Order"
                description="Place the required wholesale order through the available ordering process."
              >
                <p className="break-words text-sm leading-6 text-gray-600">
                  Place the required wholesale order through the available
                  ordering process.
                </p>
              </Card>
            </div>

            <div className="min-w-0">
              <Card
                title="3. Order Fulfillment"
                description="Coordinate product availability and order fulfillment."
              >
                <p className="break-words text-sm leading-6 text-gray-600">
                  Coordinate product availability and order fulfillment.
                </p>
              </Card>
            </div>

            <div className="min-w-0">
              <Card
                title="4. Delivery Coordination"
                description="Coordinate delivery as part of the completed order process."
              >
                <p className="break-words text-sm leading-6 text-gray-600">
                  Coordinate delivery as part of the completed order process.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto w-full max-w-7xl min-w-0 px-4 sm:px-6 lg:px-8">
          <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
            <div className="flex min-w-0 flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0 max-w-2xl">
                <h2 className="break-words text-2xl font-bold text-gray-900">
                  Need Reliable Pharmaceutical Supply?
                </h2>

                <p className="mt-2 break-words text-gray-600">
                  Register your pharmacy to access the 4S HITECH PHARMA
                  ordering platform.
                </p>
              </div>

              <div className="flex min-w-0 flex-col gap-3 sm:flex-row">
                <Link href="/register-pharmacy">
                  <Button>Register Your Pharmacy</Button>
                </Link>

                <Link href="/contact">
                  <Button variant="outline">Contact Us</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}