"use client";

import { useEffect, useRef, useState } from "react";
import { geocodeAddress } from "@/lib/geo/geocode";
import {
  getGoogleMapsApiKey,
  loadGoogleMaps,
} from "@/lib/googleMaps/loadGoogleMaps";

const mapBoxStyle = {
  width: "100%",
  height: "220px",
} as const;

const DEFAULT_ZOOM = 15;

export default function TrainingSessionLocationMap({
  address,
}: {
  address: string;
}) {
  const apiKey = getGoogleMapsApiKey();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const query = address.trim();
    if (!apiKey || !query || !canvasRef.current) return;

    let cancelled = false;
    let marker: google.maps.Marker | null = null;

    (async () => {
      const coord = await geocodeAddress(query);
      if (cancelled) return;
      if (!coord) {
        setFailed(true);
        return;
      }
      const maps = await loadGoogleMaps(apiKey);
      if (cancelled || !canvasRef.current) return;

      const map = new maps.Map(canvasRef.current, {
        center: coord,
        zoom: DEFAULT_ZOOM,
        disableDefaultUI: true,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        gestureHandling: "cooperative",
      });
      marker = new maps.Marker({ map, position: coord, title: query });
    })().catch(() => {
      if (!cancelled) setFailed(true);
    });

    return () => {
      cancelled = true;
      marker?.setMap(null);
      marker = null;
    };
  }, [address, apiKey]);

  if (!apiKey || !address.trim() || failed) return null;

  return (
    <div
      ref={canvasRef}
      className="support_service_training_session_detail__map"
      style={mapBoxStyle}
      role="application"
      aria-label={`Map showing training location: ${address}`}
    />
  );
}
