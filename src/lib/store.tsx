"use client";

import React, { createContext, useContext, useReducer, useCallback, useRef } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface UserProfile {
  name: string;
  platform: string;
  employeeId: string;
  location: string;
  isRegistered: boolean;
}

export interface EnvironmentalData {
  rainfall: number;      // mm/hr
  aqi: number;           // 0–500
  temperature: number;   // °C
  demandDrop: number;    // percentage 0–100
  localRestriction: boolean;
}

export interface RiskData {
  score: number;         // 0–100
  level: "Low" | "Medium" | "High" | "Critical";
  weatherScore: number;
  aqiScore: number;
  heatScore: number;
  demandScore: number;
}

export interface PremiumData {
  basePremium: number;
  weatherMultiplier: number;
  aqiMultiplier: number;
  heatMultiplier: number;
  finalPremium: number;
}

export type ClaimStep = "detected" | "validating" | "approved" | "payout";

export interface Claim {
  id: string;
  type: string;
  icon: string;
  status: ClaimStep;
  amount: number;
  timestamp: Date;
  description: string;
}

export interface FraudData {
  score: number;          // 0–100
  status: "Low Risk" | "Medium Risk" | "Flagged";
  recentTriggers: number; // triggers in last 5 min
  triggerTimestamps: number[];
}

export interface AppState {
  user: UserProfile;
  env: EnvironmentalData;
  risk: RiskData;
  premium: PremiumData;
  policy: {
    status: "Active" | "Inactive";
    tier: "Basic" | "Pro";
    coverageAmount: number;
  };
  claims: Claim[];
  activeClaim: Claim | null;
  totalPayouts: number;
  totalEarningsProtected: number;
  fraud: FraudData;
}

// ─── Trigger Types ───────────────────────────────────────────────────────────

export type TriggerType = "heavy_rain" | "high_aqi" | "extreme_heat" | "demand_drop" | "local_restriction";

export const TRIGGER_CONFIG: Record<TriggerType, { label: string; icon: string; envUpdate: Partial<EnvironmentalData>; claimType: string; description: string; amount: number }> = {
  heavy_rain: {
    label: "Heavy Rain",
    icon: "🌧",
    envUpdate: { rainfall: 52 },
    claimType: "Heavy Rainfall",
    description: "Rainfall exceeded 40mm/hr threshold in your zone.",
    amount: 500,
  },
  high_aqi: {
    label: "High AQI",
    icon: "😷",
    envUpdate: { aqi: 380 },
    claimType: "Air Quality Alert",
    description: "AQI exceeded 300 — hazardous air quality detected.",
    amount: 350,
  },
  extreme_heat: {
    label: "Extreme Heat",
    icon: "🔥",
    envUpdate: { temperature: 47 },
    claimType: "Extreme Heatwave",
    description: "Temperature exceeded 45°C — heatwave advisory active.",
    amount: 400,
  },
  demand_drop: {
    label: "Demand Drop",
    icon: "📉",
    envUpdate: { demandDrop: 65 },
    claimType: "Demand Disruption",
    description: "Platform order volume dropped >50% in your zone.",
    amount: 300,
  },
  local_restriction: {
    label: "Local Restriction",
    icon: "🚫",
    envUpdate: { localRestriction: true },
    claimType: "Movement Restriction",
    description: "Local authority issued movement restriction in your zone.",
    amount: 450,
  },
};

// ─── Initial State ───────────────────────────────────────────────────────────

const INITIAL_ENV: EnvironmentalData = {
  rainfall: 8,
  aqi: 95,
  temperature: 32,
  demandDrop: 5,
  localRestriction: false,
};

