import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";

import { proxy } from "@/proxy";

describe("Authentication route protection", () => {
  it("redirects unauthenticated pharmacy users to login", () => {
    const request = new NextRequest(
      "http://localhost:3000/pharmacy/dashboard",
    );

    const response = proxy(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/login",
    );
  });

  it("allows authenticated pharmacy users into protected routes", () => {
    const request = new NextRequest(
      "http://localhost:3000/pharmacy/dashboard",
      {
        headers: {
          cookie: "4s-hitech-pharma-auth=pharmacy",
        },
      },
    );

    const response = proxy(request);

    expect(response.status).toBe(200);
  });

  it("redirects authenticated users away from login", () => {
    const request = new NextRequest("http://localhost:3000/login", {
      headers: {
        cookie: "4s-hitech-pharma-auth=pharmacy",
      },
    });

    const response = proxy(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/pharmacy/dashboard",
    );
  });

  it("does not interfere with public routes", () => {
    const request = new NextRequest("http://localhost:3000/products");

    const response = proxy(request);

    expect(response.status).toBe(200);
  });
});
