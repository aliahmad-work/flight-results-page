export type SimulationMode = "ok" | "slow" | "error" | "empty" | "partial";

export interface AirportInfo {
  code: string;       // e.g., "KHI", "DXB", "LHR"
  city: string;       // e.g., "Karachi", "Dubai", "London"
  airport: string;    // e.g., "Jinnah International Airport"
  terminal?: string;  // e.g., "Terminal 3"
}

export interface FlightSegment {
  airline: string;
  airlineCode: string;
  flightNumber: string;
  aircraft?: string;
  origin: AirportInfo;
  destination: AirportInfo;
  departureTime: string; // ISO 8601 with explicit timezone offset, e.g., "2026-10-15T08:30:00+05:00"
  arrivalTime: string;   // ISO 8601 with explicit timezone offset, e.g., "2026-10-15T10:45:00+04:00"
  durationMinutes: number;
}

export interface FlightOffer {
  id: string;                          // Unique offer ID, e.g., "off_khi_dxb_001"
  airline: string;                     // Primary marketing airline name, e.g., "Emirates"
  airlineCode: string;                 // e.g., "EK"
  flightNumber: string;                // e.g., "EK-601" or "EK-601 / EK-007"
  origin: AirportInfo;
  destination: AirportInfo;
  departureTime: string;               // ISO 8601 with explicit timezone offset
  arrivalTime: string;                 // ISO 8601 with explicit timezone offset
  totalDurationMinutes: number;        // Total duration in minutes (including layovers)
  stopsCount: number;                  // 0 = Direct, 1 = 1 Stop, etc.
  stopAirports: string[];              // e.g., ["DOH"] or []
  cabinClass: "Economy" | "Premium Economy" | "Business" | "First";
  price: number;                       // Base + taxes numeric value
  currency: string;                    // e.g., "PKR"
  refundable: boolean;
  baggageAllowance: string;            // e.g., "30 kg", "2 x 23 kg"
  segments: FlightSegment[];           // Detailed leg breakdown
}

export interface AirlineWarning {
  airline: string;
  airlineCode: string;
  status: "failed" | "timeout" | "unavailable";
  message: string;
}

export interface OffersApiResponse {
  success: boolean;
  simulationMode: SimulationMode;
  totalResults: number;
  offers: FlightOffer[];
  warnings?: AirlineWarning[];
  meta: {
    timestamp: string;
    executionTimeMs?: number;
    currency: string;
  };
}

export interface OffersApiErrorResponse {
  success: false;
  simulationMode: SimulationMode;
  error: {
    code: string;
    message: string;
  };
  meta: {
    timestamp: string;
  };
}
