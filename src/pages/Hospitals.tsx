import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, X, Phone, Clock, Star } from "lucide-react";
import { MapCard } from "@/components/MapCard";
import { HospitalCard } from "@/components/HospitalCard";
import { LoadingScreen } from "@/components/LoadingScreen";
import { aiService } from "@/services/ai";
import { db } from "@/services/db";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Facility } from "@/types";
import { cn } from "@/lib/utils";

const filters = [
  { id: "all", label: "All" },
  { id: "hospital", label: "Hospitals" },
  { id: "police", label: "Police" },
  { id: "fire", label: "Fire" },
  { id: "shelter", label: "Shelters" },
] as const;

const typeColor: Record<Facility["type"], string> = {
  hospital: "bg-red-500",
  police: "bg-blue-500",
  fire: "bg-orange-500",
  shelter: "bg-emerald-500",
};

export default function Hospitals() {
  const [center, setCenter] = useState<[number, number]>([40.7128, -74.006]);
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const [selected, setSelected] = useState<Facility | null>(null);

  const { data: dbFacilities } = useQuery({
    queryKey: ["db-facilities"],
    queryFn: () => db.listFacilities(),
    staleTime: 5 * 60_000,
  });

  const { data: facilities = [], isLoading } = useQuery({
    queryKey: ["facilities", center],
    queryFn: () => aiService.recommendFacilities(center[0], center[1]),
    enabled: !dbFacilities || dbFacilities.length === 0,
  });

  const allFacilities = dbFacilities && dbFacilities.length > 0 ? dbFacilities : facilities;
  const loading = isLoading && (!dbFacilities || dbFacilities.length === 0);

  const locate = useMutation({
    mutationFn: () =>
      new Promise<[number, number]>((resolve, reject) => {
        if (!navigator.geolocation) return reject(new Error("Not supported"));
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve([pos.coords.latitude, pos.coords.longitude]),
          () => reject(new Error("Permission denied")),
        );
      }),
    onSuccess: setCenter,
  });

  const filtered = useMemo(
    () => (filter === "all" ? allFacilities : allFacilities.filter((f) => f.type === filter)),
    [allFacilities, filter],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nearby Help</h1>
          <p className="text-muted-foreground mt-1">Hospitals, police, fire stations, and shelters around you.</p>
        </div>
        <Button
          variant="outline"
          onClick={() => locate.mutate()}
          disabled={locate.isPending}
        >
          <Navigation className="w-4 h-4 mr-1.5" /> Use my location
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors",
              filter === f.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 h-[500px] lg:h-[600px] rounded-2xl overflow-hidden border border-border">
          {loading ? (
            <LoadingScreen label="Loading map..." />
          ) : (
            <MapCard
              center={center}
              facilities={filtered}
              selected={selected}
              onSelect={setSelected}
            />
          )}
        </div>

        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{filtered.length} locations</h2>
            <span className="text-xs text-muted-foreground">Sorted by distance</span>
          </div>
          <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
            <AnimatePresence>
              {filtered
                .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0))
                .map((f, i) => (
                  <HospitalCard key={f.id} facility={f} onSelect={setSelected} delay={i * 0.04} />
                ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Detail drawer */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 grid place-items-end sm:place-items-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <Card className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-12 h-12 rounded-xl grid place-items-center", typeColor[selected.type])}>
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{selected.name}</h3>
                      <Badge variant="secondary" className="mt-1 capitalize">{selected.type}</Badge>
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-muted">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2"><MapPin className="w-4 h-4 text-muted-foreground mt-0.5" /> {selected.address}</div>
                  <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-muted-foreground" /> {selected.phone}</div>
                  <div className="flex items-center gap-2"><Navigation className="w-4 h-4 text-muted-foreground" /> {selected.distanceKm} km away</div>
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-muted-foreground" /> {selected.open24h ? "Open 24 hours" : "Limited hours"}</div>
                  {selected.rating && (
                    <div className="flex items-center gap-2"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {selected.rating.toFixed(1)} rating</div>
                  )}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button asChild className="flex-1">
                    <a href={`tel:${selected.phone}`}><Phone className="w-4 h-4 mr-1" /> Call</a>
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() =>
                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}`, "_blank")
                  }>
                    <Navigation className="w-4 h-4 mr-1" /> Directions
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
