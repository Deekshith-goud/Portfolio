import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Theme from "../components/global/Theme";
import { useTheme } from "next-themes";

jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}));

describe("Theme Component", () => {
  const setThemeMock = jest.fn();
  let originalStartViewTransition: any;

  beforeEach(() => {
    jest.clearAllMocks();
    (useTheme as jest.Mock).mockReturnValue({
      theme: "light",
      systemTheme: "light",
      setTheme: setThemeMock,
    });
    
    originalStartViewTransition = document.startViewTransition;
    document.startViewTransition = jest.fn((cb) => {
      cb();
      return { ready: Promise.resolve() } as any;
    });
  });
  
  afterEach(() => {
    document.startViewTransition = originalStartViewTransition;
  });

  it("renders the button after mounting", async () => {
    let rendered: any;
    await act(async () => {
      rendered = render(<Theme />);
    });
    const button = rendered.getByRole("button", { name: /toggle theme/i });
    expect(button).toBeInTheDocument();
  });

  it("calls setTheme on click without view transition if not supported", async () => {
    document.startViewTransition = undefined as any;
    await act(async () => {
      render(<Theme />);
    });
    const button = screen.getByRole("button", { name: /toggle theme/i });
    
    fireEvent.click(button);
    expect(setThemeMock).toHaveBeenCalledWith("dark");
  });

  it("calls setTheme on click with view transition if supported", async () => {
    await act(async () => {
      render(<Theme />);
    });
    const button = screen.getByRole("button", { name: /toggle theme/i });
    
    button.getBoundingClientRect = jest.fn(() => ({
      left: 0, top: 0, width: 50, height: 50, bottom: 50, right: 50, x: 0, y: 0, toJSON: () => {}
    }));

    fireEvent.click(button);
    
    expect(document.startViewTransition).toHaveBeenCalled();
    expect(setThemeMock).toHaveBeenCalledWith("dark");
  });
});
