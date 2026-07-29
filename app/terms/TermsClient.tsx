'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShieldAlert, FileText, CheckCircle2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TermsClient() {
  return (
    <div className="py-16 space-y-12">
      {/* Header */}
      <section className="bg-dark-green text-white py-16">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <span className="text-pure-green font-bold text-xs uppercase tracking-[0.3em] mb-3 block">Legal & Compliance</span>
          <h1 className="text-4xl md:text-5xl font-black mb-4">Terms & Conditions</h1>
          <p className="text-emerald-100/70 text-sm md:text-base">
            Please read these Terms of Service carefully before purchasing heavy duty truck spare parts or machinery from Emisco Investment Limited.
          </p>
          <div className="mt-4 text-xs text-pure-green font-semibold">Last Updated: July 2026</div>
        </div>
      </section>

      {/* Content Container */}
      <div className="container mx-auto px-4 max-w-4xl space-y-10 text-foreground">
        
        {/* Crucial Business Clarification Alert */}
        <div className="p-6 rounded-3xl bg-pure-green/10 border border-pure-green/30 space-y-3">
          <div className="flex items-center gap-3 text-pure-green font-extrabold text-base">
            <ShieldAlert className="w-6 h-6 shrink-0 text-pure-green" />
            <span>Important Business Operational Notice</span>
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed font-medium">
            <strong>Emisco Investment Limited</strong> is exclusively a <strong>sales & supply distributor</strong> of heavy-duty truck spare parts, engine assemblies, transmission systems, hydraulics, and heavy industrial machinery. <strong>We are NOT a transport, haulage, or logistics company.</strong> We sell physical spare parts and machinery directly to fleet managers, mechanics, and commercial vehicle owners.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-pure-green" /> 1. General Overview & Agreement
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            By creating an account, browsing our website, or placing an order with Emisco Investment Limited, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must refrain from using our online catalog and ordering services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-pure-green" /> 2. Products, Machinery & Availability
          </h2>
          <ul className="space-y-3 text-sm text-muted-foreground list-disc pl-5 leading-relaxed">
            <li>We specialize in selling genuine OEM and certified replacement parts for commercial heavy duty trucks (including Mack, Volvo, DAF, MAN, Mercedes-Benz, Scania, Isuzu, and Caterpillar).</li>
            <li>All product images, specifications, and part numbers provided on our platform are for identification and purchasing reference.</li>
            <li>Product stock levels and pricing are subject to real-time verification and availability. In the event an item is out of stock after order placement, our team will issue an immediate notification and refund options.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-pure-green" /> 3. Pricing & Payment Terms
          </h2>
          <ul className="space-y-3 text-sm text-muted-foreground list-disc pl-5 leading-relaxed">
            <li>All prices listed are in Nigerian Naira (NGN) and exclude applicable doorstep delivery charges unless specified.</li>
            <li>Payments are securely processed online via Paystack (Debit/Credit Cards, Bank Transfer, USSD).</li>
            <li>Orders will not be dispatched or made available for store pick-up until payment has been fully confirmed by our system.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-pure-green" /> 4. Fulfilment: Store Pick-Up & Dispatch
          </h2>
          <ul className="space-y-3 text-sm text-muted-foreground list-disc pl-5 leading-relaxed">
            <li><strong>Store Pick-Up:</strong> Customers can pick up confirmed orders directly at our Lagos headquarters during working hours (Mon–Sat, 8:00 AM – 5:00 PM) upon presenting their Order Reference ID.</li>
            <li><strong>Nationwide Shipping:</strong> For doorstep or interstate deliveries, shipping is arranged via verified third-party freight couriers. Delivery fees are determined based on package weight, volume, and destination state.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-pure-green" /> 5. Limitation of Liability
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Emisco Investment Limited will not be held liable for mechanical damages or secondary failures resulting from improper installation, unauthorized modification, or uncertified technician handling of purchased parts or machinery. Professional installation by certified heavy vehicle mechanics is strongly recommended.
          </p>
        </section>

        <section className="space-y-4 border-t border-border pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold">Have Questions About Our Terms?</h3>
              <p className="text-xs text-muted-foreground">Contact our support team for any clarification or assistance.</p>
            </div>
            <div className="flex gap-3">
              <Link href="/refund-policy">
                <Button variant="outline" className="rounded-xl border-pure-green/30 text-pure-green">
                  View Refund Policy <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button className="rounded-xl bg-pure-green hover:bg-pure-green-hover text-white">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
