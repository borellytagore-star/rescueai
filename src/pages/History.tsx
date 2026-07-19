import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, CheckCircle2, AlertCircle, Archive, ArrowRight } from "lucide-react";
import { useEmergencies } from "@/context/EmergencyContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { emergencyMeta, severityMeta, formatDate } from "@/utils/emergency";
import { cn } from "@/lib/utils";

const statusMeta = {
  active: { label: "Active", icon: AlertCircle, color: "text-red-600 bg-red-100 dark:bg-red-500/15" },
  resolved: { label: "Resolved", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-500/15" },
  archived: { label: "Archived", icon: Archive, color: "text-muted-foreground bg-muted" },
};

export default function History() {
  const { emergencies } = useEmergencies();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Emergency History</h1>
        <p className="text-muted-foreground mt-1">A timeline of your past emergency reports.</p>
      </div>

      {emergencies.length === 0 ? (
        <Card className="p-12 text-center">
          <Clock className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <h2 className="font-semibold">No emergencies recorded</h2>
          <p className="text-sm text-muted-foreground mt-1">Reports you create will appear here.</p>
          <Button asChild className="mt-4"><Link to="/dashboard">Start a report</Link></Button>
        </Card>
      ) : (
        <div className="relative">
          <div className="absolute left-5 top-2 bottom-2 w-px bg-border" />
          <div className="space-y-4">
            {emergencies.map((e, i) => {
              const em = e.type ? emergencyMeta[e.type] : null;
              const sev = e.severity ? severityMeta[e.severity] : null;
              const st = statusMeta[e.status];
              return (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative pl-14"
                >
                  <div className={cn(
                    "absolute left-0 top-3 w-10 h-10 rounded-full grid place-items-center ring-4 ring-background",
                    st.color,
                  )}>
                    <st.icon className="w-5 h-5" />
                  </div>
                  <Link to={`/analysis/${e.id}`}>
                    <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer group">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">{formatDate(e.createdAt)}</div>
                          <h3 className="font-semibold">{e.description}</h3>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                      </div>
                      <div className="flex items-center gap-2 mt-3 flex-wrap">
                        {em && <Badge variant="secondary" className="text-xs">{em.label}</Badge>}
                        {sev && <Badge className={cn("text-xs", sev.bg, sev.color)}>{sev.label}</Badge>}
                        <Badge variant="outline" className={cn("text-xs", st.color)}>{st.label}</Badge>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
