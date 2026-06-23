import { Experience } from "../types";

export const experiences: Experience[] = [
  {
    id: 1,
    name: "Scuba Diving in Malvan",
    slug: "scuba-diving-in-malvan",
    description: "Experience the mesmerizing underwater world of the Konkan coast. Our certified instructors will guide you through the beautiful coral reefs and vibrant marine life near Sindhudurg Fort. Perfect for beginners and experienced divers alike. Safety gear, brief training, and underwater photos are included in the package.",
    rate: "₹2,500",
    guideline: "Participants must be physically fit. Please avoid heavy meals before diving. Children below 10 years are not allowed.",
    language: ["English", "Marathi", "Hindi"],
    photos: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1682687982501-1e58b814714c?q=80&w=2070&auto=format&fit=crop"
    ],
    location: "Malvan, Sindhudurg",
    phone: "9876543210"
  },
  {
    id: 2,
    name: "Mangrove Safari at Ratnagiri",
    slug: "mangrove-safari-at-ratnagiri",
    description: "Take a peaceful boat ride through the lush green mangroves of Ratnagiri. Witness diverse bird species, unique flora, and the tranquil backwaters of the Konkan region. The guided tour offers insights into the local ecosystem and the importance of mangrove conservation.",
    rate: "₹800",
    guideline: "Carry sunglasses and hats. Keep noise levels low to avoid disturbing the wildlife.",
    language: ["Marathi", "Hindi"],
    photos: [
      "https://images.unsplash.com/photo-1628126235206-5260b9ea6441?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop"
    ],
    location: "Ratnagiri",
    phone: "9876543211"
  },
  {
    id: 3,
    name: "Authentic Konkani Cooking Masterclass",
    slug: "authentic-konkani-cooking-masterclass",
    description: "Learn to cook authentic Konkani dishes like Sol Kadhi, Fish Curry, and Modak from a local expert. This hands-on experience includes selecting fresh ingredients, understanding local spices, and enjoying the meal you prepare together in a traditional Konkani home.",
    rate: "₹1,500",
    guideline: "Please inform us of any food allergies in advance.",
    language: ["English", "Marathi"],
    photos: [
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop"
    ],
    location: "Ganpatipule",
    phone: "9876543212"
  }
];
