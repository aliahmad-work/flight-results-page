import React from "react";
import { FlightOffer } from "@/types/flight";
import { formatCurrency } from "@/lib/formatters";
import { parseIsoWithOffset, formatDuration } from "@/lib/date-utils";

interface FlightCardProps {
  offer: FlightOffer;
}

export function FlightCard({ offer }: FlightCardProps) {
  const depTime = parseIsoWithOffset(offer.departureTime);
  const arrTime = parseIsoWithOffset(offer.arrivalTime);
  const durationStr = formatDuration(offer.totalDurationMinutes);

  const stopsLabel =
    offer.stopsCount === 0
      ? "Non-stop"
      : offer.stopsCount === 1
      ? `1 Stop (${offer.stopAirports.join(", ")})`
      : `${offer.stopsCount} Stops (${offer.stopAirports.join(", ")})`;

  return (
    <li
      className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 overflow-hidden"
      aria-label={`Flight offer by ${offer.airline}, flight ${offer.flightNumber}, from ${offer.origin.city} to ${offer.destination.city}, priced at ${formatCurrency(offer.price, offer.currency)}`}
    >
      <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left / Center Flight Leg Details */}
        <div className="flex-1 space-y-4">
          {/* Airline Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-xs tracking-wider border border-blue-100"
                aria-hidden="true"
              >
                {offer.airlineCode}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 leading-tight">
                  {offer.airline}
                </h3>
                <p className="text-xs text-gray-500 font-mono">
                  {offer.flightNumber}
                </p>
              </div>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
              {offer.cabinClass}
            </span>
          </div>

          {/* Schedule Visualization */}
          <div className="grid grid-cols-3 gap-2 items-center py-1">
            {/* Departure */}
            <div>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                  {depTime.time}
                </span>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded" title={`Departure Timezone: ${depTime.offset}`}>
                  {depTime.offset || "Local"}
                </span>
              </div>
              <p className="text-xs font-bold text-gray-800 mt-0.5">
                {offer.origin.code}
              </p>
              <p className="text-xs text-gray-500 truncate" title={`${offer.origin.city} (${offer.origin.airport})`}>
                {offer.origin.city}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {depTime.shortDate}
              </p>
            </div>

            {/* Duration and Stops */}
            <div className="flex flex-col items-center px-1">
              <span className="text-xs font-medium text-gray-500 mb-1">
                {durationStr}
              </span>
              <div className="relative w-full flex items-center justify-center my-1" aria-hidden="true">
                <div className="w-full h-0.5 bg-gray-200"></div>
                {offer.stopsCount > 0 ? (
                  <div
                    className="absolute w-2 h-2 rounded-full bg-amber-500 border border-white"
                    title={`Stop at ${offer.stopAirports.join(", ")}`}
                  ></div>
                ) : (
                  <div className="absolute w-2 h-2 rounded-full bg-emerald-500 border border-white"></div>
                )}
              </div>
              <span
                className={`text-xs font-medium mt-0.5 text-center ${
                  offer.stopsCount === 0 ? "text-emerald-700" : "text-amber-700"
                }`}
              >
                {stopsLabel}
              </span>
            </div>

            {/* Arrival */}
            <div className="text-right">
              <div className="flex items-baseline justify-end gap-1.5 flex-wrap">
                <span className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                  {arrTime.time}
                </span>
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded" title={`Arrival Timezone: ${arrTime.offset}`}>
                  {arrTime.offset || "Local"}
                </span>
              </div>
              <p className="text-xs font-bold text-gray-800 mt-0.5">
                {offer.destination.code}
              </p>
              <p className="text-xs text-gray-500 truncate" title={`${offer.destination.city} (${offer.destination.airport})`}>
                {offer.destination.city}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {arrTime.shortDate}
              </p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 pt-1 flex-wrap text-xs text-gray-600">
            <span className="inline-flex items-center gap-1 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded text-gray-600">
              🧳 {offer.baggageAllowance}
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded ${
                offer.refundable
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-gray-50 text-gray-500 border border-gray-200"
              }`}
            >
              {offer.refundable ? "Refundable" : "Non-refundable"}
            </span>
          </div>
        </div>

        {/* Right Pricing Column */}
        <div className="md:border-l md:border-gray-100 md:pl-6 flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 pt-4 md:pt-0 border-t border-gray-100 md:border-t-0">
          <div className="md:text-right">
            <span className="text-xs text-gray-500 block">Total Fare</span>
            <span className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              {formatCurrency(offer.price, offer.currency)}
            </span>
            <span className="text-[11px] text-gray-400 block mt-0.5">includes taxes & fees</span>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 active:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors shadow-xs cursor-pointer"
            aria-label={`Select offer with ${offer.airline} for ${formatCurrency(offer.price, offer.currency)}`}
          >
            Select Flight
          </button>
        </div>
      </div>
    </li>
  );
}
