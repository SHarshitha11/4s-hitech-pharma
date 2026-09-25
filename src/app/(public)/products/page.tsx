import { Alert, Badge, Button, Card, Input } from "@/components/ui";

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Products
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Pharmaceutical product catalogue.
          </p>
        </div>

        <Alert variant="info" title="Product Catalogue">
          Browse products and view their availability status.
        </Alert>

        <Card
          title="Product Search"
          description="Search the available pharmaceutical products."
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              id="product-search"
              label="Search products"
              placeholder="Enter product name"
            />

            <div className="flex items-end">
              <Button>Search</Button>
            </div>
          </div>
        </Card>

        <Card
          title="Sample Product"
          description="Example of the reusable Card and Badge components."
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">
                Pharmaceutical Product
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Product information will be connected to the backend later.
              </p>
            </div>

            <Badge variant="success">Available</Badge>
          </div>
        </Card>
      </div>
    </main>
  );
}

