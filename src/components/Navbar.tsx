import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Activity, Menu, X, Phone, Moon, Sun, Settings as Cog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/context/SettingsContext";
import { cn } from "@/lib/utils";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/hospitals", label: "Nearby Help" },
  { to: "/history", label: "History" },
  { to: "/settings", label: "Settings" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { settings, toggleTheme } = useSettings();
  const isDark = settings.theme === "dark";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 glass">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl gradient-emergency grid place-items-center shadow-lg shadow-red-500/20">
                <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
            </div>
            <div className="leading-none">
              <span className="text-lg font-bold tracking-tight">RescueAI</span>
              <span className="block text-[10px] uppercase tracking-widest text-muted-foreground">
                Emergency Response
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "px-3.5 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === l.to
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="hidden sm:inline-flex"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button
              onClick={() => navigate("/sos")}
              className="hidden sm:inline-flex gradient-emergency text-white shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30"
            >
              <Phone className="w-4 h-4 mr-1.5" />
              SOS
            </Button>
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border/60"
          >
            <div className="px-4 py-3 space-y-1">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium",
                    pathname === l.to
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  {l.label}
                </Link>
              ))}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    toggleTheme();
                  }}
                >
                  {isDark ? <Sun className="w-4 h-4 mr-1" /> : <Moon className="w-4 h-4 mr-1" />}
                  Theme
                </Button>
                <Button
                  size="sm"
                  className="flex-1 gradient-emergency text-white"
                  onClick={() => {
                    setOpen(false);
                    navigate("/sos");
                  }}
                >
                  <Phone className="w-4 h-4 mr-1" /> SOS
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border/60 mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-emergency grid place-items-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold">RescueAI</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              AI-powered emergency response assistant. Trusted help when seconds matter.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
              <li><Link to="/hospitals" className="hover:text-foreground">Nearby Help</Link></li>
              <li><Link to="/history" className="hover:text-foreground">History</Link></li>
              <li><Link to="/settings" className="hover:text-foreground">Settings</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Emergency</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/sos" className="hover:text-foreground">Send SOS</Link></li>
              <li><a href="tel:911" className="hover:text-foreground">Call 911</a></li>
              <li><a href="tel:18002221222" className="hover:text-foreground">Poison Control</a></li>
              <li><Link to="/dashboard" className="hover:text-foreground">Report Emergency</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Stay informed</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Get safety tips and updates in your inbox.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="you@email.com"
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-input bg-background"
              />
              <Button size="sm">Join</Button>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© 2026 RescueAI. For demonstration purposes — not a substitute for professional emergency services.</p>
          <div className="flex items-center gap-4">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
