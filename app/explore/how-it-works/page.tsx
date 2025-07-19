"use client";

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-5xl font-caveat font-bold mb-8">How We Work</h1>

      <div className="grid md:grid-cols-4 gap-8 mb-16">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#FF385C] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            1
          </div>
          <h2 className="text-xl font-semibold mb-2">Explore Stays</h2>
          <p className="text-gray-600">
            Discover a curated selection of authentic Konkan homestays with
            stunning views and local charm.
          </p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-[#FF385C] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            2
          </div>
          <h2 className="text-xl font-semibold mb-2">Check Amenities</h2>
          <p className="text-gray-600">
            Filter stays by your preferred amenities like sea view, pet-friendly
            options, or nearby attractions.
          </p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-[#FF385C] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            3
          </div>
          <h2 className="text-xl font-semibold mb-2">Contact Host</h2>
          <p className="text-gray-600">
            Reach out to our verified hosts directly for questions,
            availability, or custom requirements.
          </p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-[#FF385C] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            4
          </div>
          <h2 className="text-xl font-semibold mb-2">Book Your Stay</h2>
          <p className="text-gray-600">
            Finalize your booking securely and get ready to experience true
            Konkan hospitality.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-3xl font-caveat font-semibold mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">
              How do I book a homestay?
            </h3>
            <p className="text-gray-600">
              Simply explore listings, contact the host, and once you confirm
              the details, we’ll help you complete the booking.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">
              Are meals included in the stay?
            </h3>
            <p className="text-gray-600">
              Some homestays offer meals, while others have kitchens or nearby
              restaurants. Details are mentioned on each listing.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">
              Is it safe and verified?
            </h3>
            <p className="text-gray-600">
              Yes, all our homestays are verified by our local team. We also
              collect reviews and ratings from past guests.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
