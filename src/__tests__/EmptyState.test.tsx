import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import EmptyState from "../components/shared/EmptyState";

// Mock the Image component since Next.js Image can cause issues in simple jest tests
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ fill, priority, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}));

describe("EmptyState", () => {
  it("renders with default values when only value prop is provided", () => {
    render(<EmptyState value="Projects" />);
    expect(screen.getByText("No Projects Found")).toBeInTheDocument();
    expect(screen.getByText(/There are no projects available at this time/i)).toBeInTheDocument();
  });

  it("renders with custom title and message", () => {
    render(
      <EmptyState 
        title="Custom Title" 
        message="Custom message for empty state" 
      />
    );
    expect(screen.getByText("Custom Title")).toBeInTheDocument();
    expect(screen.getByText("Custom message for empty state")).toBeInTheDocument();
  });

  it("renders with a custom icon", () => {
    const customIcon = <div data-testid="custom-icon">Icon</div>;
    render(<EmptyState value="Posts" icon={customIcon} />);
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });
});
