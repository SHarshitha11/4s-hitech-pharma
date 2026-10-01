import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge, Button, Card } from "@/components/ui";
import { mockProducts } from "@/lib/mock-products";

interface ProductDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const { id } = await params;

  const product = mockProducts.find((item) => item.id === id);

  if (!product) {
    notFound();
    return null;
  }

  return (
    <main className="min-w-0 overflow-x-hidden bg-gray-50 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <div>
          <Link
            href="/products"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Products
          </Link>

          <span className="mx-2 text-gray-400">/</span>

          <span className="break-words text-sm text-gray-600">
            {product.name}
          </span>
        </div>

        <section>
          <Badge>Product Details</Badge>

          <h1 className="mt-4 break-words text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {product.name}
          </h1>

          <p className="mt-3 max-w-3xl break-words leading-7 text-gray-600">
            Detailed information for the selected pharmaceutical product.
          </p>
        </section>

        <Card
          title="Product Information"
          description="Catalogue information for this product."
        >
          <dl className="grid min-w-0 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="min-w-0">
              <dt className="text-sm font-medium text-gray-500">
                Product Code
              </dt>
              <dd className="mt-1 break-words text-sm text-gray-900">
                {product.productCode}
              </dd>
            </div>

            <div className="min-w-0">
              <dt className="text-sm font-medium text-gray-500">
                Brand Name
              </dt>
              <dd className="mt-1 break-words text-sm text-gray-900">
                {product.brandName}
              </dd>
            </div>

            <div className="min-w-0">
              <dt className="text-sm font-medium text-gray-500">
                Composition
              </dt>
              <dd className="mt-1 break-words text-sm text-gray-900">
                {product.composition}
              </dd>
            </div>

            <div className="min-w-0">
              <dt className="text-sm font-medium text-gray-500">
                Strength
              </dt>
              <dd className="mt-1 break-words text-sm text-gray-900">
                {product.strength}
              </dd>
            </div>

            <div className="min-w-0">
              <dt className="text-sm font-medium text-gray-500">
                Dosage Form
              </dt>
              <dd className="mt-1 break-words text-sm text-gray-900">
                {product.dosageForm}
              </dd>
            </div>

            <div className="min-w-0">
              <dt className="text-sm font-medium text-gray-500">
                Pack Size
              </dt>
              <dd className="mt-1 break-words text-sm text-gray-900">
                {product.packSize}
              </dd>
            </div>

            <div className="min-w-0">
              <dt className="text-sm font-medium text-gray-500">
                Category
              </dt>
              <dd className="mt-2">
                <Badge>{product.category}</Badge>
              </dd>
            </div>

            <div className="min-w-0">
              <dt className="text-sm font-medium text-gray-500">
                Manufacturer
              </dt>
              <dd className="mt-1 break-words text-sm text-gray-900">
                {product.manufacturer}
              </dd>
            </div>

            <div className="min-w-0">
              <dt className="text-sm font-medium text-gray-500">
                Availability
              </dt>
              <dd className="mt-2">
                <Badge
                  variant={
                    product.availability === "In Stock"
                      ? "success"
                      : product.availability === "Limited Stock"
                        ? "warning"
                        : "danger"
                  }
                >
                  {product.availability}
                </Badge>
              </dd>
            </div>
          </dl>
        </Card>

        <Card
          title="Ordering"
          description="Pharmacies can register to access the ordering platform."
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/register-pharmacy">
              <Button className="w-full sm:w-auto">
                Start Ordering
              </Button>
            </Link>

            <Link href="/contact">
              <Button variant="outline" className="w-full sm:w-auto">
                Product Enquiry
              </Button>
            </Link>

            <Link href="/products">
              <Button variant="outline" className="w-full sm:w-auto">
                Back to Products
              </Button>
            </Link>
          </div>
        </Card>

        <Card
          title="Catalogue Information"
          description="Product data is currently provided through API-ready mock data."
        >
          <p className="text-sm leading-6 text-gray-600">
            This product catalogue is prepared for future integration with
            the pharmaceutical product service. Verified product information
            can be connected through the backend API when available.
          </p>
        </Card>
      </div>
    </main>
  );
}