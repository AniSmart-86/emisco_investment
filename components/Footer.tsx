import Link from 'next/link';
import { Truck, Mail, Phone, MapPin } from 'lucide-react';
import { FaTwitter, FaFacebook,  FaInstagram } from 'react-icons/fa'
export function Footer() {
  return (
    <footer className="bg-dark-green text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-pure-green rounded-xl flex items-center justify-center">
                <Truck className="text-white w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl leading-none">EMISCO</span>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-pure-green">Investment Ltd</span>
              </div>
            </Link>
            <p className="text-emerald-100/70 text-sm leading-relaxed">
              Professional supplier of heavy-duty truck parts including engines, gearboxes, and spare parts. We deliver quality and durability.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center hover:bg-pure-green transition-colors">
                <FaFacebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center hover:bg-pure-green transition-colors">
                <FaInstagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center hover:bg-pure-green transition-colors">
                <FaTwitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-pure-green">Quick Links</h4>
            <ul className="space-y-4 text-sm text-emerald-100/70">
              <li><Link href="/products" className="hover:text-pure-green transition-colors">All Products</Link></li>
              <li><Link href="/categories" className="hover:text-pure-green transition-colors">Categories</Link></li>
              <li><Link href="/about" className="hover:text-pure-green transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-pure-green transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-pure-green">Top Brands</h4>
            <ul className="space-y-4 text-sm text-emerald-100/70">
              <li><Link href="/products?category=mack" className="hover:text-pure-green transition-colors">Mack</Link></li>
              <li><Link href="/products?category=man" className="hover:text-pure-green transition-colors">MAN Diesel</Link></li>
              <li><Link href="/products?category=daf" className="hover:text-pure-green transition-colors">DAF</Link></li>
              <li><Link href="/products?category=scania" className="hover:text-pure-green transition-colors">Scania</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-pure-green">Contact Info</h4>
            <ul className="space-y-4 text-sm text-emerald-100/70">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-pure-green shrink-0" />
                <span>245, Kirikiri Road, Jakande Trailer, Truck Park by Berger Suya Bus Stop, Olodi Apapa, Lagos.</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-pure-green shrink-0" />
                <span>08082013145, 08135580669</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-pure-green shrink-0" />
                <span>info@emisco.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-emerald-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-emerald-100/40">
          <p>© 2026 Emisco Investment Limited. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-pure-green">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-pure-green">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
