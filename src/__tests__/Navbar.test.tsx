import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import Navbar from "../components/global/Navbar";
import { usePathname } from "next/navigation";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

// Mock UnmountStudio
jest.mock("../components/global/Unmount", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock Theme and MobileDock to simplify and isolate the Navbar test
jest.mock("../components/global/Theme", () => function MockTheme() { return <div data-testid="theme-toggle" />; });
jest.mock("../components/global/MobileDock", () => function MockMobileDock() { return <div data-testid="mobile-dock" />; });
jest.mock("../components/global/SignatureNavLogo", () => function MockSignatureNavLogo() { return <div data-testid="nav-logo" />; });

// Mock window.matchMedia which is required by framer-motion under the hood sometimes
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

describe("Navbar Component", () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue("/");
  });

  it("renders all core navigation links", () => {
    render(<Navbar />);
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Blog")).toBeInTheDocument();
    expect(screen.getByText("Photos")).toBeInTheDocument();
    expect(screen.getByText("Visitors")).toBeInTheDocument();
  });

  it("highlights the active link based on current path", () => {
    (usePathname as jest.Mock).mockReturnValue("/projects");
    render(<Navbar />);
    
    const projectsLink = screen.getByText("Projects");
    expect(projectsLink).toHaveClass("dark:text-primary-color");
    
    const aboutLink = screen.getByText("About");
    expect(aboutLink).toHaveClass("dark:text-zinc-400");
  });

  it("renders the Theme toggle and MobileDock components", () => {
    render(<Navbar />);
    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
    expect(screen.getByTestId("mobile-dock")).toBeInTheDocument();
    expect(screen.getByTestId("nav-logo")).toBeInTheDocument();
  });
});
