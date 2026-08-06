import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import PageHeading from "../components/shared/PageHeading";

describe("PageHeading", () => {
  it("renders the title correctly", () => {
    render(<PageHeading title="My Heading" />);
    expect(screen.getByRole("heading", { name: "My Heading" })).toBeInTheDocument();
  });

  it("renders the description when provided", () => {
    render(
      <PageHeading 
        title="My Heading" 
        description="This is a nice description" 
      />
    );
    expect(screen.getByText("This is a nice description")).toBeInTheDocument();
  });

  it("renders children when provided", () => {
    render(
      <PageHeading title="Heading">
        <button data-testid="child-button">Click Me</button>
      </PageHeading>
    );
    expect(screen.getByTestId("child-button")).toBeInTheDocument();
  });
});
