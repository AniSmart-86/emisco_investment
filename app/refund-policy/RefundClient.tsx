'use client';

import Link from 'next/link';
import { RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RefundClient() {
  return (
    <div className="py-16 space-y-12">
      {/* Header */}
      <section className="bg-dark-green text-white py-16">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <span className="text-pure-green font-bold text-xs uppercase tracking-[0.3em] mb-3 block">Customer Guarantees</span>
          <h1 className="text-4xl md:text-5xl font-black mb-4">Refund & Repayment Policy</h1>
          <p className="text-emerald-100/70 text-sm md:text-base">
            Our transparent return, replacement, and repayment policy for all heavy duty truck spare parts and heavy machinery purchases.
          </p>
          <div className="mt-4 text-xs text-pure-green font-semibold">Effective Date: July 2026</div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 max-w-4xl space-y-10 text-foreground">

        {/* 7-Day Guarantee Banner */}
        <div className="p-6 rounded-3xl bg-dark-green text-white space-y-4 border border-pure-green/30">
          <div className="flex items-center gap-3 text-pure-green font-bold text-lg">
            <ShieldCheck className="w-7 h-7 shrink-0 text-pure-green" />
            <span>7-Day Quality Inspection & Return Window</span>
          </div>
          <p className="text-sm text-emerald-100/80 leading-relaxed">
            At <strong>Emisco Investment Limited</strong>, we stand behind the quality of every heavy-duty component and machinery part we sell. If you receive a wrong part, damaged component, or factory defect, you may request a replacement, refund, or credit repayment within <strong>7 days</strong> of receipt.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-pure-green" /> 1. Eligibility for Return & Repayment
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            To qualify for a return, replacement, or repayment refund:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5 leading-relaxed">
            <li>The item must be in its original, uninstalled condition with all OEM packaging, tags, and documentation intact.</li>
            <li>The claim must be initiated within 7 calendar days of picking up your order or receiving delivery.</li>
            <li>You must present your original Emisco Order Receipt or Order Reference ID.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-pure-green" /> 2. Technical Inspection & Verification
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Before any refund or repayment is issued, returned components (e.g., engines, gearboxes, electrical sensors, hydraulic pumps) must be inspected at our Lagos technical workshop.
          </p>
          <div className="p-4 rounded-2xl bg-muted/50 border border-border text-xs text-muted-foreground space-y-2">
            <p className="font-semibold text-foreground">Items Ineligible for Return or Refund:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Parts damaged by incorrect installation, welding, overheating, or unauthorized modification.</li>
              <li>Electrical or electronic parts that have been plugged in or short-circuited by improper wiring.</li>
              <li>Custom-machined or specially ordered heavy industrial machinery parts unless defective from factory.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-pure-green" /> 3. Repayment & Refund Methods
          </h2>
          <ul className="space-y-3 text-sm text-muted-foreground list-disc pl-5 leading-relaxed">
            <li><strong>Bank Transfer / Paystack Refund:</strong> Approved refunds will be remitted to your bank account or original card via Paystack within <strong>3 to 5 business days</strong> following inspection approval.</li>
            <li><strong>Store Credit Repayment:</strong> Customers can opt for immediate store credit toward future purchases of alternative spare parts or machinery components.</li>
            <li><strong>Direct Replacement:</strong> If preferred, we will immediately dispatch an exact replacement component from our warehouse at no additional cost.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" /> 4. Shipping & Logistics Expenses for Returns
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5 leading-relaxed">
            <li>If the return is due to an error on our part (e.g. wrong part shipped or defective component), <strong>Emisco covers all return shipping fees</strong>.</li>
            <li>If the return is due to customer error (e.g. ordering the incorrect part number for their vehicle), the customer is responsible for logistics costs.</li>
          </ul>
        </section>

        {/* CTA */}
        <section className="border-t border-border pt-8 text-center space-y-4">
          <h3 className="text-xl font-bold">Need to Initiate a Return or Request a Repayment?</h3>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Contact our Lagos customer care team directly with your order reference number and our representatives will assist you promptly.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link href="/contact">
              <Button size="lg" className="bg-pure-green hover:bg-pure-green-hover text-white rounded-2xl font-bold">
                Contact Customer Support <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/terms">
              <Button size="lg" variant="outline" className="rounded-2xl border-border font-bold">
                Read Terms & Conditions
              </Button>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
