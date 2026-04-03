"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, X, Brain, CloudRain, Zap, ShieldCheck, Lock } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const formatINR = (amount: number) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
}).format(amount);

export default function LandingPage() {
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  return (
    <div className="flex-1 flex items-center justify-center w-full max-w-4xl mx-auto px-6 h-full relative">
      <div className="text-center w-full relative z-10">
        <Badge
          variant="secondary"
          className="mb-8 px-4 py-1.5 bg-blue-100/50 text-blue-700 border border-blue-200/50 shadow-sm font-medium text-sm rounded-full inline-flex mx-auto"
        >
          <span className="mr-1.5">🛡️</span> Powered by AI & Parametric Insurance
        </Badge>

        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold text-gray-900 tracking-tight leading-[1.05] mb-6">
          Protect Your Income{" "}
          <span className="gradient-text block mt-2">Before You Lose It</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-500 mb-10 leading-relaxed max-w-2xl mx-auto">
          AI-powered parametric insurance for gig workers. When bad weather strikes, we pay you automatically &mdash; no claims, no hassle.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/onboarding">
            <Button size="lg" className="h-14 bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-xl text-lg font-semibold shadow-[0_8px_30px_rgba(37,99,235,0.24)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.4)] transition-all hover:-translate-y-1 active:scale-95">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Button 
            onClick={() => setShowHowItWorks(true)}
            size="lg" 
            variant="outline" 
            className="h-14 px-8 rounded-xl text-lg font-semibold border-gray-200 hover:bg-gray-50 text-gray-700"
          >
            See How It Works
          </Button>
        </div>

        {/* Trust badges */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-6 md:gap-10 text-xs md:text-sm font-semibold text-gray-400">
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
            IRDAI Compliant
          </span>
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)]" />
            256-bit Encryption
          </span>
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]" />
            Instant KYC
          </span>
        </div>
      </div>

      {/* Full Screen "How It Works" Overlay */}
      <AnimatePresence>
        {showHowItWorks && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-white overflow-y-auto"
          >
            <div className="max-w-4xl mx-auto px-6 py-12 relative min-h-full flex flex-col">
              
              {/* Close Button */}
              <button 
                onClick={() => setShowHowItWorks(false)}
                className="absolute top-6 right-6 w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors z-10"
              >
                <X className="w-6 h-6 text-gray-700" />
              </button>

              <div className="text-center mb-16 pt-8">
                <Badge className="bg-blue-100 text-blue-700 border-none mb-4 px-3 py-1 font-bold">Deep Dive</Badge>
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                  How SurakshaPay Works
                </h2>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                  A radically new approach to insurance. No paperwork, no adjusters, no waiting.
                </p>
              </div>

              <div className="flex-1 flex flex-col gap-8 pb-12">
                
                {/* Feature 1 */}
                <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-50 rounded-3xl border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Brain className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">1. AI Risk Profiling</h3>
                    <p className="text-gray-600 leading-relaxed mb-3">
                      When you onboard, our AI analyzes your delivery platform (Swiggy, Zomato, etc.) and your primary zone. We pull 14 real-time metrics including historical monsoon severity, AQI levels, and local heatstroke indices to generate a personalized risk score.
                    </p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex flex-col md:flex-row gap-6 p-6 bg-purple-50 rounded-3xl border border-purple-100 hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">2. Dynamic Premium Calculation</h3>
                      Instead of a flat rate, you pay exactly for your risk. Our Dynamic Pricing Engine takes a base premium (e.g., {formatINR(150)}) and multiplies it by your real-time risk factors. High rain probabilities increase the multiplier slightly, ensuring we can guarantee your payout pool.
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex flex-col md:flex-row gap-6 p-6 bg-red-50 rounded-3xl border border-red-100 hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <CloudRain className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">3. Parametric Smart Contracts</h3>
                    <p className="text-gray-600 leading-relaxed mb-3">
                      We monitor official meteorological APIs (like IMD). If rainfall exceeds your policy&apos;s threshold (e.g., &gt;40mm/hr) in your active zone during your delivery hours, the smart contract triggers immediately. <strong>You never have to file a claim.</strong>
                    </p>
                  </div>
                </div>

                {/* Feature 4 */}
                <div className="flex flex-col md:flex-row gap-6 p-6 bg-green-50 rounded-3xl border border-green-100 hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">4. Instant UPI Payouts</h3>
                    <p className="text-gray-600 leading-relaxed mb-3">
                      Once triggered, the system auto-calculates your estimated earnings loss for that period and initiates a transfer to your linked UPI ID. Payouts arrive in under 10 minutes, replacing your lost income while you stay safe indoors.
                    </p>
                  </div>
                </div>

                {/* Feature 5 */}
                <div className="flex flex-col md:flex-row gap-6 p-6 bg-amber-50 rounded-3xl border border-amber-100 hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Lock className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">5. Multi-Layer Fraud Shield</h3>
                    <p className="text-gray-600 leading-relaxed">
                      To prevent abuse, our background systems verify your live GPS location matches the impact zone and ensure your device ID belongs to a known delivery partner. This keeps the insurance pool safe and premiums low for honest gig workers.
                    </p>
                  </div>
                </div>

              </div>
              
              <div className="text-center pt-8 border-t border-gray-100">
                <Button 
                  onClick={() => setShowHowItWorks(false)}
                  className="h-14 bg-gray-900 hover:bg-black text-white px-10 rounded-xl text-lg font-bold shadow-lg"
                >
                  Got It, Let&apos;s Start
                </Button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
