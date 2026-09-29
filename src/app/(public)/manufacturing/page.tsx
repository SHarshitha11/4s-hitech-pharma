import Link from "next/link";

import { Badge, Button, Card } from "@/components/ui";

const capabilities = [
  {
    title: "Product Development",
    description:
      "Development and supply of selected pharmaceutical products with a focus on dependable quality and consistent processes.",
  },
  {
    title: "Controlled Processes",
    description:
      "Structured manufacturing processes designed to support quality, consistency and reliable pharmaceutical supply.",
  },
  {
    title: "Quality-Focused Operations",
    description:
      "Quality considerations are integrated across manufacturing activities to support dependable products and supply.",
  },
  {
    title: "Reliable Supply",
    description:
      "Manufacturing activities support the wider distribution network and help maintain dependable product availability.",
  },
];

const qualityApproach = [
  {
    title: "Quality",
    description:
      "Quality is treated as a core part of the manufacturing and supply approach.",
  },
  {
    title: "Consistency",
    description:
      "Controlled and structured processes support consistent manufacturing outcomes.",
  },
  {
    title: "Responsible Practices",
    description:
      "Manufacturing activities are approached with responsible business practices and dependable operations.",
  },
  {
    title: "Continuous Improvement",
    description:
      "Technology and structured processes support ongoing improvement in pharmaceutical operations.",
  },
];

export default function ManufacturingPage() {
  return (
    <main className="min-w-0 overflow-x-hidden">
      {/* Hero Section */}
      <section className="bg-slate-900 px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-3xl">
            <Badge>Manufacturing</Badge>

            <h1 className="mt-5 break-words text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Pharmaceutical Manufacturing with a Quality-Focused Approach
            </h1>

            <p className="mt-6 max-w-2xl break-words text-base leading-7 text-slate-300 sm:text-lg">
              Our manufacturing division develops and supplies selected
              pharmaceutical products while supporting dependable quality,
              controlled processes and reliable supply.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/products">
                <Button variant="primary" size="lg">
                  Explore Product Portfolio
                </Button>
              </Link>

              <Link href="/contact">
                <Button variant="outline" size="lg">
                  Make an Enquiry
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Manufacturing Overview */}
      <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid min-w-0 gap-10 lg:grid-cols-2 lg:items-center">
            <div className="min-w-0">
              <Badge>Our Manufacturing Approach</Badge>

              <h2 className="mt-4 break-words text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Supporting quality products and dependable pharmaceutical
                supply
              </h2>

              <p className="mt-5 break-words leading-7 text-slate-600">
                4S HITECH PHARMA operates at the intersection of
                pharmaceutical distribution, manufacturing and
                technology-enabled pharmacy supply. Our manufacturing
                activities complement the wider pharmaceutical supply
                network.
              </p>

              <p className="mt-4 break-words leading-7 text-slate-600">
                The manufacturing division focuses on selected products and
                follows a quality-focused approach designed to support
                dependable products, reliable supply and responsible business
                practices.
              </p>
            </div>

            <Card
              title="Manufacturing at 4S HITECH PHARMA"
              description="A focused approach to pharmaceutical manufacturing and supply."
            >
              <div className="mt-5 space-y-4">
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">
                    Selected Pharmaceutical Products
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Manufacturing activities focus on selected products that
                    support the company&apos;s pharmaceutical supply network.
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">
                    Quality-Focused Approach
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Quality, consistency and responsible practices remain
                    central to the manufacturing approach.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Manufacturing Capabilities */}
      <section className="bg-slate-50 px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <Badge>Manufacturing Capabilities</Badge>

            <h2 className="mt-4 break-words text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Capabilities that support dependable pharmaceutical operations
            </h2>

            <p className="mt-4 break-words leading-7 text-slate-600">
              Our manufacturing approach is designed around structured
              processes, quality-focused operations and dependable supply.
            </p>
          </div>

          <div className="mt-10 grid min-w-0 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((capability) => (
              <Card
                key={capability.title}
                title={capability.title}
                description={capability.description}
              >
                <div className="mt-4 text-sm leading-6 text-slate-600">
                  {capability.description}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Approach */}
      <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-3xl">
            <Badge>Quality Approach</Badge>

            <h2 className="mt-4 break-words text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Quality and responsible practices across manufacturing
            </h2>

            <p className="mt-4 break-words leading-7 text-slate-600">
              We approach manufacturing with an emphasis on quality,
              consistency, reliable processes and responsible business
              practices.
            </p>
          </div>

          <div className="mt-10 grid min-w-0 gap-6 sm:grid-cols-2">
            {qualityApproach.map((item) => (
              <Card
                key={item.title}
                title={item.title}
                description={item.description}
              >
                <div className="mt-4 text-sm leading-6 text-slate-600">
                  {item.description}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Product Portfolio CTA */}
      <section className="bg-slate-900 px-4 py-14 text-white sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 max-w-3xl">
            <Badge>Product Portfolio</Badge>

            <h2 className="mt-4 break-words text-3xl font-bold tracking-tight sm:text-4xl">
              Explore our pharmaceutical product portfolio
            </h2>

            <p className="mt-4 break-words leading-7 text-slate-300">
              View the available pharmaceutical products and learn more about
              the products supplied through 4S HITECH PHARMA.
            </p>
          </div>

          <div className="shrink-0">
            <Link href="/products">
              <Button variant="primary" size="lg">
                View Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Enquiry CTA */}
      <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto w-full max-w-4xl text-center">
          <Badge>Manufacturing Enquiry</Badge>

          <h2 className="mt-4 break-words text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Have a pharmaceutical manufacturing enquiry?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl break-words leading-7 text-slate-600">
            Contact 4S HITECH PHARMA to discuss your requirements and learn
            more about our manufacturing and pharmaceutical supply
            capabilities.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/contact">
              <Button variant="primary" size="lg">
                Contact Us
              </Button>
            </Link>

            <Link href="/register-pharmacy">
              <Button variant="outline" size="lg">
                Register Your Pharmacy
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}