"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-5xl font-caveat font-bold mb-8">
        About Konkan Dekho
      </h1>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
          <p className="text-gray-600 mb-4">
            At Konkan Dekho, we envision transforming the way people discover
            and invest in land properties across the beautiful Konkan region.
            Our platform bridges the gap between property seekers and
            opportunities in this pristine coastal paradise.
          </p>
          <p className="text-gray-600">
            We are committed to transparency, authenticity, and providing
            comprehensive information to help you make informed decisions about
            your land investments.
          </p>
        </div>
        <div className="relative h-[400px]">
          <Image
            src="https://images.unsplash.com/photo-1667807876919-3a493bd565a3"
            alt="Konkan landscape"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
          <p className="text-gray-600">
            To provide a seamless platform for discovering premium land plots
            while ensuring transparency and trust in every transaction.
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Our Values</h3>
          <p className="text-gray-600">
            Integrity, transparency, and customer satisfaction are at the core
            of everything we do.
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Our Promise</h3>
          <p className="text-gray-600">
            We ensure every listed property meets our strict quality standards
            and verification process.
          </p>
        </Card>
      </div>
    </div>
  );
}
