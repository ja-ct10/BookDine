import {
  validateTimeFormat,
  validateOperatingHours,
  validatePasswordComplexity,
} from "@/lib/validation";

describe("validateTimeFormat", () => {
  it("should accept valid time format HH:mm", () => {
    expect(validateTimeFormat("14:30")).toBe(true);
    expect(validateTimeFormat("09:00")).toBe(true);
    expect(validateTimeFormat("00:00")).toBe(true);
    expect(validateTimeFormat("23:59")).toBe(true);
  });

  it("should reject invalid time formats", () => {
    expect(validateTimeFormat("2:30")).toBe(false);
    expect(validateTimeFormat("14:30:00")).toBe(false);
    expect(validateTimeFormat("25:00")).toBe(false);
    expect(validateTimeFormat("14:60")).toBe(false);
    expect(validateTimeFormat("24:00")).toBe(false);
    expect(validateTimeFormat("abc")).toBe(false);
    expect(validateTimeFormat("")).toBe(false);
  });
});

describe("validateOperatingHours", () => {
  it("should accept times within 11:00 AM - 9:00 PM", () => {
    expect(validateOperatingHours("11:00")).toBe(true);
    expect(validateOperatingHours("21:00")).toBe(true);
    expect(validateOperatingHours("15:30")).toBe(true);
    expect(validateOperatingHours("12:00")).toBe(true);
    expect(validateOperatingHours("20:59")).toBe(true);
  });

  it("should reject times outside operating hours", () => {
    expect(validateOperatingHours("10:59")).toBe(false);
    expect(validateOperatingHours("21:01")).toBe(false);
    expect(validateOperatingHours("09:00")).toBe(false);
    expect(validateOperatingHours("22:00")).toBe(false);
    expect(validateOperatingHours("00:00")).toBe(false);
  });

  it("should reject invalid time formats", () => {
    expect(validateOperatingHours("25:00")).toBe(false);
    expect(validateOperatingHours("abc")).toBe(false);
  });
});

describe("validatePasswordComplexity", () => {
  it("should accept passwords meeting all requirements", () => {
    expect(validatePasswordComplexity("Password123!").success).toBe(true);
    expect(validatePasswordComplexity("Secure@Pass1").success).toBe(true);
    expect(validatePasswordComplexity("MyP@ssw0rd").success).toBe(true);
    expect(validatePasswordComplexity("Test1234!@#$").success).toBe(true);
  });

  it("should reject passwords missing uppercase letter", () => {
    const result = validatePasswordComplexity("password123!");
    expect(result.success).toBe(false);
    expect(result.error).toContain("uppercase");
  });

  it("should reject passwords missing lowercase letter", () => {
    const result = validatePasswordComplexity("PASSWORD123!");
    expect(result.success).toBe(false);
    expect(result.error).toContain("lowercase");
  });

  it("should reject passwords missing number", () => {
    const result = validatePasswordComplexity("Password!@#$");
    expect(result.success).toBe(false);
    expect(result.error).toContain("number");
  });

  it("should reject passwords missing special character", () => {
    const result = validatePasswordComplexity("Password123");
    expect(result.success).toBe(false);
    expect(result.error).toContain("special character");
  });

  it("should reject passwords that are too short", () => {
    const result1 = validatePasswordComplexity("Pass1!");
    expect(result1.success).toBe(false);
    expect(result1.error).toContain("8 characters");
    
    const result2 = validatePasswordComplexity("Pw1!");
    expect(result2.success).toBe(false);
    expect(result2.error).toContain("8 characters");
  });

  it("should reject empty password", () => {
    const result = validatePasswordComplexity("");
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
