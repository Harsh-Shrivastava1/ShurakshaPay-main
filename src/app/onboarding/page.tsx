"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Shield, ArrowRight, MapPin, User, Briefcase, CheckCircle2, Loader2 } from "lucide-react";
import { useSuraksha } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";

const platforms = [
  { value: "swiggy", label: "Swiggy", icon: "🛵" },
  { value: "zomato", label: "Zomato", icon: "🔴" },
  { value: "amazon", label: "Amazon Flex", icon: "📦" },
  { value: "zepto", label: "Zepto", icon: "⚡" },
];

const steps = ["Details", "Platform", "Zone"];

export default function OnboardingPage() {
  const router = useRouter();
  const { registerUser } = useSuraksha();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    employeeId: "",
    platform: "",
    location: "",
  });

  const handleContinue = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      // Register and navigate to dashboard
      setIsLoading(true);
      registerUser({
        name: form.name,
        platform: form.platform,
        employeeId: form.employeeId,
        location: form.location,
      });
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    }
  };

  const isStepValid = () => {
    if (step === 0) return form.name.trim().length > 1 && form.employeeId.trim().length > 0;
    if (step === 1) return form.platform !== "";
    if (step === 2) return form.location.trim().length > 1;
    return false;
  };

  // Loading interstitial
  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center w-full px-4 h-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-blue-100/50">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Setting up your policy...</h2>
          <p className="text-gray-500 text-sm">Analyzing risk profile for {form.location}</p>
          
          <div className="mt-8 flex items-center justify-center gap-3 text-sm text-gray-400">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Profile created</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Risk analyzed</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Policy activated</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full px-4 h-full">
      <div className="w-full max-w-md">
        
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                  i < step
                    ? "bg-green-500 text-white"
                    : i === step
                    ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                    : "bg-white border border-gray-200 text-gray-400"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </div>
              <span className={`text-xs font-semibold ${i === step ? "text-blue-700" : "text-gray-400"}`}>
                {s}
              </span>
              {i < steps.length - 1 && (
                <div className={`w-6 h-[2px] rounded-full mx-1 ${i < step ? "bg-green-400" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <Card className="border border-gray-200 shadow-2xl rounded-3xl bg-white/70 backdrop-blur-xl w-full">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              {/* Step 0: Details */}
              {step === 0 && (
                <motion.div
                  key="step-0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 bg-blue-50/80 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100/50">
                      <User className="w-7 h-7 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Enter your details</h2>
                  </div>
                  <div className="space-y-4">
                    <Input
                      placeholder="Enter full name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="h-14 rounded-xl border-gray-200 focus:border-blue-600 focus:ring-blue-600 text-lg shadow-inner bg-gray-50/50"
                      autoFocus
                    />
                    <Input
                      placeholder="Enter employee ID"
                      value={form.employeeId}
                      onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                      className="h-14 rounded-xl border-gray-200 focus:border-blue-600 focus:ring-blue-600 text-lg shadow-inner bg-gray-50/50"
                    />
                    <p className="text-center text-gray-400 text-xs mt-3 font-medium">
                      This will appear on your policy documents.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Step 1: Platform */}
              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 bg-purple-50/80 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-100/50">
                      <Briefcase className="w-7 h-7 text-purple-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Select Platform</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {platforms.map((p) => (
                      <button
                        key={p.value}
                        onClick={() => setForm({ ...form, platform: p.value })}
                        className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-3 ${
                          form.platform === p.value
                            ? "border-blue-600 bg-blue-50/50 shadow-sm"
                            : "border-gray-100 bg-white hover:border-gray-200"
                        }`}
                      >
                        <span className="text-xl">{p.icon}</span>
                        <span className={`text-sm font-bold ${form.platform === p.value ? "text-blue-800" : "text-gray-600"}`}>
                          {p.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Location */}
              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 bg-green-50/80 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-green-100/50">
                      <MapPin className="w-7 h-7 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Delivery Zone</h2>
                  </div>
                  <div>
                    <Input
                      placeholder="e.g. Mumbai, Andheri West"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="h-14 rounded-xl border-gray-200 focus:border-blue-600 focus:ring-blue-600 text-lg shadow-inner bg-gray-50/50"
                      autoFocus
                    />
                    <p className="text-center text-gray-400 text-xs mt-3 font-medium">
                      Used to monitor weather events in your specific area.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              onClick={handleContinue}
              disabled={!isStepValid()}
              className="w-full mt-8 h-14 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-base transition-all active:scale-[0.98] shadow-lg disabled:opacity-50"
            >
              {step === 2 ? "Activate Policy" : "Continue"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>

        {/* Secure Note */}
        <div className="flex items-center justify-center gap-1.5 mt-6 text-gray-400 text-xs font-semibold">
          <Shield className="w-3 h-3" />
          Data encrypted & secure
        </div>
      </div>
    </div>
  );
}
