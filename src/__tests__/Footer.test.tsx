import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import Footer from "../components/global/Footer";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ fill, priority, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}));

// Mock UnmountStudio
jest.mock("../components/global/Unmount", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock next/dynamic
jest.mock("next/dynamic", () => () => {
  return function MockAudioPlayer() {
    return <div data-testid="audio-player">Audio</div>;
  };
});

describe("Footer Component", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, count: 100, position: 50 }),
      })
    ) as jest.Mock;
    
    const mockStorage: any = {
      getItem: jest.fn(() => "a".repeat(64)), 
      setItem: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: mockStorage, writable: true });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders the built-with links and footer text", async () => {
    await act(async () => {
      render(<Footer />);
    });
    
    expect(screen.getByText("Sanity")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
    expect(screen.getByText("Vercel")).toBeInTheDocument();
    expect(screen.getByText(/All rights Reserved/i)).toBeInTheDocument();
  });

  it("fetches and displays the visitor metrics correctly", async () => {
    render(<Footer />);
    
    await waitFor(() => {
      expect(screen.getByText("50")).toBeInTheDocument();
      expect(screen.getByText("100")).toBeInTheDocument();
      expect(screen.getByText("visitors")).toBeInTheDocument();
    });
    
    expect(global.fetch).toHaveBeenCalledWith("/api/visitor", expect.any(Object));
  });

  it("renders the AudioPlayer dynamically", async () => {
    await act(async () => {
      render(<Footer />);
    });
    expect(screen.getByTestId("audio-player")).toBeInTheDocument();
  });
});
