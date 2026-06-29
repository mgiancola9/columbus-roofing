"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";

export interface SelectedAddress {
  formatted: string;
  postalCode: string;
  city: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSelect: (addr: SelectedAddress) => void;
}

interface Prediction {
  description: string;
  place_id: string;
}

const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
let mapsPromise: Promise<boolean> | null = null;

/** Load the Google Maps JS (Places) once. Resolves false if no key or load fails. */
function loadMaps(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if ((window as any).google?.maps?.places) return Promise.resolve(true);
  if (!MAPS_KEY) return Promise.resolve(false);
  if (mapsPromise) return mapsPromise;
  mapsPromise = new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}&libraries=places`;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.head.appendChild(s);
  });
  return mapsPromise;
}

export default function AddressAutocomplete({ value, onChange, onSelect }: Props) {
  const [ready, setReady] = useState(false);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [open, setOpen] = useState(false);
  const acService = useRef<any>(null);
  const placesService = useRef<any>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    let active = true;
    loadMaps().then((ok) => {
      if (!active || !ok) return;
      const g = (window as any).google;
      acService.current = new g.maps.places.AutocompleteService();
      placesService.current = new g.maps.places.PlacesService(document.createElement("div"));
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  function handleInput(v: string) {
    onChange(v);
    if (!ready || v.trim().length < 3) {
      setPredictions([]);
      setOpen(false);
      return;
    }
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      acService.current.getPlacePredictions(
        { input: v, types: ["address"], componentRestrictions: { country: "ca" } },
        (preds: Prediction[] | null) => {
          setPredictions(preds ?? []);
          setOpen((preds?.length ?? 0) > 0);
        },
      );
    }, 250);
  }

  function choose(pred: Prediction) {
    onChange(pred.description);
    setOpen(false);
    setPredictions([]);
    placesService.current.getDetails(
      { placeId: pred.place_id, fields: ["address_components", "formatted_address"] },
      (place: any, status: string) => {
        if (status !== "OK" || !place) {
          onSelect({ formatted: pred.description, postalCode: "", city: "" });
          return;
        }
        let postalCode = "";
        let city = "";
        for (const c of (place.address_components ?? []) as any[]) {
          if (c.types.includes("postal_code")) postalCode = c.long_name;
          if (c.types.includes("locality")) city = c.long_name;
        }
        onSelect({ formatted: place.formatted_address ?? pred.description, postalCode, city });
      },
    );
  }

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary pointer-events-none" />
        <Input
          placeholder={ready ? "Start typing your address…" : "Property address or postal code"}
          value={value}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => predictions.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          autoComplete="off"
          className="pl-9"
        />
      </div>
      {open && predictions.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full bg-white border border-brand-border rounded-xl shadow-lg overflow-hidden">
          {predictions.map((p) => (
            <li key={p.place_id}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  choose(p);
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-brand-text hover:bg-brand-bg flex items-start gap-2"
              >
                <MapPin className="w-3.5 h-3.5 mt-0.5 text-brand-text-secondary flex-shrink-0" />
                {p.description}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
