import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge, Button, Card } from "@/components/ui";
import { mockProducts } from "@/lib/mock-products";

interface ProductDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export function generateStaticParams() {
  return mockProducts.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const { id } = await params;

  const product = mockProducts.find((item) => item.id === id);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-w-0 overflow-x-hidden bg-gray-50 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="text-sm text-gray-600"
        >
          <Link
            href="/products"
            className="font-medium text-gray-900 hover:underline"
          >
            Products
          </Link>
          <span className="mx-2">/</span>
          <span>{product.name}</span>
        </nav>

        {/* Header */}
        <section>
          <Badge>Product Details</Badge>

          <h1 className="mt-4 break-words text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {product.name}
          </h1>

          <p className="mt-3 max-w-3xl break-words leading-7 text-gray-600">
            Detailed information for the selected pharmaceutical product.
          </p>
        </section>

        {/* Product Information */}
        <Card
          title="Product Information"
          description="Catalogue information for this product."
        >
          <div className="grid min-w-0 gap-6 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Product Code
              </p>
              <p className="mt-1 break-words text-gray-900">
                {product.productCode}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Brand Name
              </p>
              <p className="mt-1 break-words text-gray-900">
                {product.brandName}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Composition
              </p>
              <p className="mt-1 break-words text-gray-900">
                {product.composition}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Category
              </p>
              <div className="mt-2">
                <Badge>{product.category}</Badge>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Manufacturer
              </p>
              <p className="mt-1 break-words text-gray-900">
                {product.manufacturer}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Availability
              </p>
              <div className="mt-2">
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
              </div>
            </div>
          </div>
        </Card>

        {/* Catalogue Notice */}
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

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/products">
            <Button variant="outline" className="w-full sm:w-auto">
              Back to Products
            </Button>
          </Link>

          <Link href="/contact">
            <Button className="w-full sm:w-auto">
              Product Enquiry
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}