function calculateRisk(env: EnvironmentalData): RiskData {
  const weatherScore = Math.min(100, Math.round((env.rainfall / 60) * 100));
  const aqiScore = Math.min(100, Math.round((env.aqi / 400) * 100));
  const heatScore = Math.min(100, Math.round(((env.temperature - 25) / 25) * 100));
  const demandScore = Math.min(100, env.demandDrop);

  const score = Math.min(100, Math.round(
    weatherScore * 0.35 + aqiScore * 0.25 + heatScore * 0.2 + demandScore * 0.15 + (env.localRestriction ? 5 : 0)
  ));

  const level: RiskData["level"] =
    score >= 75 ? "Critical" : score >= 55 ? "High" : score >= 35 ? "Medium" : "Low";

  return { score, level, weatherScore, aqiScore, heatScore, demandScore };
}

function calculatePremium(risk: RiskData): PremiumData {
  const basePremium = 150;
  const weatherMultiplier = 1 + (risk.weatherScore / 100) * 0.8;
  const aqiMultiplier = 1 + (risk.aqiScore / 100) * 0.5;
  const heatMultiplier = 1 + (risk.heatScore / 100) * 0.3;

  const totalMultiplier = (weatherMultiplier + aqiMultiplier + heatMultiplier) / 3;
  const finalPremium = Math.round(basePremium * totalMultiplier);

  return { basePremium, weatherMultiplier, aqiMultiplier, heatMultiplier, finalPremium };
}

function calculateFraud(timestamps: number[]): FraudData {
  const now = Date.now();
  const fiveMinAgo = now - 5 * 60 * 1000;
  const recentTimestamps = timestamps.filter(t => t > fiveMinAgo);
  const recentTriggers = recentTimestamps.length;

  let score: number;
  let status: FraudData["status"];

  if (recentTriggers >= 5) {
    score = 78;
    status = "Flagged";
  } else if (recentTriggers >= 3) {
    score = 45;
    status = "Medium Risk";
  } else {
    score = 12;
    status = "Low Risk";
  }

  return { score, status, recentTriggers, triggerTimestamps: recentTimestamps };
}

const initialRisk = calculateRisk(INITIAL_ENV);
const initialPremium = calculatePremium(initialRisk);

export const INITIAL_STATE: AppState = {
  user: { name: "", platform: "", employeeId: "", location: "", isRegistered: false },
  env: INITIAL_ENV,
  risk: initialRisk,
  premium: initialPremium,
  policy: { status: "Active", tier: "Basic", coverageAmount: 1500 },
  claims: [],
  activeClaim: null,
  totalPayouts: 0,
  totalEarningsProtected: 1500,
  fraud: { score: 12, status: "Low Risk", recentTriggers: 0, triggerTimestamps: [] },
};

// ─── Actions ─────────────────────────────────────────────────────────────────

