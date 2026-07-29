'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck, Zap, PenTool, Award, Clock, Users, Wrench,
  CheckCircle2, ArrowRight, Package, AlertCircle, Cpu, Cog
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AboutClient() {
  return (
    <div className="space-y-24 pb-20 overflow-x-hidden">

      {/* ══════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════ */}
      <section className="relative py-24 bg-dark-green overflow-hidden">
        <div className="absolute top-0 right-0 w-125 h-125 bg-pure-green/10 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pure-green/10 text-pure-green text-xs font-bold uppercase tracking-widest border border-pure-green/20">
              <span className="w-2 h-2 rounded-full bg-pure-green animate-pulse" />
              Heavy Duty Spare Parts & Machinery Sales Specialist
            </span>

            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
              Nigeria&apos;s Trusted Distributor of{' '}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-pure-green to-emerald-400">
                Heavy Duty Parts & Machinery
              </span>
            </h1>

            <p className="text-emerald-100/70 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              Emisco Investment Limited is a premier sales company supplying 100% genuine OEM heavy-duty truck components, engine assemblies, transmission systems, and heavy industrial machinery.
            </p>
          </motion.div>
        </div>
      </section>

     

      {/* ══════════════════════════════════════════════
          WHAT WE SELL (PRODUCTS & MACHINERY)
      ══════════════════════════════════════════════ */}
      <section className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-pure-green font-bold text-xs uppercase tracking-[0.3em] block">Our Sales Portfolio</span>
          <h2 className="text-3xl md:text-5xl font-bold">What We Sell & Supply</h2>
          <p className="text-muted-foreground">Comprehensive inventory of genuine truck parts and industrial equipment.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: 'Heavy Truck Engine Parts',
              desc: 'Complete engine assemblies, crankshafts, cylinder heads, pistons, camshafts, turbochargers, and fuel injection systems.',
              icon: Cpu,
              brands: 'Mack, Volvo, DAF, MAN, Mercedes',
            },
            {
              title: 'Gearboxes & Transmission',
              desc: 'Manual and automatic transmissions, clutch pressure plates, flywheel assemblies, torque converters, and gear selectors.',
              icon: Cog,
              brands: 'Eaton Fuller, ZF, Mack, Allison',
            },
            {
              title: 'Heavy Industrial Machinery',
              desc: 'Sales of earthmoving equipment parts, excavator hydraulic pumps, wheel loader spares, caterpillar plant machinery components.',
              icon: Wrench,
              brands: 'Caterpillar, Komatsu, JCB, Hitachi',
            },
            {
              title: 'Axles, Brakes & Suspension',
              desc: 'Brake shoes, air brake valves, brake drums, leaf springs, shock absorbers, differential assemblies, and wheel hubs.',
              icon: ShieldCheck,
              brands: 'Meritor, SAF-Holland, BPW',
            },
            {
              title: 'Filters & Electrical Systems',
              desc: 'Heavy-duty oil, air, and fuel filters, alternators, starter motors, wiring harnesses, control units, and sensors.',
              icon: Zap,
              brands: 'Donaldson, Fleetguard, Bosch',
            },
            {
              title: 'Cooling & Body Accessories',
              desc: 'Heavy-duty radiators, intercoolers, water pumps, fan blades, mirrors, headlamps, bumpers, and cabin fittings.',
              icon: Package,
              brands: 'Behr, Valeo, Genuine OEM',
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-card border border-border/80 hover:border-pure-green/40 transition-colors space-y-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-pure-green/10 flex items-center justify-center text-pure-green group-hover:bg-pure-green group-hover:text-white transition-colors duration-300">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              <div className="pt-2 border-t border-border/50 text-xs font-semibold text-pure-green">
                Compatible Brands: {item.brands}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          ABOUT THE COMPANY & FOUNDATION
      ══════════════════════════════════════════════ */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-4/3 relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-pure-green/20">
              <Image
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80"
                alt="Emisco Warehouse & Spare Parts Yard"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-card border border-border p-6 rounded-3xl shadow-xl hidden sm:block">
              <p className="text-3xl font-black text-pure-green mb-1">100%</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Authentic OEM Guarantee</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <span className="text-pure-green font-bold text-xs uppercase tracking-[0.3em] block">Our Heritage</span>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">Serving Commercial Fleets & Machinery Operators</h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              Founded in Lagos, Nigeria, <strong>Emisco Investment Limited</strong> has grown to become a cornerstone supplier for heavy transportation fleets, construction sites, and mechanical workshops across West Africa.
            </p>
            <p className="text-muted-foreground text-base leading-relaxed">
              We understand that vehicle downtime directly impacts profitability. That is why we stock over 5,000 active part numbers directly imported from certified manufacturers in Europe, America, and Asia.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
                <div className="text-2xl font-black text-pure-green">5,000+</div>
                <div className="text-xs text-muted-foreground font-semibold">Active Parts In Stock</div>
              </div>
              <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
                <div className="text-2xl font-black text-pure-green">12+ Years</div>
                <div className="text-xs text-muted-foreground font-semibold">Industry Sales Experience</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CORE COMMITMENTS
      ══════════════════════════════════════════════ */}
      <section className="bg-card border-y border-border py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-pure-green font-bold text-xs uppercase tracking-[0.3em] block">Our Promise</span>
            <h2 className="text-3xl md:text-4xl font-bold">Why Buy From Emisco?</h2>
            <p className="text-muted-foreground">Built on integrity, product knowledge, and fast fulfillment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-background border border-border/60 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-pure-green/10 flex items-center justify-center text-pure-green">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Zero Counterfeit Guarantee</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We strictly reject knockoffs or sub-standard imitations. Every component sold comes with our full authenticity guarantee.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-background border border-border/60 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-pure-green/10 flex items-center justify-center text-pure-green">
                <PenTool className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Part Identification Experts</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Not sure about a part number? Our technical specialists cross-reference VINs and engine codes to ensure exact fitment.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-background border border-border/60 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-pure-green/10 flex items-center justify-center text-pure-green">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Immediate Pickup & Dispatch</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Pick up directly from our Lagos store or we ship via verified freight partners to any state across Nigeria.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CALL TO ACTION
      ══════════════════════════════════════════════ */}
      <section className="container mx-auto px-4">
        <div className="rounded-[3rem] bg-dark-green text-white p-10 md:p-16 text-center space-y-6 relative overflow-hidden border border-pure-green/20">
          <h2 className="text-3xl md:text-5xl font-black">Ready to Order Genuine Truck Parts?</h2>
          <p className="text-emerald-100/70 max-w-xl mx-auto text-base">
            Browse our complete digital catalog or speak directly with our Lagos sales desk today.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <Link href="/products">
              <Button size="lg" className="bg-pure-green hover:bg-pure-green-hover text-white rounded-2xl font-bold px-8 py-6 text-base">
                Shop Spare Parts <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-2xl font-bold px-8 py-6 text-base">
                Contact Sales Desk
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
