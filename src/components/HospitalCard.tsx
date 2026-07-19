import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Star, Navigation } from "lucide-react";
import type { Facility } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const typeMeta = {
  hospital: { label: "Hospital", color: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300", pin: "bg-red-500" },
  police: { label: "Police", color: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300", pin: "bg-blue-500" },
  fire: { label: "Fire", color: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300", pin: "bg-orange-500" },
  shelter: { label: "Shelter", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300", pin: "bg-emerald-500" },
};

export function HospitalCard({
  facility,
  onSelect,
  delay = 0,
}: {
  facility: Facility;
  onSelect?: (f: Facility) => void;
  delay?: number;
}) {
  const meta = typeMeta[facility.type];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card
        className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => onSelect?.(facility)}
      >
        <div className="flex items-start gap-3">
          <div className={cn("w-10 h-10 rounded-lg grid place-items-center shrink-0", meta.pin)}>
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-semibold truncate">{facility.name}</h4>
              <Badge className={meta.color} variant="secondary">{meta.label}</Badge>
            </div>
            <p className="text-xs text-muted-foreground truncate">{facility.address}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Navigation className="w-3 h-3" /> {facility.distanceKm} km
              </span>
              {facility.rating && (
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {facility.rating.toFixed(1)}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {facility.open24h ? "24h" : "Limited"}
              </span>
            </div>
            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="outline" className="h-8 text-xs" asChild>
                <a href={`tel:${facility.phone}`}>
                  <Phone className="w-3 h-3 mr-1" /> Call
                </a>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lng}`, "_blank");
                }}
              >
                <Navigation className="w-3 h-3 mr-1" /> Directions
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
