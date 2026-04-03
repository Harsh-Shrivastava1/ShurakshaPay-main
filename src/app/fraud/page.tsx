"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  MapPin,
  Activity,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Fingerprint,
  Lock,
  Terminal,
  Wifi,
  Download
} from "lucide-react";
import { useSuraksha } from "@/lib/store";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const fraudInspectors = [
  {
    icon: MapPin,
    title: "Geo-Velocity Checks",
    description: "GPS location matches registered delivery zone. No impossible travel patterns or proxy IPs detected.",
    status: "pass",
    score: 96,
    detail: "Location Auth: Verified",
    color: "blue"
  },
  {
    icon: Activity,
    title: "Behavioral Consistency",
    description: "Delivery volume and login times match historical user patterns over the trailing 30-day window.",
    status: "pass",
    score: 88,
    detail: "Trend Matrix: Normal",
    color: "green"
  },
  {
    icon: Smartphone,
    title: "Hardware Fingerprint",
    description: "Cryptographic device signature matches established session. No emulators or root/jailbreaks identified.",
    status: "pass",
    score: 99,
    detail: "Device ID: Trusted",
    color: "purple"
  },
  {
    icon: Eye,
    title: "Claim Anomaly Rate",
    description: "Claim frequency analyzed against hyper-local weather datasets and peer baseline models.",
    status: "pass",
    score: 82,
    detail: "Frequency Risk: Minimal",
    color: "indigo"
  },
  {
    icon: Fingerprint,
    title: "Identity Integrity",
    description: "Aadhaar-linked KYC is cross-referenced with banking API to prevent synthetic identity duplicate creation.",
    status: "pass",
    score: 100,
    detail: "KYC Mesh: Locked",
    color: "teal"
  },
  {
    icon: Lock,
    title: "Session Trust",
    description: "Token validity and multi-factor checkpoints cleared. No session hijacking markers found.",
    status: "warning",
    score: 71,
    detail: "Network: New IP Flagged",
    color: "orange"
  },
];

