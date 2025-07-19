"use client";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail } from "lucide-react";

export function ContactForm() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Form submitted!",
      description: "We'll get back to you soon.",
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold">Book Now</h2>
      <p className="mt-2 text-sm text-gray-600">
        Interested in this homestay? Fill out the form below and we'll get back
        to you.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <Input placeholder="Your Name" required />
        </div>
        <div>
          <Input type="email" placeholder="Email Address" required />
        </div>
        <div>
          <Input type="tel" placeholder="Phone Number" required />
        </div>
        <div>
          <Textarea
            placeholder="Your Message"
            className="min-h-[100px]"
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-[#FF385C] hover:bg-[#D93B60]"
        >
          Send Message
        </Button>
      </form>

      <div className="mt-6 space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="mr-2 h-4 w-4" />
          +91 9834069861
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="mr-2 h-4 w-4" />
          advaitkulkarni301@gmail.com
        </div>
      </div>
    </Card>
  );
}
