"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, TrendingDown, IndianRupee, Shield, Sparkles } from "lucide-react";
import { useSuraksha, formatINR } from "@/lib/store";

const claimsOverTime = [
  { month: "Oct", claims: 0, amount: 0 },
  { month: "Nov", claims: 1, amount: 320 },
  { month: "Dec", claims: 0, amount: 0 },
  { month: "Jan", claims: 2, amount: 770 },
  { month: "Feb", claims: 1, amount: 180 },
  { month: "Mar", claims: 3, amount: 1270 },
];

const riskTrendData = [
  { week: "W1", weather: 42, aqi: 35, overall: 40 },
  { week: "W2", weather: 55, aqi: 48, overall: 51 },
  { week: "W3", weather: 38, aqi: 55, overall: 46 },
  { week: "W4", weather: 75, aqi: 62, overall: 68 },
  { week: "W5", weather: 60, aqi: 45, overall: 54 },
  { week: "W6", weather: 82, aqi: 71, overall: 76 },
  { week: "W7", weather: 65, aqi: 58, overall: 62 },
  { week: "W8", weather: 72, aqi: 55, overall: 65 },
];

const earningsVsPremium = [
  { month: "Oct", earnings: 6200, premium: 289, payouts: 0 },
  { month: "Nov", earnings: 5800, premium: 289, payouts: 320 },
  { month: "Dec", earnings: 7100, premium: 289, payouts: 0 },
  { month: "Jan", earnings: 5200, premium: 289, payouts: 770 },
  { month: "Feb", earnings: 6800, premium: 289, payouts: 180 },
  { month: "Mar", earnings: 8420, premium: 289, payouts: 1270 },
];

export default function AnalyticsPage() {
  const { state } = useSuraksha();

  const userName = state.user.isRegistered ? state.user.name : "User";
  const userLocation = state.user.location || "Mumbai";

  const kpiCards = [
    {
      title: "Total Payouts",
      value: formatINR(state.totalPayouts > 0 ? state.totalPayouts : 2540),
      change: `+${formatINR(state.totalPayouts > 0 ? state.totalPayouts : 1270)} this month`,
      up: true,
      icon: IndianRupee,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Avg Risk Score",
      value: String(state.risk.score),
      change: "+5 vs last month",
      up: false,
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "Claims Filed",
      value: String(state.claims.length > 0 ? state.claims.length : 7),
      change: `${state.claims.length > 0 ? state.claims.length : 3} this month`,
      up: true,
      icon: Shield,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "ROI",
      value: "339%",
      change: `${formatINR(2540)} received on ${formatINR(state.premium.finalPremium)}/wk`,
      up: true,
      icon: TrendingUp,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Badge className="mb-3 bg-indigo-100 text-indigo-700 border-indigo-200">
            Analytics
          </Badge>
          <h1 className="text-2xl font-bold text-gray-900">Income Protection Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">6-month overview · {userName} · {userLocation}</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-7">
          {kpiCards.map((k) => (
            <Card key={k.title} className="border-0 shadow-md card-hover rounded-2xl overflow-hidden relative">
              <div className={`absolute top-0 left-0 w-1 h-full ${k.bg.replace('bg-', 'bg-').replace('50', '500')}`} />
              <CardContent className="p-6">
                <div className={`w-12 h-12 ${k.bg} rounded-xl flex items-center justify-center mb-4 shadow-sm`}>
                  <k.icon className={`w-6 h-6 ${k.color}`} />
                </div>
                <p className="text-gray-500 text-sm font-medium mb-1 tracking-wide uppercase">{k.title}</p>
                <p className="text-3xl font-black text-gray-900 mb-2 tabular-nums">{k.value}</p>
                <div className="flex items-center gap-1.5 mt-2 bg-gray-50 rounded-md px-2 py-1 w-max">
                  {k.up ? (
                    <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-red-600" />
                  )}
                  <span className="text-xs font-semibold text-gray-600">{k.change}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          {/* Claims Over Time */}
          <Card className="border border-gray-100 shadow-md rounded-2xl overflow-hidden bg-white">
            <CardHeader className="pb-4 border-b border-gray-50 bg-gray-50/50">
              <CardTitle className="text-lg font-bold text-gray-900">Claims Over Time</CardTitle>
              <p className="text-gray-500 text-xs font-medium mt-1">Monthly claim count and payout amount</p>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={claimsOverTime} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} dx={-10} />
                  <Tooltip
                    contentStyle={{
                      background: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      fontSize: "13px",
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                      padding: '12px'
                    }}
                    formatter={(v, name) =>
                      name === "Payout (₹)" || name === "amount" ? [formatINR(Number(v)), "Payout"] : [Number(v), "Claims"]
                    }
                  />
                  <Legend wrapperStyle={{ fontSize: "13px", paddingTop: "10px" }} />
                  <Bar dataKey="claims" name="Claims" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={24} />
                  <Bar dataKey="amount" name="Payout (₹)" fill="#22c55e" radius={[6, 6, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Risk Trends */}
          <Card className="border border-gray-100 shadow-md rounded-2xl overflow-hidden bg-white">
            <CardHeader className="pb-4 border-b border-gray-50 bg-gray-50/50">
              <CardTitle className="text-lg font-bold text-gray-900">Risk Trends</CardTitle>
              <p className="text-gray-500 text-xs font-medium mt-1">8-week risk score evolution</p>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={riskTrendData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{ fontSize: 12, fill: "#64748b" }} domain={[0, 100]} axisLine={false} tickLine={false} dx={-10} />
                  <Tooltip
                    contentStyle={{
                      background: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      fontSize: "13px",
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                      padding: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "13px", paddingTop: "10px" }} />
                  <Line type="monotone" dataKey="weather" name="Weather" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="aqi" name="AQI" stroke="#f97316" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="overall" name="Overall" stroke="#6366f1" strokeWidth={3.5} dot={false} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Chart Row 2 — Full Width */}
        <Card className="border border-gray-100 shadow-md rounded-2xl overflow-hidden bg-white">
          <CardHeader className="pb-4 border-b border-gray-50 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-gray-900">Earnings vs Payouts vs Premium</CardTitle>
                <p className="text-gray-500 text-xs font-medium mt-1">Monthly comparison — last 6 months</p>
              </div>
              <Badge className="bg-purple-100 text-purple-700 border-purple-200 px-3 py-1 text-xs font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 mr-1 inline" /> ROI 339%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={earningsVsPremium} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="payoutsGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    fontSize: "13px",
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                    padding: '14px'
                  }}
                  formatter={(v) => [formatINR(Number(v)), ""]}
                />
                <Legend wrapperStyle={{ fontSize: "13px", paddingTop: "10px" }} />
                <Area type="monotone" dataKey="earnings" name="Earnings" stroke="#6366f1" strokeWidth={3} fill="url(#earningsGrad)" />
                <Area type="monotone" dataKey="payouts" name="Payouts" stroke="#22c55e" strokeWidth={3} fill="url(#payoutsGrad2)" />
                <Area type="monotone" dataKey="premium" name="Premium Paid" stroke="#f97316" strokeWidth={2} fill="none" strokeDasharray="6 6" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