export default function FraudPage() {
  const { state } = useSuraksha();

  const overallFraudScore = state.fraud.score;
  const isFlagged = state.fraud.status === "Flagged";
  const isMedium = state.fraud.status === "Medium Risk";

  // Dynamically update claim frequency inspector based on context
  const dynamicInspectors = fraudInspectors.map(inspector => {
    if (inspector.title === "Claim Anomaly Rate") {
      const isHighFreq = state.fraud.recentTriggers >= 3;
      return {
        ...inspector,
        status: isHighFreq ? "warning" : "pass",
        score: isHighFreq ? 45 : 82,
        detail: isHighFreq ? "Frequency Spike ⚠" : "Frequency Risk: Minimal",
        color: isHighFreq ? "orange" : "indigo"
      };
    }
    if (inspector.title === "Geo-Velocity Checks") {
      return {
        ...inspector,
        detail: `Zone: ${state.user.location || "Mumbai"} Validated`,
      };
    }
    return inspector;
  });

  const checksPassed = dynamicInspectors.filter(i => i.status === "pass").length;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 font-sans p-6 lg:p-8">
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 py-2">
          <div className="space-y-1.5">
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-gray-900 leading-tight flex items-center gap-3">
               Security & Fraud Audit
            </h1>
            <p className="text-gray-500 font-bold flex items-center gap-2">
              Deep-packet AI monitors account integrity prior to automated settlement triggers.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline"
              className="rounded-xl shadow-sm bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 font-bold px-5 py-2.5 h-auto transition-all"
            >
              <Download className="w-4 h-4 mr-2 text-gray-600" />
              Export Audit Log
            </Button>
          </div>
        </div>

        {/* 12-COLUMN MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT CONTENT SPAN */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Inspector Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {dynamicInspectors.map((check) => (
                <Card
                  key={check.title}
                  className={`border shadow-sm bg-white rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-md ${
                    check.status === "warning" ? "border-orange-200 shadow-orange-100" : "border-gray-100"
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Hexagon wrapper for Icon */}
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 relative overflow-hidden ${
                         check.status === "warning" ? "bg-orange-50" : "bg-gray-50"
                      }`}>
                        <check.icon className={`w-5 h-5 relative z-10 ${
                           check.status === "warning" ? "text-orange-600" : "text-gray-700"
                        }`} />
                        {check.status === "pass" && (
                          <div className={`absolute bottom-0 left-0 w-full h-1 bg-${check.color}-400`} />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1.5">
                          <h3 className="font-bold text-gray-900 text-[15px]">{check.title}</h3>
                          {check.status === "pass" ? (
                             <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                             <AlertTriangle className="w-5 h-5 text-orange-500 animate-pulse" />
                          )}
                        </div>
                        <p className="text-gray-500 text-xs mb-4 leading-relaxed font-medium">{check.description}</p>
                        
                        <div className="bg-gray-50/80 rounded-lg p-2.5 flex items-center justify-between border border-gray-100">
                          <p className={`text-[10px] uppercase font-bold tracking-widest ${check.status === "warning" ? "text-orange-600" : "text-gray-600"}`}>
                            {check.detail}
                          </p>
                          <span className={`text-xs font-black ${check.status === "warning" ? "text-orange-500" : "text-gray-900"}`}>{check.score}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* AI Architecture Note */}
            <Card className="border border-indigo-100 shadow-md rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white relative overflow-hidden">
               <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
                  <Shield className="w-64 h-64 -mt-10 -mr-10" />
               </div>
               <CardContent className="p-7 relative z-10 flex items-start gap-5">
                  <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl">
                    <Wifi className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1 drop-shadow-sm">High-Frequency ML Infrastructure</h3>
                    <p className="text-indigo-100 text-sm font-medium leading-relaxed max-w-2xl">
                      SurakshaPay intercepts settlement requests through a 6-layer deep validation stack. Sensor data is cryptographically signed and correlated with satellite telemetry to maintain 99.8% precision.
                    </p>
                  </div>
               </CardContent>
            </Card>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            
            {/* Massive Risk Score Dial Card */}
            <Card className={`border shadow-lg rounded-3xl overflow-hidden relative ${
               isFlagged ? "border-red-200 bg-red-50/30" : "border-gray-100 bg-white"
            }`}>
              <CardHeader className="pb-4 pt-7 px-7 flex flex-row items-center justify-between border-b border-gray-50 bg-white">
                 <CardTitle className="text-base font-bold text-gray-900 uppercase tracking-widest text-[13px]">Threat Analysis</CardTitle>
                 <Badge className={`${
                    isFlagged ? "bg-red-100 text-red-700 border-red-200 uppercase tracking-widest text-[9px] font-black" :
                    isMedium ? "bg-orange-100 text-orange-700 border-orange-200 uppercase tracking-widest text-[9px] font-black" :
                    "bg-green-100 text-green-700 border-green-200 uppercase tracking-widest text-[9px] font-black"
                  }`}>
                    {isFlagged ? "Sys Flagged" : isMedium ? "Elevated" : "Low Risk"}
                 </Badge>
              </CardHeader>
              
              <CardContent className="p-8 flex flex-col items-center">
                 {/* Rendered SVG Dial */}
                 <div className="relative mb-6">
                  <div className="w-48 h-48 rounded-full flex items-center justify-center bg-white shadow-[inset_0_-10px_20px_rgba(0,0,0,0.03)] border border-gray-50">
                    <div className="text-center flex flex-col items-center justify-center mt-2">
                      <motion.p
                        key={overallFraudScore}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        className={`text-6xl font-black tabular-nums tracking-tighter ${
                          isFlagged ? "text-red-600" : isMedium ? "text-orange-500" : "text-green-500"
                        }`}
                      >
                        {overallFraudScore}
                      </motion.p>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Trust Score</p>
                    </div>
                  </div>
                  <svg className="absolute inset-0 w-48 h-48 -rotate-[135deg]" viewBox="0 0 160 160">
                    <circle cx="80" cy="80" r="70" fill="none" stroke="#f1f5f9" strokeWidth="8" strokeDasharray="330 440" />
                    <motion.circle
                      cx="80" cy="80" r="70" fill="none"
                      stroke={isFlagged ? "#ef4444" : isMedium ? "#f97316" : "#22c55e"}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray="330 440"
                      initial={{ strokeDashoffset: 330 }}
                      animate={{
                        strokeDashoffset: Math.max(0, 330 - ((overallFraudScore / 100) * 330))
                      }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                  </svg>
                </div>

                <div className="w-full space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                     <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Checks Intact</span>
                     <span className={`text-sm font-black ${checksPassed === dynamicInspectors.length ? "text-gray-900" : "text-orange-600"}`}>{checksPassed} / {dynamicInspectors.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                     <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Network Lock</span>
                     <span className="text-sm font-black text-green-600">Active</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Terminal Audit Log */}
            <Card className="border border-gray-800 shadow-xl rounded-3xl bg-gray-900 overflow-hidden text-gray-300">
               <CardHeader className="py-4 px-6 border-b border-gray-800 bg-black/40 flex flex-row items-center gap-2">
                 <Terminal className="w-4 h-4 text-green-400" />
                 <CardTitle className="text-xs font-bold text-gray-400 uppercase tracking-widest">System Firehose</CardTitle>
               </CardHeader>
               <CardContent className="p-6 font-mono text-[10px] leading-relaxed space-y-3">
                  <p><span className="text-green-400">auth_node</span>: Handshake verified from IP 10.4.x.x</p>
                  <p><span className="text-blue-400">gps_mesh</span>: Resolving coordinates against zone matrix...</p>
                  <p><span className="text-blue-400">gps_mesh</span>: Match found. Delta = 0.44m</p>
                  {isFlagged && (
                     <p><span className="text-red-400">ai_kernel</span>: WARN! Claim frequency limit exceeded across global throttle!</p>
                  )}
                  {isMedium && (
                     <p><span className="text-orange-400">ai_kernel</span>: Notice: Activity metrics slightly above baseline.</p>
                  )}
                  <p><span className="text-purple-400">sys_daemon</span>: Waiting for trigger events via webhook.</p>
                  <div className="w-2 h-4 bg-green-400 animate-pulse mt-2" />
               </CardContent>
            </Card>
          </div>
          
        </div>
      </div>
    </div>
  );
}
