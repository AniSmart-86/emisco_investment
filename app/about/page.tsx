'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ShieldCheck, Zap, PenTool, Award, Clock, Users } from 'lucide-react';

export default function AboutPage() {
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

      {/* CEO Section */}
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
                 src="/emisco-img.jpg" // Fallback if generation failed
                 alt="CEO of Emisco"
                 fill
                 className="object-cover"
               />
            </div>
            <div className="absolute -bottom-8 -right-8 bg-pure-green text-white p-12 rounded-[2.5rem] shadow-2xl hidden md:block">
               <div className="text-4xl font-bold mb-1">5+</div>
               <div className="text-xs font-bold uppercase tracking-widest opacity-80">Years of Experience</div>
            </div>
          </motion.div>

          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold mb-6">A Letter from our CEO</h2>
              <div className="w-20 h-1.5 bg-pure-green rounded-full mb-8" />
              <p className="text-muted-foreground text-lg leading-relaxed italic">
                &quot;At Emisco, we don&apos;t just sell parts; we sell uptime. We understand that every hour a truck spends off the road is an hour of lost revenue for our clients. That&apos;s why we&apos;ve built a supply chain that prioritizes speed and authenticity above all else.&quot;
              </p>
            </div>
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                 <Award className="text-pure-green w-6 h-6" />
               </div>
               <div>
                 <div className="font-bold text-xl">Micheal Chukwuemeka</div>
                 <div className="text-sm text-pure-green font-bold uppercase tracking-widest">CEO</div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Breakdown */}
      <section className="bg-muted/30 py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Core Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide end-to-end support for logistics fleets, from part identification to express delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: ShieldCheck, 
                title: 'Authenticity Guarantee', 
                desc: 'Every engine, gearbox, and cylinder head in our inventory is sourced directly from manufacturers like Mack, Volvo, and Scania.' 
              },
              { 
                icon: Zap, 
                title: 'Express Logistics', 
                desc: 'We operate our own dedicated delivery fleet to ensure that critical parts reach your trailer park within hours, not days.' 
              },
              { 
                icon: PenTool, 
                title: 'Technical Consultation', 
                desc: 'Our staff consists of trained heavy-duty mechanics who help you identify exact part compatibility before purchase.' 
              },
              { 
                icon: Clock, 
                title: '24/7 Support', 
                desc: 'Transport never sleeps, and neither do we. Our emergency support lines are open around the clock for platinum clients.' 
              },
              { 
                icon: Users, 
                title: 'Wholesale Supply', 
                desc: 'We provide bulk pricing and inventory management for large logistics firms with fleets of 50+ vehicles.' 
              },
              { 
                icon: Award, 
                title: 'Warranty Support', 
                desc: 'All electrical and mechanical components come with a standard 12-month manufacturer warranty for peace of mind.' 
              },
            ].map((service, i) => (
              <div key={i} className="bg-card p-10 rounded-3xl border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 group">
                <div className="w-14 h-14 bg-pure-green/10 rounded-2xl flex items-center justify-center mb-6 text-pure-green group-hover:bg-pure-green group-hover:text-white transition-colors">
                  <service.icon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
