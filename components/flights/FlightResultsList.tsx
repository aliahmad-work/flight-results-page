import React from "react";
import { FlightOffer } from "@/types/flight";
import { FlightCard } from "./FlightCard";

interface FlightResultsListProps {
  offers: FlightOffer[];
}

export function FlightResultsList({ offers }: FlightResultsListProps) {
  return (
    <ul className="space-y-4" role="list" aria-label="Available flight offers">
      {offers.map((offer) => (
        <FlightCard key={offer.id} offer={offer} />
      ))}
    </ul>
  );
}
