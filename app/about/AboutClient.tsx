'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ShieldCheck, Zap, PenTool, Award, Clock, Users } from 'lucide-react';

export default function AboutClient() {
  return (
    <div className="space-y-32 pb-20">
      {/* Hero Section */}
      <section className="relative py-24 bg-dark-green overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pure-green/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto"
            >
              <span className="text-pure-green font-bold text-sm uppercase tracking-[0.3em] mb-4 block">Our Story</span>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-8">Pioneering Excellence in Truck Logistics</h1>
              <p className="text-emerald-100/70 text-lg md:text-xl leading-relaxed">
                Emisco Investment Limited was founded with a single mission: to provide the African transport industry with immediate access to genuine, high-performance spare parts.
              </p>
            </motion.div>
        </div>
      </section>

      {/* Company Info */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-4/5 relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-pure-green/20">
               <Image 
                 src="/emisco-img.jpg"
                 alt="Emisco Investment Headquarters"
                 fill
                 className="object-cover"
               />
            </div>
            <div className="absolute -bottom-8 -right-8 bg-card border border-border p-8 rounded-3xl shadow-xl hidden sm:block">
               <p className="text-4xl font-bold text-pure-green mb-1">100%</p>
               <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Authentic OEM Guarantee</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <span className="text-pure-green font-bold text-sm uppercase tracking-[0.3em] mb-2 block">Our Vision</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Empowering Commercial Transport Across Nigeria</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                We understand that every hour a truck is off the road translates to lost revenue. That is why Emisco maintains an extensive stock of heavy-duty engine assemblies, transmission gears, and brake systems for Mack, Volvo, DAF, and Mercedes trucks.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4">
               <div className="space-y-2">
                 <div className="w-10 h-10 rounded-xl bg-pure-green/10 flex items-center justify-center text-pure-green">
                    <Award className="w-5 h-5" />
                 </div>
                 <h4 className="font-bold">OEM Sourced</h4>
                 <p className="text-xs text-muted-foreground">Directly imported from verified international suppliers.</p>
               </div>
               <div className="space-y-2">
                 <div className="w-10 h-10 rounded-xl bg-pure-green/10 flex items-center justify-center text-pure-green">
                    <Clock className="w-5 h-5" />
                 </div>
                 <h4 className="font-bold">Fast Fulfillment</h4>
                 <p className="text-xs text-muted-foreground">Immediate pick-up or fast nationwide shipping.</p>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="container mx-auto px-4 py-16 border-t border-border">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Our Core Commitments</h2>
          <p className="text-muted-foreground">Built on integrity, precision engineering, and customer satisfaction.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-card border border-border space-y-4">
             <div className="w-12 h-12 rounded-2xl bg-pure-green/10 flex items-center justify-center text-pure-green">
               <ShieldCheck className="w-6 h-6" />
             </div>
             <h3 className="text-xl font-bold">Uncompromising Quality</h3>
             <p className="text-sm text-muted-foreground leading-relaxed">
               We never sell counterfeit or sub-standard parts. Every item undergoes quality inspection.
             </p>
          </div>

          <div className="p-8 rounded-3xl bg-card border border-border space-y-4">
             <div className="w-12 h-12 rounded-2xl bg-pure-green/10 flex items-center justify-center text-pure-green">
               <Users className="w-6 h-6" />
             </div>
             <h3 className="text-xl font-bold">Customer Partnership</h3>
             <p className="text-sm text-muted-foreground leading-relaxed">
               We work closely with fleet managers, transport firms, and mechanics to fulfill specialized orders.
             </p>
          </div>

          <div className="p-8 rounded-3xl bg-card border border-border space-y-4">
             <div className="w-12 h-12 rounded-2xl bg-pure-green/10 flex items-center justify-center text-pure-green">
               <Zap className="w-6 h-6" />
             </div>
             <h3 className="text-xl font-bold">Rapid Support</h3>
             <p className="text-sm text-muted-foreground leading-relaxed">
               Our technical team provides consultation on part numbers and cross-referencing compatibility.
             </p>
          </div>
        </div>
      </section>
    </div>
  );
}
