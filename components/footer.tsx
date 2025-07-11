import { Phone, Mail } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center space-x-2">
              <Image
                src="/image/logo.svg"
                alt="Konkan Dekho"
                width={48}
                height={48}
              />
              <span className="text-4xl font-bold text-[#FF385C] font-caveat self-end">
                Konkan Dekho
              </span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Your trusted partner in finding the perfect plot of land in the beautiful Konkan region.
            </p>
          </div>

          {/* Explore Links */}
          <div>
            <h3 className="text-sm font-semibold">Explore</h3>
            <ul className="mt-4 space-y-2">
              {[
                { href: "/explore/all-plots", text: "All Plots" },
                { href: "/explore/featured-locations", text: "Featured Locations" },
                { href: "/explore/how-it-works", text: "How We Work" },
                { href: "/explore/list-your-plot", text: "List Your Plot" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-[#FF385C]"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold">Company</h3>
            <ul className="mt-4 space-y-2">
              {[
                { href: "/about", text: "About Us" },
                { href: "/team", text: "Our Team" },
                { href: "/testimonials", text: "Testimonials" },
                { href: "/contact", text: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-[#FF385C]"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold">Contact Us</h3>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+91 123 456 7890</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span className="text-sm">info@konkandekho.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t pt-8 border-border">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Konkan Dekho. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
