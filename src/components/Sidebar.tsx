"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Shield, 
  LayoutDashboard, 
  Lock, 
  LineChart,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useSuraksha } from "@/lib/store";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analytics", label: "Analytics", icon: LineChart },
  { href: "/fraud", label: "Fraud Shield", icon: Lock },
];

export default function Sidebar({ isCollapsed, setIsCollapsed }: { isCollapsed: boolean, setIsCollapsed: (val: boolean) => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useSuraksha();

  const userName = state.user.isRegistered ? state.user.name : "User";
  const userInitial = userName.charAt(0).toUpperCase();

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-100 shadow-sm hidden lg:flex flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className={`p-6 flex-1 flex flex-col ${isCollapsed ? "items-center px-4" : ""}`}>
        {/* Header / Logo */}
        <div className={`flex items-center group mb-10 w-full ${isCollapsed ? "justify-center" : "justify-between"}`}>
          <Link href="/" className="flex items-center gap-2 overflow-hidden w-max">
            <div className="w-8 h-8 flex-shrink-0 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors shadow-sm">
              <Shield className="w-4 h-4 text-white" />
            </div>
            {!isCollapsed && (
              <span className="font-bold text-xl text-gray-900 tracking-tight whitespace-nowrap">
                Suraksha<span className="text-blue-600">Pay</span>
              </span>
            )}
          </Link>
        </div>

        {!isCollapsed && <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Main Menu</p>}
        {isCollapsed && <div className="h-[21px] mb-3" />}
        
        {/* Navigation */}
        <nav className="space-y-1.5 w-full">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/');
            return (
              <Link
                key={link.href}
                href={link.href}
                title={isCollapsed ? link.label : undefined}
                className={`flex items-center rounded-xl font-semibold transition-all ${
                  isCollapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"
                } ${
                  isActive
                    ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100/50"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-transparent"
                }`}
              >
                <link.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                {!isCollapsed && <span className="text-sm">{link.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Collapse Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 shadow-sm z-50 transition-colors"
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Profile Section at Bottom */}
      <div className={`p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col ${isCollapsed ? "items-center" : ""}`}>
        <div className={`flex items-center w-full ${isCollapsed ? "justify-center" : "justify-between"}`}>
          <div className="flex items-center gap-3 overflow-hidden" title={isCollapsed ? `${userName} — Protected` : undefined}>
            <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold shadow-sm border border-white">
              {userInitial}
            </div>
            {!isCollapsed && (
              <div className="whitespace-nowrap">
                <p className="text-sm font-bold text-gray-900">{userName}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <p className="text-[10px] font-bold text-green-700 uppercase tracking-wider">Protected</p>
                </div>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
        {isCollapsed && (
          <button 
            onClick={handleLogout}
            className="mt-4 p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full flex justify-center"
            title="Logout"
          >
            <LogOut className="w-5 h-5 ml-[2px]" />
          </button>
        )}
      </div>
    </aside>
  );
}
