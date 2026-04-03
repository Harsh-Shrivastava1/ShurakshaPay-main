"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ShieldCheck,
  IndianRupee,
  Activity,
  CloudRain,
  TrendingUp,
  Clock,
  Check,
  CheckCircle2,
  Zap,
  RotateCcw,
  Loader2,
  Shield,
  MapPin,
  Sparkles,
  FileText,
  X,
  LineChart as LineChartIcon,
  Upload,
  Calendar,
  AlertTriangle
} from "lucide-react";
import { useSuraksha, formatINR, TRIGGER_CONFIG, type TriggerType, type Claim, type ClaimStep } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";

const chartData = [
  { week: "W1", protected: 5000, actual: 4800 },
  { week: "W2", protected: 5000, actual: 5100 },
  { week: "W3", protected: 5000, actual: 4200 },
  { week: "W4", protected: 5000, actual: 2800 },
  { week: "W5", protected: 5000, actual: 4900 },
  { week: "W6", protected: 5000, actual: 5300 },
  { week: "W7", protected: 5000, actual: 4600 },
  { week: "W8", protected: 5000, actual: 5000 },
];

const CLAIM_STEPS: { key: ClaimStep; label: string }[] = [
  { key: "detected", label: "Claim Detected" },
  { key: "validating", label: "Validation in Progress" },
  { key: "approved", label: "Claim Approved" },
  { key: "payout", label: "Payout Processed" },
];

