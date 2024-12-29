"use client";

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">How It Works</h1>
      
      <div className="grid md:grid-cols-4 gap-8 mb-16">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#FF385C] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            1
          </div>
          <h2 className="text-xl font-semibold mb-2">Browse Plots</h2>
          <p className="text-gray-600">
            Explore our extensive collection of premium land plots across the Konkan region
          </p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-[#FF385C] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            2
          </div>
          <h2 className="text-xl font-semibold mb-2">Filter & Compare</h2>
          <p className="text-gray-600">
            Use our advanced filters to find plots that match your specific requirements
          </p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-[#FF385C] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            3
          </div>
          <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
          <p className="text-gray-600">
            Get in touch with our experts for detailed information and site visits
          </p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-[#FF385C] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            4
          </div>
          <h2 className="text-xl font-semibold mb-2">Secure Your Plot</h2>
          <p className="text-gray-600">
            Complete the purchase process with our guidance and support
          </p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">How do I schedule a site visit?</h3>
            <p className="text-gray-600">
              You can request a site visit through our contact form or by calling us directly. 
              Our team will arrange the visit at your convenience.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">What documents are required for purchase?</h3>
            <p className="text-gray-600">
              Required documents typically include identity proof, address proof, and PAN card. 
              Our team will guide you through the complete documentation process.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Do you provide legal assistance?</h3>
            <p className="text-gray-600">
              Yes, we have a team of legal experts who will assist you throughout the purchase 
              process and ensure all documentation is properly handled.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}