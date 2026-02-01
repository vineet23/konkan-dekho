"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Minus, Plus } from "lucide-react";

export default function ListYourPlotPage() {
  const { toast } = useToast();
  const [properties, setProperties] = useState(1);

  const handlePropertyChange = (value: number) => {
    if (value >= 1 && value <= 50) {
      setProperties(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Listing submitted!",
      description: "We'll review your plot details and get back to you soon.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold font-caveat mb-4">
          Choose Your Plan
        </h2>
        <p className="text-gray-600">
          We offer flexible options to suit your needs.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card className="p-6 flex flex-col">
          <h3 className="text-2xl font-bold mb-2">
            0% Commission + Channel Manager (Subscription)
          </h3>
          <p className="text-gray-500 mb-4">First month only ₹10</p>
          <div className="flex-grow space-y-4">
            <div className="flex items-center space-x-4">
              <Slider
                value={[properties]}
                onValueChange={(value) => handlePropertyChange(value[0])}
                min={1}
                max={50}
                step={1}
              />
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePropertyChange(properties - 1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  className="w-16 text-center"
                  value={properties}
                  onChange={(e) => handlePropertyChange(Number(e.target.value))}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePropertyChange(properties + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Move the slider to get the price adjusted to your number of
              property listings
            </p>
            <div>
              <p className="text-3xl font-bold text-red-500">
                ₹{49 * properties} per month
              </p>
              {/* <p className="text-lg font-semibold">
                Total: ₹{49 * properties} per month
              </p> */}
            </div>
          </div>
        </Card>
        <Card className="p-6 flex flex-col">
          <h3 className="text-2xl font-bold mb-2">Pay-Per-Booking</h3>
          <div className="flex-grow space-y-4">
            <div className="mt-4">
              <p className="text-lg">
                Up to 3 properties{" "}
                <span className="font-bold text-red-500">10%</span> per booking
              </p>
              <p className="text-lg">
                3+ properties <span className="font-bold text-red-500">8%</span>{" "}
                per booking
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-8">
        <h2 className="text-2xl font-semibold mb-6">
          Submit Your Plot/Homestay Details
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label>Owner Name</Label>
              <Input placeholder="Full Name" required />
            </div>
            <div>
              <Label>Contact Number</Label>
              <Input type="tel" placeholder="Phone Number" required />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label>Email Address</Label>
              <Input type="email" placeholder="Email" required />
            </div>
            <div>
              <Label>Plot/Homestay Location</Label>
              <Input placeholder="City/District" required />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label>Plot/Homestay Area (sq ft)</Label>
              <Input type="number" placeholder="Area in square feet" required />
            </div>
            <div>
              <Label>Expected Price (₹)</Label>
              <Input type="number" placeholder="Price in INR" required />
            </div>
          </div>

          <div>
            <Label>Plot/Homestay Description</Label>
            <Textarea
              placeholder="Provide detailed information about your plot..."
              className="min-h-[150px]"
              required
            />
          </div>

          <Button type="submit" className="bg-[#FF385C] hover:bg-[#D93B60]">
            Submit Listing
          </Button>
        </form>
      </Card>
      <br />
      <br />
      <h1 className="text-5xl font-bold font-caveat mb-8">
        List Your Plot/Homestay
      </h1>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Why List with Us?</h2>
          <ul className="space-y-2 text-gray-600">
            <li>• Access to verified buyers</li>
            <li>• Professional property listing</li>
            <li>• Dedicated support team</li>
            <li>• Maximum visibility</li>
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Our Process</h2>
          <ul className="space-y-2 text-gray-600">
            <li>• Submit plot/homestay details</li>
            <li>• Property verification</li>
            <li>• Professional listing creation</li>
            <li>• Active marketing</li>
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Requirements</h2>
          <ul className="space-y-2 text-gray-600">
            <li>• Clear property title</li>
            <li>• Property documents</li>
            <li>• Plot/Homestay photographs</li>
            <li>• Owner details</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
