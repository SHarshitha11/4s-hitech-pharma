import { render, screen } from "@testing-library/react";
import ManufacturingPage from "../../manufacturing/page";

describe("Manufacturing Page", () => {
  it("renders the main manufacturing heading", () => {
    render(<ManufacturingPage />);

    expect(
      screen.getByRole("heading", {
        name: /pharmaceutical manufacturing with a quality-focused approach/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders the manufacturing capabilities", () => {
    render(<ManufacturingPage />);

    expect(screen.getByText("Product Development")).toBeInTheDocument();
    expect(screen.getByText("Controlled Processes")).toBeInTheDocument();
    expect(
      screen.getByText("Quality-Focused Operations"),
    ).toBeInTheDocument();
    expect(screen.getByText("Reliable Supply")).toBeInTheDocument();
  });

  it("renders the quality approach section", () => {
    render(<ManufacturingPage />);

    expect(screen.getByText("Quality")).toBeInTheDocument();
    expect(screen.getByText("Consistency")).toBeInTheDocument();
    expect(screen.getByText("Responsible Practices")).toBeInTheDocument();
    expect(screen.getByText("Continuous Improvement")).toBeInTheDocument();
  });

  it("renders the product portfolio CTA", () => {
    render(<ManufacturingPage />);

    const productLinks = screen.getAllByRole("link", {
      name: /explore product portfolio|view products/i,
    });

    expect(productLinks.length).toBeGreaterThanOrEqual(1);

    expect(productLinks[0]).toHaveAttribute("href", "/products");
  });

  it("renders the enquiry and pharmacy registration CTAs", () => {
    render(<ManufacturingPage />);

    expect(
      screen.getByRole("link", {
        name: /make an enquiry/i,
      }),
    ).toHaveAttribute("href", "/contact");

    expect(
      screen.getByRole("link", {
        name: /contact us/i,
      }),
    ).toHaveAttribute("href", "/contact");

    expect(
      screen.getByRole("link", {
        name: /register your pharmacy/i,
      }),
    ).toHaveAttribute("href", "/register-pharmacy");
  });
});