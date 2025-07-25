"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "We'll get back to you soon.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-5xl font-caveat font-bold mb-8">Contact Us</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="p-6">
          <MapPin className="h-8 w-8 text-[#FF385C] mb-4" />
          <h2 className="text-xl font-semibold mb-2">Visit Us</h2>
          <p className="text-gray-600">
            102-Omkar Sanjiwani Apartment, Joshi Paland
            <br />
            Ratnagiri, Maharashtra
            <br />
            India - 415612
          </p>
        </Card>

        <Card className="p-6">
          <Clock className="h-8 w-8 text-[#FF385C] mb-4" />
          <h2 className="text-xl font-semibold mb-2">Business Hours</h2>
          <p className="text-gray-600">
            Monday - Friday: 9:00 AM - 6:00 PM
            <br />
            Saturday: 9:00 AM - 2:00 PM
            <br />
            Sunday: Closed
          </p>
        </Card>

        <Card className="p-6">
          <Phone className="h-8 w-8 text-[#FF385C] mb-4" />
          <h2 className="text-xl font-semibold mb-2">Get in Touch</h2>
          <p className="text-gray-600">
            Phone:
            <br />
            +91 9082046979
            <br />
            +91 9834069861
            <br />
            +91 7021761113
            <br />
            <br />
            Email:
            <br />
            vineetpatel.developer@gmail.com
            <br />
            advaitkulkarni301@gmail.com
          </p>
        </Card>
      </div>

      <Card className="mt-12 p-8">
        <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          <div>
            <Input placeholder="Your Name" required />
          </div>
          <div>
            <Input type="email" placeholder="Email Address" required />
          </div>
          <div className="md:col-span-2">
            <Input placeholder="Subject" required />
          </div>
          <div className="md:col-span-2">
            <Textarea
              placeholder="Your Message"
              className="min-h-[150px]"
              required
            />
          </div>
          <div className="md:col-span-2">
            <Button type="submit" className="bg-[#FF385C] hover:bg-[#D93B60]">
              Send Message
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
