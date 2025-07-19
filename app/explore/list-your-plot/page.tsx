"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

export default function ListYourPlotPage() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Listing submitted!",
      description: "We'll review your plot details and get back to you soon.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-16">
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
    </div>
  );
}
