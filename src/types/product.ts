export type ProductCategory =
  | "Tablets"
  | "Capsules"
  | "Syrups"
  | "Suspensions"
  | "Injections"
  | "Creams"
  | "Ointments"
  | "Drops"
  | "Powders"
  | "Nutraceuticals"
  | "Surgical & Healthcare";

export type ProductAvailability =
  | "In Stock"
  | "Limited Stock"
  | "Out of Stock";

export interface Product {
  id: string;
  productCode: string;
  name: string;
  brandName: string;
  composition: string;
  strength: string;
  dosageForm: string;
  packSize: string;
  category: ProductCategory;
  manufacturer: string;
  availability: ProductAvailability;
}