type Action =
  | { type: "REGISTER_USER"; payload: Omit<UserProfile, "isRegistered"> }
  | { type: "UPDATE_ENV"; payload: Partial<EnvironmentalData> }
  | { type: "RESET_ENV" }
  | { type: "ADD_CLAIM"; payload: Claim }
  | { type: "UPDATE_CLAIM_STATUS"; payload: { id: string; status: ClaimStep } }
  | { type: "SET_ACTIVE_CLAIM"; payload: Claim | null }
  | { type: "COMPLETE_PAYOUT"; payload: { claimId: string; amount: number } }
  | { type: "UPDATE_FRAUD"; payload: number[] }
  | { type: "UPGRADE_POLICY" }
  | { type: "DOWNGRADE_POLICY" };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "REGISTER_USER": {
      const user = { ...action.payload, isRegistered: true };
      return { ...state, user };
    }
    case "UPDATE_ENV": {
      const env = { ...state.env, ...action.payload };
      const risk = calculateRisk(env);
      const premium = calculatePremium(risk);
      return { ...state, env, risk, premium };
    }
    case "RESET_ENV": {
      const risk = calculateRisk(INITIAL_ENV);
      const premium = calculatePremium(risk);
      return {
        ...state,
        env: INITIAL_ENV,
        risk,
        premium,
        activeClaim: null,
        fraud: { score: 12, status: "Low Risk", recentTriggers: 0, triggerTimestamps: [] },
      };
    }
    case "ADD_CLAIM": {
      return { ...state, claims: [action.payload, ...state.claims] };
    }
    case "UPDATE_CLAIM_STATUS": {
      const claims = state.claims.map(c =>
        c.id === action.payload.id ? { ...c, status: action.payload.status } : c
      );
      const activeClaim = state.activeClaim?.id === action.payload.id
        ? { ...state.activeClaim, status: action.payload.status }
        : state.activeClaim;
      return { ...state, claims, activeClaim };
    }
    case "SET_ACTIVE_CLAIM": {
      return { ...state, activeClaim: action.payload };
    }
    case "COMPLETE_PAYOUT": {
      const claims = state.claims.map(c =>
        c.id === action.payload.claimId ? { ...c, status: "payout" as ClaimStep } : c
      );
      const activeClaim = state.activeClaim?.id === action.payload.claimId
        ? { ...state.activeClaim, status: "payout" as ClaimStep }
        : state.activeClaim;
      return {
        ...state,
        claims,
        activeClaim,
        totalPayouts: state.totalPayouts + action.payload.amount,
        totalEarningsProtected: state.totalEarningsProtected + action.payload.amount,
      };
    }
    case "UPDATE_FRAUD": {
      const fraud = calculateFraud(action.payload);
      return { ...state, fraud };
    }
    case "UPGRADE_POLICY": {
      return { ...state, policy: { status: "Active", tier: "Pro", coverageAmount: 5000 } };
    }
    case "DOWNGRADE_POLICY": {
      return { ...state, policy: { status: "Active", tier: "Basic", coverageAmount: 1500 } };
    }
    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface StoreContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  registerUser: (user: Omit<UserProfile, "isRegistered">) => void;
  triggerEvent: (type: TriggerType) => void;
  resetEnvironment: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function SurakshaProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const triggerTimestampsRef = useRef<number[]>([]);

  const registerUser = useCallback((user: Omit<UserProfile, "isRegistered">) => {
    dispatch({ type: "REGISTER_USER", payload: user });
  }, []);

  const triggerEvent = useCallback((type: TriggerType) => {
    const config = TRIGGER_CONFIG[type];
    const now = Date.now();

    // 1. Update environment
    dispatch({ type: "UPDATE_ENV", payload: config.envUpdate });

    // 2. Track fraud timestamps
    triggerTimestampsRef.current = [...triggerTimestampsRef.current, now];
    dispatch({ type: "UPDATE_FRAUD", payload: triggerTimestampsRef.current });

    // 3. Create claim
    const claimId = `CLM-${Math.floor(1000 + Math.random() * 9000)}`;
    const claim: Claim = {
      id: claimId,
      type: config.claimType,
      icon: config.icon,
      status: "detected",
      amount: config.amount,
      timestamp: new Date(),
      description: config.description,
    };

    dispatch({ type: "ADD_CLAIM", payload: claim });
    dispatch({ type: "SET_ACTIVE_CLAIM", payload: claim });

    // 4. Animate claim lifecycle
    setTimeout(() => {
      dispatch({ type: "UPDATE_CLAIM_STATUS", payload: { id: claimId, status: "validating" } });
    }, 1200);

    setTimeout(() => {
      dispatch({ type: "UPDATE_CLAIM_STATUS", payload: { id: claimId, status: "approved" } });
    }, 2800);

    setTimeout(() => {
      dispatch({ type: "COMPLETE_PAYOUT", payload: { claimId, amount: config.amount } });
    }, 4200);
  }, []);

  const resetEnvironment = useCallback(() => {
    triggerTimestampsRef.current = [];
    dispatch({ type: "RESET_ENV" });
  }, []);

  return (
    <StoreContext.Provider value={{ state, dispatch, registerUser, triggerEvent, resetEnvironment }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useSuraksha() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useSuraksha must be used within SurakshaProvider");
  return ctx;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
