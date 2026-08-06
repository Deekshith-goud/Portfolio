import { readTime } from "../utils/readTime";

describe("readTime function", () => {
  it("calculates exactly 1 minute for 185 words", () => {
    const text = new Array(185).fill("word").join(" ");
    expect(readTime(text)).toBe("1 min");
  });

  it("calculates 2 minutes for 370 words", () => {
    const text = new Array(370).fill("word").join(" ");
    expect(readTime(text)).toBe("2 min");
  });

  it("calculates 0 min for very short text", () => {
    expect(readTime("Hello world")).toBe("0 min");
  });

  it("handles extra spaces properly", () => {
    const text = "  Just    a    few   words  ";
    expect(readTime(text)).toBe("0 min");
  });
});
