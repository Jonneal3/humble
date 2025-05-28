export interface Suggestion {
  text: string;
  category: string;
}

const suggestions: Suggestion[] = [
  { text: "A serene mountain landscape at sunset", category: "nature" },
  { text: "A futuristic city with flying cars", category: "urban" },
  { text: "A cozy cafe interior with warm lighting", category: "interior" },
  { text: "An abstract geometric pattern", category: "abstract" },
  { text: "A magical forest with glowing mushrooms", category: "fantasy" },
  { text: "A minimalist product photography setup", category: "product" },
  { text: "A vintage car on a coastal road", category: "travel" },
  { text: "A cyberpunk street market", category: "urban" },
  { text: "A peaceful garden with butterflies", category: "nature" },
  { text: "A modern office space with plants", category: "interior" },
];

export function getRandomSuggestions(count: number = 3): Suggestion[] {
  const shuffled = [...suggestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
} 