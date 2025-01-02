"use client";

import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Suresh Kumar",
    location: "Mumbai",
    rating: 5,
    text: "Found my dream plot through Konkan Dekho. The process was smooth and transparent.",
    plotLocation: "Ratnagiri",
  },
  {
    name: "Meera Shah",
    location: "Pune",
    rating: 5,
    text: "Excellent service and very professional team. They helped me find the perfect investment opportunity.",
    plotLocation: "Sindhudurg",
  },
  {
    name: "Rahul Desai",
    location: "Thane",
    rating: 4,
    text: "Great platform for finding land in Konkan. Very detailed information and helpful support.",
    plotLocation: "Raigad",
  },
];

export default function TestimonialsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-5xl font-caveat font-bold mb-8">
        Client Testimonials
      </h1>
      <p className="text-gray-600 mb-12 max-w-3xl">
        Read what our clients say about their experience with Konkan Dekho.
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.name} className="p-6">
            <div className="flex mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 fill-[#FF385C] text-[#FF385C]"
                />
              ))}
            </div>
            <p className="text-gray-600 mb-4">{testimonial.text}</p>
            <div className="border-t pt-4">
              <p className="font-semibold">{testimonial.name}</p>
              <p className="text-sm text-gray-600">{testimonial.location}</p>
              <p className="text-sm text-[#FF385C]">
                Plot in {testimonial.plotLocation}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
