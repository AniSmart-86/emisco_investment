'use client';

import { MapPin, Phone, Mail, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
            <span className="text-pure-green font-bold text-sm uppercase tracking-[0.3em] mb-4 block">Get In Touch</span>
            <h1 className="text-3xl md:text-7xl font-bold mb-8">Contact Our Experts</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto italic">
              Whether you need a rare part or technical advice, our team at Kirikiri Road is ready to assist you.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-dark-green text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-pure-green/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
               <MapPin className="text-pure-green w-10 h-10 mb-8" />
               <h3 className="text-2xl font-bold mb-4 text-emerald-100">Head Office</h3>
               <p className="text-emerald-100/60 leading-relaxed font-medium">
                 245, Kirikiri Road, Jakande Trailer,<br />
                 Truck Park by Berger Suya Bus Stop,<br />
                 Olodi Apapa, Lagos.
               </p>
            </div>

            <div className="bg-card border border-border p-10 rounded-[2.5rem] shadow-sm">
               <Phone className="text-pure-green w-10 h-10 mb-8" />
               <h3 className="text-2xl font-bold mb-4">Telephone</h3>
               <div className="space-y-2">
                  <a href="tel:08082013145" className="block text-xl font-bold hover:text-pure-green hover:translate-x-1 transition-all">Dail: 0808 201 3145</a>
                  <a href="tel:08135580669" className="block text-xl font-bold hover:text-pure-green hover:translate-x-1 transition-all">Dail: 0813 558 0669</a>
               </div>
            </div>

            <div className="bg-muted/30 p-10 rounded-[2.5rem] border border-border/50">
               <Mail className="text-pure-green w-10 h-10 mb-8" />
               <h3 className="text-2xl font-bold mb-4">Email Support</h3>
               <a href="mailto:info@emisco.com" className="text-muted-foreground font-bold hover:text-pure-green decoration-pure-green underline underline-offset-4 decoration-2">info@emisco.com</a>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border p-3 md:p-8 rounded-[3rem] shadow-2xl relative">
               <h2 className="text-2xl font-bold mb-8 flex items-center justify-center gap-3">
                 Send a Message <MessageSquare className="text-pure-green w-6 h-6" />
               </h2>
               <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => {
                 e.preventDefault();
                 alert('Message sent successfully!');
               }}>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Full Name</label>
                    <input required className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-pure-green/50" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Phone Number</label>
                    <input required className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-pure-green/50" placeholder="+234..." />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Email Address</label>
                    <input required type="email" className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-pure-green/50" placeholder="john@example.com" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Your Message</label>
                    <textarea required rows={4} className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-pure-green/50 resize-none" placeholder="How can we help your fleet today?" />
                  </div>
                  <div className="md:col-span-2 pt-4">
                    <Button size="lg" className="w-full bg-pure-green hover:bg-pure-green-hover text-white py-8 rounded-2xl text-xl font-bold group">
                      Send Message Now
                      <Send className="ml-3 w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Button>
                  </div>
               </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
