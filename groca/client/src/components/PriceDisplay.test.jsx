import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PriceDisplay from "./PriceDisplay";

describe("PriceDisplay", () => {
  it("shows single price when there is no discount", () => {
    render(<PriceDisplay price={4.5} />);
    expect(screen.getByText("$4.50")).toBeInTheDocument();
  });

  it("shows discount and original price when discount exists", () => {
    render(<PriceDisplay price={10} discountPrice={8} />);
    expect(screen.getByText("$8.00")).toBeInTheDocument();
    expect(screen.getByText("$10.00")).toBeInTheDocument();
  });
});
