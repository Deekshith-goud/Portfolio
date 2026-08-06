import { formatDate } from "../utils/date";

describe("formatDate", () => {
  it("formats an ISO date string to a localized short date string", () => {
    const formatted = formatDate("2024-01-15T12:00:00.000Z");
    expect(formatted).toBe("Jan 15, 2024");
  });
  
  it("handles standard date strings correctly", () => {
    const formatted = formatDate("2022-12-25");
    expect(typeof formatted).toBe("string");
    expect(formatted.length).toBeGreaterThan(0);
  });
});
