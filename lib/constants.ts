export const industryOptions = ["Construction", "E-commerce", "Consulting", "Healthcare", "Real Estate", "Education", "Professional Services"];

export const budgetRanges = [
  "Under $500 / Under PHP 25,000",
  "$500 - $1,500 / PHP 25,000 - PHP 75,000",
  "$1,500 - $3,000 / PHP 75,000 - PHP 150,000",
  "$3,000+ / PHP 150,000+"
];

export const contactMethods = ["Email", "Phone Call", "Viber", "Messenger", "WhatsApp"];

export const countryOptions = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "New Zealand",
  "Singapore",
  "United Arab Emirates",
  "Saudi Arabia",
  "Qatar",
  "Philippines",
  "India",
  "Germany",
  "France",
  "Netherlands",
  "South Africa",
  "Other / Prefer not to say"
] as const;

export const timezoneOptions = [
  "UTC-8 | Pacific Time (US/Canada)",
  "UTC-7 | Mountain Time (US/Canada)",
  "UTC-6 | Central Time (US/Canada)",
  "UTC-5 | Eastern Time (US/Canada)",
  "UTC | United Kingdom / GMT",
  "UTC+1 | Central Europe",
  "UTC+3 | Gulf Standard Time",
  "UTC+5:30 | India Standard Time",
  "UTC+8 | Singapore / Philippines",
  "UTC+10 | Australia Eastern Time",
  "UTC+12 | New Zealand Time",
  "Flexible / Will coordinate later"
] as const;

export const countryTimezoneMap: Partial<Record<(typeof countryOptions)[number], string>> = {
  "United States": "UTC-5 | Eastern Time (US/Canada)",
  Canada: "UTC-5 | Eastern Time (US/Canada)",
  "United Kingdom": "UTC | United Kingdom / GMT",
  Australia: "UTC+10 | Australia Eastern Time",
  "New Zealand": "UTC+12 | New Zealand Time",
  Singapore: "UTC+8 | Singapore / Philippines",
  "United Arab Emirates": "UTC+3 | Gulf Standard Time",
  "Saudi Arabia": "UTC+3 | Gulf Standard Time",
  Qatar: "UTC+3 | Gulf Standard Time",
  Philippines: "UTC+8 | Singapore / Philippines",
  India: "UTC+5:30 | India Standard Time",
  Germany: "UTC+1 | Central Europe",
  France: "UTC+1 | Central Europe",
  Netherlands: "UTC+1 | Central Europe"
};
