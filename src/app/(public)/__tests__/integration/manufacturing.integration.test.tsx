import { render, screen } from "@testing-library/react";
import ManufacturingPage from "../../manufacturing/page";

describe("Manufacturing Page Integration", () => {
  it("connects the product portfolio CTA to the products route", () => {
    render(<ManufacturingPage />);

    const productLinks = screen.getAllByRole("link", {
      name: /explore product portfolio|view products/i,
    });

    expect(productLinks.length).toBeGreaterThanOrEqual(2);

    productLinks.forEach((link) => {
      expect(link).toHaveAttribute("href", "/products");
    });
  });

  it("connects the manufacturing enquiry CTAs to the contact route", () => {
    render(<ManufacturingPage />);

    const enquiryLinks = screen.getAllByRole("link", {
      name: /make an enquiry|contact us/i,
    });

    expect(enquiryLinks.length).toBeGreaterThanOrEqual(2);

    enquiryLinks.forEach((link) => {
      expect(link).toHaveAttribute("href", "/contact");
    });
  });

  it("connects the pharmacy registration CTA to the registration route", () => {
    render(<ManufacturingPage />);

    const registrationLink = screen.getByRole("link", {
      name: /register your pharmacy/i,
    });

    expect(registrationLink).toHaveAttribute(
      "href",
      "/register-pharmacy",
    );
  });
});