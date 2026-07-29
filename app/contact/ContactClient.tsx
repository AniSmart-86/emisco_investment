'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Send, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { EMISCO_OFFICE_ADDRESS } from '@/lib/logistics-data';

export default function ContactClient() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message');

      toast.success('Message sent! Our team will contact you soon.');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
       toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-pure-green font-bold text-sm uppercase tracking-[0.3em] mb-4 block">Get In Touch</span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Contact Our Experts</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Have questions about spare part compatibility, pricing, or bulk order delivery? Reach out to our technical team today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Contact Info Cards */}
          <div className="space-y-6">
            <div className="p-8 rounded-3xl bg-card border border-border space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-pure-green/10 flex items-center justify-center text-pure-green">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg">Office & Store Location</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{EMISCO_OFFICE_ADDRESS}</p>
            </div>

            <div className="p-8 rounded-3xl bg-card border border-border space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-pure-green/10 flex items-center justify-center text-pure-green">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg">Working Hours</h3>
              <p className="text-sm text-muted-foreground">Monday – Saturday: 8:00 AM – 5:00 PM</p>
              <p className="text-xs text-pure-green font-semibold">Sunday: Closed</p>
            </div>

            <div className="p-8 rounded-3xl bg-card border border-border space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-pure-green/10 flex items-center justify-center text-pure-green">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg">Email & Phone</h3>
              <p className="text-sm text-muted-foreground">support@emiscoinvestment.com</p>
              <p className="text-sm font-bold text-pure-green">+234 (0) 800 000 0000</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 p-8 md:p-12 rounded-[2.5rem] bg-card border border-border shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full bg-background border border-border rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-pure-green/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full bg-background border border-border rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-pure-green/50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+234..."
                  className="w-full bg-background border border-border rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-pure-green/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">
                  Message / Inquiry
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about the parts or assistance you need..."
                  className="w-full bg-background border border-border rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-pure-green/50 resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-pure-green hover:bg-pure-green-hover text-white py-6 rounded-2xl text-lg font-bold shadow-xl shadow-pure-green/20 flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Sending Message…' : 'Send Message'}
                <Send className="w-5 h-5 ml-1" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
