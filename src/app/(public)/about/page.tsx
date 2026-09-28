import Link from "next/link";
import { Button, Card } from "@/components/ui";

export default function AboutPage() {
  const values = [
    {
      title: "Availability",
      description:
        "Helping pharmacies access the products they need.",
    },
    {
      title: "Reliability",
      description:
        "Building consistent and dependable supply relationships.",
    },
    {
      title: "Quality",
      description:
        "Maintaining appropriate quality processes across sourcing, handling, storage, and manufacturing.",
    },
    {
      title: "Technology",
      description:
        "Using digital tools to simplify product discovery, ordering, tracking, and business communication.",
    },
    {
      title: "Service",
      description:
        "Supporting pharmacy partners throughout the ordering and fulfillment process.",
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-600">
              About 4S HITECH PHARMA
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Connecting Pharmaceutical Products with the Pharmacies That Need
              Them
            </h1>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              4S HITECH PHARMA operates at the intersection of pharmaceutical
              distribution, manufacturing, and technology-enabled pharmacy
              supply.
            </p>
          </div>
        </div>
      </section>

      {/* Company Introduction */}
      <section>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <Card
              title="Our Objective"
              description="Helping pharmacies procure medicines efficiently while building a dependable supply relationship."
            >
              <p className="text-sm leading-6 text-gray-600">
                Our objective is simple: help pharmacies procure medicines
                efficiently while building a dependable supply relationship
                based on product quality, availability, service, and
                transparency.
              </p>
            </Card>

            <Card
              title="Our Approach"
              description="Distribution is more than moving products from one location to another."
            >
              <p className="text-sm leading-6 text-gray-600">
                Through our wholesale distribution operations, we work to
                provide pharmacies with access to a broad range of
                pharmaceutical products. Alongside distribution, our
                manufacturing division develops and supplies selected products
                under the 4S HITECH PHARMA portfolio.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Our Direction
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              Mission and Vision
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Card
              title="Our Mission"
              description="Building a reliable and technology-enabled pharmaceutical supply network."
            >
              <p className="text-sm leading-6 text-gray-600">
                To build a reliable and technology-enabled pharmaceutical
                supply network that helps pharmacies procure quality medicines
                efficiently and serve their customers better.
              </p>
            </Card>

            <Card
              title="Our Vision"
              description="Combining quality products, efficient supply systems, responsible business practices, and technology-driven service."
            >
              <p className="text-sm leading-6 text-gray-600">
                To become a trusted pharmaceutical distribution and
                manufacturing partner by combining quality products, efficient
                supply systems, responsible business practices, and
                technology-driven service.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Our Values
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              Built Around the Needs of Pharmacies
            </h2>

            <p className="mt-4 text-gray-600">
              Our approach focuses on the principles that support dependable
              pharmaceutical supply and pharmacy service.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {values.map((value) => (
              <Card key={value.title} title={value.title}>
                <p className="text-sm leading-6 text-gray-600">
                  {value.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Operations */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <Card
              title="Distribution"
              description="Wholesale pharmaceutical distribution for pharmacy partners and healthcare businesses."
            >
              <p className="text-sm leading-6 text-gray-600">
                Our distribution operations support product sourcing, inventory
                coordination, wholesale order processing, pharmacy supply,
                fulfillment, delivery coordination, and business support.
              </p>

              <Link
                href="/distribution"
                className="mt-5 inline-block text-sm font-semibold text-blue-600 hover:underline"
              >
                Explore Distribution →
              </Link>
            </Card>

            <Card
              title="Manufacturing"
              description="Selected pharmaceutical products under the 4S HITECH PHARMA portfolio."
            >
              <p className="text-sm leading-6 text-gray-600">
                Alongside pharmaceutical distribution, 4S HITECH PHARMA has
                manufacturing operations for selected products, with activities
                focused on applicable quality, regulatory, manufacturing,
                packaging, and documentation requirements.
              </p>

              <Link
                href="/manufacturing"
                className="mt-5 inline-block text-sm font-semibold text-blue-600 hover:underline"
              >
                Explore Manufacturing →
              </Link>
            </Card>

            <Card
              title="Technology"
              description="Digital tools that simplify pharmacy procurement."
            >
              <p className="text-sm leading-6 text-gray-600">
                Technology is used to simplify product discovery, ordering,
                tracking, and business communication for pharmacy partners.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold text-gray-900">
                  Ready to Join Our Pharmacy Network?
                </h2>

                <p className="mt-2 text-gray-600">
                  Register your pharmacy to access the online pharmaceutical
                  ordering platform.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
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