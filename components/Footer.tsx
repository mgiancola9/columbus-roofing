import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

const cities = [
  "Toronto", "Mississauga", "Brampton", "Vaughan",
  "Oakville", "Markham", "Scarborough", "Oshawa", "Ajax", "Whitby",
];

export default function Footer() {
  return (
    <footer className="bg-[#181B1F] text-white/60">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="grid md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
                  <path d="M3 10.5L12 3L21 10.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V10.5Z" fill="white" />
                </svg>
              </div>
              <span className="text-white font-bold text-base">
                GTARoofing<span className="text-blue-300">Estimates</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6 max-w-xs">
              Connecting GTA homeowners with licensed, vetted roofing contractors.
              Free estimates. No pressure. Real prices.
            </p>
            <div className="flex flex-col gap-3 text-sm">
              <a href="tel:+16479196419" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-4 h-4 flex-shrink-0" />
                (647) 919-6419
              </a>
              <a href="mailto:info@gtaroofingestimates.ca" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="w-4 h-4 flex-shrink-0" />
                info@gtaroofingestimates.ca
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                Greater Toronto Area, Ontario
              </div>
            </div>
          </div>

          {/* Service Areas */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Service Areas</h4>
            <ul className="space-y-2">
              {cities.map((city) => (
                <li key={city}>
                  <Link
                    href={`/estimate?city=${city}`}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/estimate" className="hover:text-white transition-colors">Free Roof Estimate</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Roof Replacement</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Roof Repair</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Metal Roofing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Flat Roofing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Emergency Repair</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>&copy; {new Date().getFullYear()} GTARoofingEstimates.ca · All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
