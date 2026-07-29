import Link from 'next/link';
import { Truck, Mail, Phone, MapPin, ShieldCheck, FileText, RefreshCw } from 'lucide-react';
import { FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';

export function Footer() {
  return (
    <footer className="bg-dark-green text-white pt-16 pb-8 border-t border-pure-green/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pure-green rounded-xl flex items-center justify-center shadow-lg shadow-pure-green/20">
                <Truck className="text-white w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl leading-none tracking-tight">EMISCO</span>
                <span className="text-[9px] uppercase tracking-widest font-bold text-pure-green">Investment Ltd</span>
              </div>
            </Link>
            <p className="text-emerald-100/70 text-sm leading-relaxed">
              Nigeria&apos;s premier sales company for genuine heavy-duty truck spare parts, engine components, gearboxes, and heavy industrial machinery.
            </p>
            <div className="flex gap-3">
              <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-xl bg-emerald-900/60 border border-emerald-700/50 flex items-center justify-center hover:bg-pure-green hover:border-pure-green transition-all">
                <FaFacebook className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-xl bg-emerald-900/60 border border-emerald-700/50 flex items-center justify-center hover:bg-pure-green hover:border-pure-green transition-all">
                <FaInstagram className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-xl bg-emerald-900/60 border border-emerald-700/50 flex items-center justify-center hover:bg-pure-green hover:border-pure-green transition-all">
                <FaTwitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-base mb-6 text-pure-green uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3.5 text-sm text-emerald-100/70 font-medium">
              <li><Link href="/products" className="hover:text-pure-green transition-colors">Browse All Products</Link></li>
              <li><Link href="/categories" className="hover:text-pure-green transition-colors">Spare Part Categories</Link></li>
              <li><Link href="/about" className="hover:text-pure-green transition-colors">About Emisco</Link></li>
              <li><Link href="/contact" className="hover:text-pure-green transition-colors">Contact Sales</Link></li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div>
            <h4 className="font-bold text-base mb-6 text-pure-green uppercase tracking-wider">Legal & Policies</h4>
            <ul className="space-y-3.5 text-sm text-emerald-100/70 font-medium">
              <li>
                <Link href="/terms" className="hover:text-pure-green transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4 text-pure-green" /> Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-pure-green transition-colors flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-pure-green" /> Refund & Repayment Policy
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-pure-green transition-colors flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-pure-green" /> 100% OEM Guarantee
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-base mb-6 text-pure-green uppercase tracking-wider">Lagos Office</h4>
            <ul className="space-y-4 text-sm text-emerald-100/70 font-medium">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-pure-green shrink-0 mt-0.5" />
                <span className="leading-snug">245, Kirikiri Road, Jakande Trailer, Truck Park by Berger Suya Bus Stop, Olodi Apapa, Lagos.</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-pure-green shrink-0" />
                <span>08082013145, 08135580669</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-pure-green shrink-0" />
                <span>support@emiscoinvestment.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-emerald-800/80 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-emerald-100/50">
          <p>© {new Date().getFullYear()} Emisco Investment Limited. All rights reserved. Heavy Duty Parts & Machinery Specialist.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-pure-green transition-colors">Terms of Service</Link>
            <Link href="/refund-policy" className="hover:text-pure-green transition-colors">Repayment Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