function getStepIndex(status: ClaimStep): number {
  return CLAIM_STEPS.findIndex(s => s.key === status);
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. TOP METRICS RIBBON
// ─────────────────────────────────────────────────────────────────────────────

function TopMetricsRibbon() {
  const { state } = useSuraksha();
  const [showFlash, setShowFlash] = useState(false);
  const prevPayoutsRef = useState(state.totalPayouts)[0];

  useEffect(() => {
    if (state.totalPayouts > 0 && state.totalPayouts !== prevPayoutsRef) {
      setShowFlash(true);
      const t = setTimeout(() => setShowFlash(false), 2000);
      return () => clearTimeout(t);
    }
  }, [state.totalPayouts, prevPayoutsRef]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* Policy Card */}
      <Card className="border border-indigo-200 shadow-lg rounded-2xl overflow-hidden relative bg-gradient-to-br from-indigo-600 to-blue-700 text-white">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mt-10 -mr-10" />
        <CardContent className="p-6 relative z-10 flex flex-col justify-between h-full hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-bold text-indigo-50 uppercase tracking-widest drop-shadow-sm">
                Monsoon Shield {state.policy.tier === "Pro" && <span className="text-yellow-300 ml-1">PRO</span>}
              </p>
            </div>
            <Badge className="bg-green-400/20 text-green-100 border border-green-400/50 text-[10px] px-2 py-0.5 uppercase tracking-wide font-bold">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5 animate-pulse" />
              {state.policy.status}
            </Badge>
          </div>
          <div>
            <p className="text-3xl font-black tabular-nums drop-shadow-md">{formatINR(state.policy.coverageAmount)}<span className="text-base font-semibold opacity-80">/day</span></p>
            <p className="text-xs font-semibold text-indigo-100 mt-1 opacity-90 tracking-wide">Parametric Protection</p>
          </div>
        </CardContent>
      </Card>

      {/* Payouts Card */}
      <Card className={`border border-gray-100 shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md ${showFlash ? "success-flash" : "bg-white"}`}>
        <CardContent className="p-6 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Payouts</p>
            <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center border border-green-100">
              <IndianRupee className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <div>
            <motion.p
              key={state.totalPayouts}
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              className="text-3xl font-black text-gray-900 tabular-nums"
            >
              {formatINR(state.totalPayouts)}
            </motion.p>
            <div className="flex items-center gap-1.5 mt-1.5 px-2 py-1 bg-green-50 rounded-md w-max">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
              <span className="text-xs font-bold text-green-700">{state.claims.filter(c => c.status === "payout").length} claims settled</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Earnings Protected */}
      <Card className="border border-gray-100 shadow-sm rounded-2xl bg-white transition-all duration-300 hover:shadow-md">
        <CardContent className="p-6 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Earnings Protected</p>
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div>
            <motion.p
              key={state.totalEarningsProtected}
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              className="text-3xl font-black text-gray-900 tabular-nums"
            >
              {formatINR(state.totalEarningsProtected)}
            </motion.p>
            <div className="flex items-center gap-1.5 mt-1.5 px-2 py-1 bg-blue-50 rounded-md w-max">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-xs font-bold text-blue-700">100% Target Met</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overview Risk Score */}
      <Card className="border border-gray-100 shadow-sm rounded-2xl bg-white transition-all duration-300 hover:shadow-md">
        <CardContent className="p-6 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Risk Level</p>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
              state.risk.score >= 75 ? "bg-red-50 text-red-600 border-red-100" : state.risk.score >= 55 ? "bg-orange-50 text-orange-600 border-orange-100" : "bg-green-50 text-green-600 border-green-100"
            }`}>
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-3xl font-black text-gray-900 tabular-nums">{state.risk.score}%</p>
              <Badge className={`text-[10px] px-2 py-0.5 font-bold uppercase tracking-wide border ${
                state.risk.level === "Critical" ? "bg-red-100 text-red-700 border-red-200" :
                state.risk.level === "High" ? "bg-orange-100 text-orange-700 border-orange-200" :
                state.risk.level === "Medium" ? "bg-yellow-100 text-yellow-700 border-yellow-200" :
                "bg-green-100 text-green-700 border-green-200"
              }`}>
                {state.risk.level}
              </Badge>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full transition-colors ${
                  state.risk.score >= 75 ? "bg-red-500" : state.risk.score >= 55 ? "bg-orange-500" : state.risk.score >= 35 ? "bg-yellow-500" : "bg-green-500"
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${state.risk.score}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. MAIN ANALYTICS & SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────

function EarningsChartSection() {
  return (
    <Card className="border border-gray-100 shadow-sm rounded-3xl overflow-hidden h-full flex flex-col bg-white hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-0 border-b border-gray-50/50 bg-white pt-6 px-7">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-gray-900">Earnings Projection</CardTitle>
            <p className="text-sm text-gray-500 font-medium mt-1">Real-time baseline vs actuals (8-week)</p>
          </div>
          <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 text-gray-500">
             <LineChartIcon className="w-5 h-5" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 bg-white">
        <div className="h-[320px] w-full pt-6 pr-6 pb-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorProtected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }} dx={-10} />
              <Tooltip
                contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', padding: '14px 18px' }}
                formatter={(value) => [formatINR(Number(value)), ""]}
              />
              <Area type="monotone" dataKey="protected" stroke="#22c55e" strokeWidth={3} strokeDasharray="6 6" fill="url(#colorProtected)" name="Protected Baseline" />
              <Area type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={3.5} fill="url(#colorActual)" name="Actual + Payouts" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function CompactEnvironmentalSidebar() {
  const { state } = useSuraksha();

  const metrics = [
    { label: "Rainfall", value: state.env.rainfall, max: 60, unit: "mm/h", color: "bg-blue-500" },
    { label: "AQI Level", value: state.env.aqi, max: 500, unit: "", color: "bg-orange-500" },
    { label: "Heat Index", value: state.env.temperature, max: 55, unit: "°C", color: "bg-red-500" },
  ];

  return (
    <Card className="border border-gray-100 shadow-sm rounded-3xl bg-white sticky top-4 hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-4 px-7 pt-6 border-b border-gray-50/50">
        <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
          <CloudRain className="w-4 h-4 text-blue-500" />
          Live Telemetry
        </CardTitle>
      </CardHeader>
      <CardContent className="px-7 pb-7 pt-5 space-y-6">
        {metrics.map(m => (
          <div key={m.label}>
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{m.label}</span>
              <span className="text-sm font-black text-gray-900">{m.value}<span className="text-xs font-bold text-gray-400 ml-0.5">{m.unit}</span></span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${m.color}`}
                animate={{ width: `${Math.min(100, (m.value / m.max) * 100)}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>
        ))}

        <div className="pt-5 border-t border-gray-100 mt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gray-900 rounded-md">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <span className="text-sm font-black text-gray-900 tracking-tight">AI Fraud Engine</span>
            </div>
            <Badge className={`text-[9px] px-2 py-0.5 font-bold uppercase tracking-widest border ${
                state.fraud.status === "Flagged" ? "bg-red-50 text-red-700 border-red-200" :
                state.fraud.status === "Medium Risk" ? "bg-orange-50 text-orange-700 border-orange-200" :
                "bg-green-50 text-green-700 border-green-200"
              }`}>
                {state.fraud.status === "Flagged" ? "⚠ Review" : state.fraud.status === "Medium Risk" ? "⚡ Alert" : "✓ Secure"}
            </Badge>
          </div>
          
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 font-bold uppercase tracking-wider">Model Confidence</span>
              <span className={`font-black ${state.fraud.status === 'Flagged' ? 'text-red-600' : 'text-green-600'}`}>
                {state.fraud.status === 'Flagged' ? '42.8%' : '98.9%'}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 font-bold uppercase tracking-wider">Device Fingerprint</span>
              <span className="font-bold text-gray-900 text-[10px] bg-gray-200 px-1.5 py-0.5 rounded">F2-A9X-OK</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 font-bold uppercase tracking-wider">Geo-Velocity</span>
              <span className="font-bold text-gray-900">Normal</span>
            </div>
            
            <div className="h-px bg-gray-200 w-full my-1" />
            
            <p className="text-[10px] text-gray-500 font-semibold leading-relaxed font-mono">
              {state.fraud.status === "Flagged" 
                ? "> ERR: ANOMALOUS_TRIGGER_FREQ detected. Auto-settlement paused. Risk pipeline engaged."
                : "> SYS: ML monitoring active. Behavior patterns nominal. Auto-settlement cleared."
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. ACTIONS & CLAIMS SECTION
// ─────────────────────────────────────────────────────────────────────────────

function ActiveClaimProgress({ claim }: { claim: Claim }) {
  const currentStep = getStepIndex(claim.status);

  return (
    <Card className="border border-blue-200 shadow-lg shadow-blue-500/10 bg-blue-50/30 rounded-3xl overflow-hidden mb-6">
      <div className="bg-blue-600 text-white px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm font-bold tracking-widest uppercase">
          <Loader2 className={`w-4 h-4 ${claim.status !== "payout" ? "animate-spin" : ""}`} />
          {claim.status === "payout" ? "CLAIM SETTLED SUCCESSFULLY" : "PROCESSING CLAIM"}
        </div>
        <span className="text-xs font-bold bg-blue-500/50 px-2.5 py-1 rounded-md border border-blue-400/50">{claim.id}</span>
      </div>
      <CardContent className="p-8">
        <div className="flex items-center gap-1 w-full max-w-3xl mx-auto">
          {CLAIM_STEPS.map((step, i) => {
            const isCompleted = i <= currentStep;
            const isCurrent = i === currentStep;
            return (
              <div key={step.key} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <motion.div
                    animate={{
                      backgroundColor: isCompleted ? (step.key === "payout" ? "#22c55e" : "#2563eb") : "#e2e8f0",
                      scale: isCurrent ? 1.25 : 1,
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md z-10 transition-colors border-[3px] ${isCompleted ? 'border-transparent' : 'border-white'}`}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : i + 1}
                  </motion.div>
                  <p className={`text-[11px] sm:text-xs mt-3 font-bold text-center uppercase tracking-wide leading-tight transition-colors ${
                    isCompleted ? "text-gray-900" : "text-gray-400"
                  }`}>
                    {step.label}
                  </p>
                </div>
                {i < CLAIM_STEPS.length - 1 && (
                  <div className="h-1.5 flex-1 bg-gray-200 rounded-full mx-2 mt-[-32px] overflow-hidden drop-shadow-sm">
                    <motion.div
                      animate={{ width: isCompleted ? "100%" : "0%" }}
                      className="h-full bg-blue-600 rounded-full"
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function ClaimsHistoryTable() {
  const { state } = useSuraksha();

  return (
    <Card className="border border-gray-100 shadow-sm rounded-3xl bg-white overflow-hidden h-full hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-4 border-b border-gray-50 px-7 pt-6 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-bold text-gray-900">Claims History</CardTitle>
          <p className="text-sm text-gray-500 font-medium mt-1">Recent automated and manual requests</p>
        </div>
        <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 text-gray-500">
           <Clock className="w-5 h-5" />
        </div>
      </CardHeader>
      
      {state.claims.length === 0 ? (
        <CardContent className="p-12 text-center flex flex-col items-center justify-center h-48">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 border border-gray-100 shadow-sm">
            <Shield className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-1">No Claims Yet</h3>
          <p className="text-gray-500 text-sm max-w-sm">Simulate a disruption or file a manual claim to start building history.</p>
        </CardContent>
      ) : (
        <div className="divide-y divide-gray-50/80 bg-white">
          {state.claims.slice(0, 8).map((claim) => (
            <div key={claim.id} className="p-5 px-7 flex items-center justify-between hover:bg-gray-50/50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border transition-colors ${
                  claim.status === "payout"
                    ? "bg-green-50 border-green-100 group-hover:bg-green-100"
                    : "bg-blue-50 border-blue-100 group-hover:bg-blue-100"
                }`}>
                  {claim.status === "payout" ? (
                    <span className="text-2xl">{claim.icon || "✓"}</span>
                  ) : (
                    <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-base">{claim.type}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-gray-500 font-bold tracking-wide">
                      {claim.timestamp.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">{claim.id}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-black text-xl tabular-nums ${claim.status === "payout" ? "text-green-600" : "text-blue-600"}`}>
                  {formatINR(claim.amount)}
                </p>
                <div className="flex items-center justify-end gap-1.5 mt-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${claim.status === "payout" ? "bg-green-500" : "bg-blue-500"}`} />
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    {claim.status === "payout" ? "Paid" : claim.status === "approved" ? "Approved" : "Processing"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function TriggerSimulator() {
  const { triggerEvent, resetEnvironment } = useSuraksha();
  const [lastTriggered, setLastTriggered] = useState<string | null>(null);

  const handleTrigger = useCallback((type: TriggerType) => {
    setLastTriggered(type);
    triggerEvent(type);
    setTimeout(() => setLastTriggered(null), 1000);
  }, [triggerEvent]);

  const triggers: { type: TriggerType; color: string; hoverColor: string; ringColor: string }[] = [
    { type: "heavy_rain", color: "bg-blue-50 text-blue-700 border-blue-200", hoverColor: "hover:bg-blue-100 hover:shadow-md hover:-translate-y-1", ringColor: "ring-blue-400" },
    { type: "high_aqi", color: "bg-orange-50 text-orange-700 border-orange-200", hoverColor: "hover:bg-orange-100 hover:shadow-md hover:-translate-y-1", ringColor: "ring-orange-400" },
    { type: "extreme_heat", color: "bg-red-50 text-red-700 border-red-200", hoverColor: "hover:bg-red-100 hover:shadow-md hover:-translate-y-1", ringColor: "ring-red-400" },
    { type: "demand_drop", color: "bg-indigo-50 text-indigo-700 border-indigo-200", hoverColor: "hover:bg-indigo-100 hover:shadow-md hover:-translate-y-1", ringColor: "ring-indigo-400" },
  ];

  return (
    <Card className="border border-gray-100 shadow-sm rounded-3xl bg-white hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-4 border-b border-gray-50 px-7 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-50 rounded-xl border border-yellow-100">
               <Zap className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-gray-900">Live Triggers</CardTitle>
              <p className="text-xs text-gray-500 font-medium mt-0.5">Simulate automatic detection</p>
            </div>
          </div>
          <Button
            onClick={resetEnvironment}
            variant="outline"
            size="sm"
            className="h-8 rounded-lg text-xs font-bold text-gray-600 bg-white shadow-sm border-gray-200"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-7">
        <div className="grid grid-cols-2 gap-4">
          {triggers.map(({ type, color, hoverColor, ringColor }) => {
            const config = TRIGGER_CONFIG[type];
            const isActive = lastTriggered === type;
            return (
              <button
                key={type}
                onClick={() => handleTrigger(type)}
                className={`relative flex items-center gap-3 p-4 rounded-2xl border transition-all duration-200 ${color} ${hoverColor} ${
                  isActive ? `ring-2 ring-offset-2 ${ringColor} scale-95` : ""
                }`}
              >
                <span className="text-3xl drop-shadow-sm">{config.icon}</span>
                <span className="text-xs font-bold text-left leading-tight">{config.label}</span>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-green-500 rounded-full shadow-lg border-2 border-white flex items-center justify-center"
                  >
                    <Check className="w-3 h-3 text-white" />
                  </motion.div>
                )}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN DASHBOARD COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { state, dispatch } = useSuraksha();
  
  // Claim Form State
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimReason, setClaimReason] = useState("");
  const [claimAmount, setClaimAmount] = useState("");
  const [claimDate, setClaimDate] = useState("");
  const [declareTrue, setDeclareTrue] = useState(false);
  const [isSubmittingTracking, setIsSubmittingTracking] = useState(false);

  // Upgrade Modal State
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showDowngradeModal, setShowDowngradeModal] = useState(false);

  const userName = state.user.isRegistered ? state.user.name : "User";

  const handleManualClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimReason || !claimAmount || !declareTrue || !claimDate) return;
    setIsSubmittingTracking(true);

    setTimeout(() => {
      const claimId = `MNL-${Math.floor(1000 + Math.random() * 9000)}`;
      const amount = Number(claimAmount);
      const claim: Claim = {
        id: claimId,
        type: "Manual Claim",
        icon: "📝",
        status: "validating",
        amount: amount,
        timestamp: new Date(),
        description: claimReason,
      };

      dispatch({ type: "ADD_CLAIM", payload: claim });
      dispatch({ type: "SET_ACTIVE_CLAIM", payload: claim });

      setTimeout(() => {
        dispatch({ type: "UPDATE_CLAIM_STATUS", payload: { id: claimId, status: "approved" } });
      }, 2000);

      setTimeout(() => {
        dispatch({ type: "COMPLETE_PAYOUT", payload: { claimId, amount } });
      }, 4000);

      setIsSubmittingTracking(false);
      setShowClaimForm(false);
      setClaimReason("");
      setClaimAmount("");
      setClaimDate("");
      setDeclareTrue(false);
    }, 1000);
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-8 bg-[#FAFAFA] min-h-screen text-gray-900 font-sans relative">
      
      {/* ─────────────────────────────────────────────────────────────────
          UPGRADE MODAL
      ────────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showUpgradeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
              onClick={() => setShowUpgradeModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
            >
              <div className="h-2 w-full bg-gradient-to-r from-blue-600 to-indigo-600" />
              <div className="p-8 pb-6 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 mb-1">Upgrade Your Coverage</h2>
                    <p className="text-gray-500 font-medium">Protect yourself fully against severe disruptions.</p>
                  </div>
                  <button onClick={() => setShowUpgradeModal(false)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div className="p-5 border border-indigo-200 bg-indigo-50/50 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                       <Shield className="w-5 h-5 text-indigo-600" />
                       <span className="font-bold text-indigo-900">Premium Shield Pro</span>
                    </div>
                    <Badge className="bg-indigo-600 text-white font-bold">POPULAR</Badge>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-3 text-sm font-medium text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-green-500" /> Up to ₹5,000/day coverage
                    </li>
                    <li className="flex items-center gap-3 text-sm font-medium text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-green-500" /> Priority Instant Payouts (Under 10s)
                    </li>
                    <li className="flex items-center gap-3 text-sm font-medium text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-green-500" /> Advanced Fraud Protection bypass
                    </li>
                  </ul>
                  <div className="flex items-end gap-2 mb-4">
                    <span className="text-3xl font-black text-gray-900 tabular-nums">₹999</span>
                    <span className="text-sm font-bold text-gray-500 pb-1">/ wk</span>
                  </div>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 rounded-xl text-base shadow-lg shadow-indigo-600/20" onClick={() => {
                    dispatch({ type: "UPGRADE_POLICY" });
                    setShowUpgradeModal(false);
                  }}>
                    Confirm Upgrade
                  </Button>
                </div>
                <p className="text-xs text-center text-gray-400 font-medium">By upgrading, you agree to the updated terms of service and dynamic premium policies.</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────────
          DOWNGRADE MODAL
      ────────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showDowngradeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
              onClick={() => setShowDowngradeModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
            >
              <div className="p-8 pb-6 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-black text-gray-900 mb-1">Downgrade Plan</h2>
                    <p className="text-gray-500 font-medium text-sm">Return to the Basic Shield tier.</p>
                  </div>
                  <button onClick={() => setShowDowngradeModal(false)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-8 space-y-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3 text-sm font-medium text-gray-500">
                    <AlertTriangle className="w-4 h-4 text-orange-500" /> Coverage reduced to ₹1,500/day
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium text-gray-500">
                    <AlertTriangle className="w-4 h-4 text-orange-500" /> Instant Payouts delayed by 24h
                  </li>
                </ul>
                <Button variant="outline" className="w-full text-gray-600 font-bold h-12 rounded-xl text-base" onClick={() => {
                  dispatch({ type: "DOWNGRADE_POLICY" });
                  setShowDowngradeModal(false);
                }}>
                  Confirm Downgrade
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* ─────────────────────────────────────────────────────────────────
          HEADER SECTION
      ────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 py-2">
        <div className="space-y-1.5">
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-gray-900 leading-tight">
            Overview
          </h1>
          <p className="text-gray-500 font-bold flex items-center gap-2">
            Welcome back, {userName} <span className="w-1 h-1 rounded-full bg-gray-300 inline-block" /> 
            <MapPin className="w-3.5 h-3.5" /> {state.user.location || "Mumbai Zone"}
          </p>
        </div>
        
        {/* Actions inside header row */}
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setShowClaimForm(!showClaimForm)}
            className="rounded-xl shadow-sm bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 font-bold px-5 py-2.5 h-auto transition-all"
          >
            <FileText className="w-4 h-4 mr-2 text-gray-600" />
            File a Claim
          </Button>
          <Button 
            onClick={() => {
              if (state.policy.tier === "Basic") setShowUpgradeModal(true);
              else setShowDowngradeModal(true);
            }}
            className={`rounded-xl shadow-md font-bold px-6 py-2.5 h-auto transition-all ${
              state.policy.tier === "Basic" 
                ? "shadow-blue-500/20 bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-white hover:bg-gray-50 text-gray-900 border border-gray-200"
            }`}
          >
            {state.policy.tier === "Basic" ? "Upgrade Plan" : "Downgrade Plan"}
          </Button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────
          ROW 1: KPI RIBBON (Pushed back to top properly)
      ────────────────────────────────────────────────────────────────── */}
      <TopMetricsRibbon />

      {/* ─────────────────────────────────────────────────────────────────
          INLINE AUTHENTIC CLAIM FORM
      ────────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showClaimForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, scale: 0.98 }}
            className="overflow-hidden z-10 relative"
          >
            <Card className="border border-gray-200 shadow-xl shadow-gray-200/50 rounded-3xl bg-white overflow-hidden mt-2">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-gray-800 to-gray-900" />
              <CardHeader className="pb-4 border-b border-gray-100 px-8 pt-7 flex flex-row justify-between items-center bg-gray-50/50">
                <div>
                  <CardTitle className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-700" />
                    Official Claim Filing
                  </CardTitle>
                  <p className="text-sm text-gray-500 font-medium mt-1">Submit authentic documentation. Fraudulent claims are penalized.</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowClaimForm(false)} className="rounded-full bg-white border border-gray-200 hover:bg-gray-100 text-gray-500 shadow-sm">
                  <X className="w-5 h-5" />
                </Button>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleManualClaim} className="space-y-7">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">Incident Reason <span className="text-red-500">*</span></label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Unrecorded Local Blockade"
                        value={claimReason}
                        onChange={(e) => setClaimReason(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all shadow-sm font-semibold text-gray-900 placeholder:font-normal"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">Incident Date <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <Calendar className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          required
                          type="date"
                          value={claimDate}
                          onChange={(e) => setClaimDate(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all shadow-sm font-semibold text-gray-900"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">Loss Estimate (₹) <span className="text-red-500">*</span></label>
                      <input
                        required
                        type="number"
                        min="1"
                        max={state.policy.coverageAmount}
                        placeholder={`Up to ₹${state.policy.coverageAmount}`}
                        value={claimAmount}
                        onChange={(e) => setClaimAmount(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all shadow-sm font-semibold text-gray-900 placeholder:font-normal tabular-nums"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Supporting Evidence</label>
                      <label className="flex items-center justify-center w-full px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer text-gray-600 font-semibold text-sm">
                        <Upload className="w-4 h-4 mr-2" /> Upload Receipt / Photo
                        <input type="file" className="hidden" accept="image/*,.pdf" />
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center pt-0.5">
                        <input 
                          type="checkbox" 
                          required
                          checked={declareTrue}
                          onChange={(e) => setDeclareTrue(e.target.checked)}
                          className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded cursor-pointer checked:bg-gray-900 checked:border-gray-900 transition-colors" 
                        />
                        <Check className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">I declare under penalty of perjury that this claim is authentic.</span>
                        <span className="text-xs text-gray-500 font-medium mt-0.5 flex items-center gap-1">
                           <AlertTriangle className="w-3 h-3 text-orange-500" /> Fraudulent claims will result in ban formatting.
                        </span>
                      </div>
                    </label>

                    <Button 
                      type="submit" 
                      disabled={isSubmittingTracking || !declareTrue}
                      className={`font-bold h-12 px-8 rounded-xl shadow-lg transition-all ${
                        declareTrue ? "bg-gray-900 hover:bg-black text-white shadow-gray-900/20" : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                      }`}
                    >
                      {isSubmittingTracking ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Validating Signature...
                        </>
                      ) : (
                        "Submit Signed Request"
                      )}
                    </Button>
                  </div>

                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────────
          ACTIVE CLAIM PIPELINE
      ────────────────────────────────────────────────────────────────── */}
      {state.activeClaim && (
        <AnimatePresence>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="z-10 relative">
             <ActiveClaimProgress claim={state.activeClaim} />
          </motion.div>
        </AnimatePresence>
      )}

      {/* ─────────────────────────────────────────────────────────────────
          ROW 2: CORE ANALYTICS
      ────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <EarningsChartSection />
        </div>
        <div className="lg:col-span-4">
          <CompactEnvironmentalSidebar />
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────
          ROW 3: HISTORY & ACTIONS
      ────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <ClaimsHistoryTable />
        </div>
        <div className="lg:col-span-4 space-y-8">
          <TriggerSimulator />
          
          <Card className="border border-gray-100 shadow-sm rounded-3xl bg-white hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-3 border-b border-gray-50 px-7 pt-6 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                Premium Audit
              </CardTitle>
              <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200 shadow-sm uppercase font-bold tracking-wider">Cycle</Badge>
            </CardHeader>
            <CardContent className="p-7">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Base Rate</span>
                  <span className="text-sm font-black text-gray-900">{formatINR(state.premium.basePremium)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Risk Adjustments</span>
                  <span className="text-sm font-black text-orange-600">+{formatINR(state.premium.finalPremium - state.premium.basePremium)}</span>
                </div>
                <div className="h-px bg-gray-100 w-full my-1" />
                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm font-black text-gray-900 uppercase tracking-widest">Active Premium</span>
                  <span className="text-xl font-black text-blue-600tabular-nums">{formatINR(state.premium.finalPremium)}<span className="text-xs font-bold text-blue-400 ml-1">/wk</span></span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
}
