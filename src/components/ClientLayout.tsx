"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { Shield } from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { SurakshaProvider } from "@/lib/store";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Pages that belong to the "Core App" after onboarding
  const showSidebar = ["/dashboard", "/analytics", "/fraud"].includes(pathname);

  const content = (
    <>
      {/* Authenticated Dashboard Layout */}
      {showSidebar ? (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
          <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          <main className={`flex-1 h-full overflow-y-auto transition-all duration-300 ease-in-out ${isCollapsed ? "lg:pl-20" : "lg:pl-64"}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="min-h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      ) : (
        /* Distraction-free Full Screen Layout (Landing & Onboarding Flow) */
        <div className="h-screen bg-transparent flex flex-col overflow-hidden relative">
          {/* Decorative background gradients */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-400/20 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3 pointer-events-none" />

          {/* Minimal Top Header */}
          <header className="absolute top-0 w-full z-50 p-6">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <Link href="/" className="flex items-center gap-2 group w-max">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg group-hover:bg-blue-700 transition">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-xl text-gray-900 tracking-tight">
                  Suraksha<span className="text-blue-600">Pay</span>
                </span>
              </Link>
            </div>
          </header>

          {/* Main Content - Centered */}
          <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 w-full h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full flex items-center justify-center flex-1"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      )}
    </>
  );

  return <SurakshaProvider>{content}</SurakshaProvider>;
}
