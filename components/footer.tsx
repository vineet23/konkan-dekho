import { Phone, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
              Your trusted partner in finding the perfect homestays & plot of
              land in the beautiful Konkan region.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Explore</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/explore/all-plots"
                  className="text-sm text-gray-600 hover:text-[#FF385C]"
                >
                  All Homestays
                </Link>
              </li>
              <li>
                <Link
                  href="/explore/featured-locations"
                  className="text-sm text-gray-600 hover:text-[#FF385C]"
                >
                  Featured Locations
                </Link>
              </li>
              <li>
                <Link
                  href="/explore/how-it-works"
                  className="text-sm text-gray-600 hover:text-[#FF385C]"
                >
                  How We Work
                </Link>
              </li>
              <li>
                <Link
                  href="/explore/list-your-plot"
                  className="text-sm text-gray-600 hover:text-[#FF385C]"
                >
                  List Your Plot/Homestay
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-600 hover:text-[#FF385C]"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/team"
                  className="text-sm text-gray-600 hover:text-[#FF385C]"
                >
                  Our Team
                </Link>
              </li>
              <li>
                <Link
                  href="/testimonials"
                  className="text-sm text-gray-600 hover:text-[#FF385C]"
                >
                  Testimonials
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-600 hover:text-[#FF385C]"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/blogs"
                  className="text-sm text-gray-600 hover:text-[#FF385C]"
                >
                  Blogs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Contact Us</h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">+91 9834069861</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  advaitkulkarni301@gmail.com
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
