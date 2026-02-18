// Hero component with form submission
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Ship, Phone, CheckCircle, Instagram, ExternalLink } from 'lucide-react';

const Hero = () => {  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Save to Supabase
      if (supabase) {
        const { error } = await supabase.from('cruise_inquiries').insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
          },
        ]);
        if (error) throw error;
      }

      // 2. Trigger mailto: V1 fallback as requested
      const mailtoLink = `mailto:yolanda@example.com?subject=New Cruise Inquiry from ${formData.name}&body=Name: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0APhone: ${formData.phone}%0D%0AMessage: ${formData.message}`;
      window.location.href = mailtoLink;

      setIsSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center bg-sand-50 overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-600/5 -skew-x-12 transform translate-x-20 hidden lg:block" />

      <div className="container mx-auto px-6 py-12 lg:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-600/10 text-emerald-600 text-sm font-medium mb-6">
              <Ship size={16} />
              <span>Certified Cruise Specialist</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-navy-900 leading-[1.1] mb-6">
              Let\'s Plan Your <br />
              <span className="text-emerald-600">Dream Cruise</span>
            </h1>

            <p className="text-xl text-slate-600 mb-8 max-w-lg leading-relaxed">
              Yolanda here! With 20 years of expertise, I help you navigate the world\'s best waters. From Royal Caribbean to luxury river cruises, let\'s make your next voyage legendary.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gold-500 flex items-center justify-center text-white">
                  <Instagram size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Follow the journey</p>
                  <p className="font-bold text-navy-900">@rjsmom1 on TikTok</p>
                </div>
              </div>

              <div className="h-10 w-px bg-slate-200 hidden sm:block" />

              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Client" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                  500+
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-8 rounded-3xl shadow-2xl shadow-navy-900/10 border border-slate-100"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-2">Start Your Voyage</h2>
              <p className="text-slate-500">Fill out the form below and I\'ll get back to you within 24 hours.</p>
            </div>

            {isSuccess ? (
              <div className="py-12 text-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-2xl font-bold text-navy-900 mb-2">Message Sent!</h3>
                <p className="text-slate-500 mb-6">I\'ve received your inquiry and will be in touch soon.</p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="text-emerald-600 font-semibold hover:underline"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="555-000-0000"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition-all"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    How can I help you?
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell me about your dream destination, dates, or group size..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition-all resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-900/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Submitting...' : <>Plan My Trip <ExternalLink size={18} /></>}
                </button>

                <p className="text-center text-xs text-slate-400 mt-4">
                  By submitting, you agree to our Privacy Policy.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
