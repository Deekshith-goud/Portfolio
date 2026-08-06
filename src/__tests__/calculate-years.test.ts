import { getGitHubYears } from "../utils/calculate-years";

describe("getGitHubYears", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns empty array if joinYear is undefined", () => {
    expect(getGitHubYears(undefined)).toEqual([]);
  });

  it("returns array of years from current year down to joinYear", () => {
    jest.useFakeTimers().setSystemTime(new Date("2024-06-01T00:00:00Z"));
    
    const years = getGitHubYears(2020);
    expect(years).toEqual([2024, 2023, 2022, 2021, 2020]);
  });

  it("returns single year array if joinYear is the current year", () => {
    jest.useFakeTimers().setSystemTime(new Date("2024-06-01T00:00:00Z"));
    
    const years = getGitHubYears(2024);
    expect(years).toEqual([2024]);
  });
});
