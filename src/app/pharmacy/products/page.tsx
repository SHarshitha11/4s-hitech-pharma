import { Badge, Button, Card, Table, type TableColumn } from "@/components/ui";

type Product = {
  name: string;
  category: string;
  status: string;
};

const products: Product[] = [
  {
    name: "Sample Product A",
    category: "Pharmaceutical",
    status: "Available",
  },
  {
    name: "Sample Product B",
    category: "Pharmaceutical",
    status: "Pending",
  },
];

const columns: TableColumn<Product>[] = [
  {
    key: "name",
    header: "Product",
  },
  {
    key: "category",
    header: "Category",
  },
  {
    key: "status",
    header: "Status",
    render: (product) => (
      <Badge
        variant={product.status === "Available" ? "success" : "warning"}
      >
        {product.status}
      </Badge>
    ),
  },
];

export default function PharmacyProductsPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Pharmacy Products
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              View available products for pharmacy ordering.
            </p>
          </div>

          <Button variant="outline">Refresh</Button>
        </div>

        <Card
          title="Product List"
          description="Responsive table using the shared design system."
        >
          <Table
            columns={columns}
            data={products}
            getRowKey={(product) => product.name}
          />
        </Card>
      </div>
    </main>
  );
}

