import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import NativeStreakWidget from "../components/pages/NativeStreakWidget";

// Mock the CSS file import to prevent Jest from breaking
jest.mock("../styles/Calendar.css", () => ({}), { virtual: true });

describe("NativeStreakWidget", () => {
  beforeEach(() => {
    // Clear mocks before each test
    global.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        total_count: 0,
        contributions: [],
      }),
    })) as jest.Mock;
    Storage.prototype.getItem = jest.fn(() => null);
    Storage.prototype.setItem = jest.fn();
  });

  it("renders the loading skeleton initially", async () => {
    // Prevent state updates by hanging the fetch for this test
    (global.fetch as jest.Mock).mockImplementationOnce(() => new Promise(() => {}));
    
    render(<NativeStreakWidget />);
    // Checking for the skeleton element class
    expect(screen.getByTestId("streak-skeleton")).toBeInTheDocument();
  });

  it("fetches and displays the correct streak data", async () => {
    // Mock the fetch response for github stats
    const mockData = {
      totalContributions: 1500,
      contributions: [
        [{ date: "2020-01-01T00:00:00.000Z", contributionCount: 5 }],
      ],
      currentStreak: {
        days: 14,
      },
      longestStreak: {
        days: 30,
      }
    };

    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes("/api/github/stats")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            commits: mockData,
            prs: { total_count: 0 },
            issues: { total_count: 0 },
          }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({}),
      });
    });

    render(<NativeStreakWidget />);

    await waitFor(() => {
      expect(screen.getByText("1500")).toBeInTheDocument(); // total commits
      expect(screen.getByText("1")).toBeInTheDocument();    // longest streak (1 day in mock)
      expect(screen.getAllByText("0").length).toBeGreaterThanOrEqual(2); // PRs and Issues
    });
  });
});
