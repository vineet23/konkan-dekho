import { Phone, Mail } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
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
            <p className="mt-4 text-sm text-gray-600">
              Your trusted partner in finding the perfect plot of land in the
              beautiful Konkan region.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Explore</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="/explore/all-plots"
                  className="text-sm text-gray-600 hover:text-[#FF385C]"
                >
                  All Plots
                </a>
              </li>
              <li>
                <a
                  href="/explore/featured-locations"
                  className="text-sm text-gray-600 hover:text-[#FF385C]"
                >
                  Featured Locations
                </a>
              </li>
              <li>
                <a
                  href="/explore/how-it-works"
                  className="text-sm text-gray-600 hover:text-[#FF385C]"
                >
                  How We Work
                </a>
              </li>
              <li>
                <a
                  href="/explore/list-your-plot"
                  className="text-sm text-gray-600 hover:text-[#FF385C]"
                >
                  List Your Plot
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="/about"
                  className="text-sm text-gray-600 hover:text-[#FF385C]"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/team"
                  className="text-sm text-gray-600 hover:text-[#FF385C]"
                >
                  Our Team
                </a>
              </li>
              <li>
                <a
                  href="/testimonials"
                  className="text-sm text-gray-600 hover:text-[#FF385C]"
                >
                  Testimonials
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-sm text-gray-600 hover:text-[#FF385C]"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Contact Us</h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">+91 123 456 7890</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  info@konkandekho.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8">
          <p className="text-center text-sm text-gray-600">
            © {new Date().getFullYear()} Konkan Dekho. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
