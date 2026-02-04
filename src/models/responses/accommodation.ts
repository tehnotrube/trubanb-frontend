export interface AccommodationResponseDto {
  id: string;
  name: string;
  location: string;
  amenities: string[];
  photoUrls?: string[];          
  minGuests: number;
  maxGuests: number;
  hostId: string;
  autoApprove: boolean;
  basePrice: number;
  createdAt: string;              
  updatedAt: string;             
  isPerUnit: boolean;

  blockedPeriods: BlockResponseDto[];
  accommodationRules: RuleResponseDto[];

  available?: boolean;
  totalPriceForStay?: number;
  pricePerNight?: number;
  appliedRulesCount?: number;
}

export interface RuleResponseDto {
  id: string;
  startDate: string;     // ISO date string
  endDate: string;       // ISO date string
  overridePrice?: number;
  multiplier: number;
  periodType?: string;   // e.g. "SEASONAL", "WEEKEND", etc.
}

export interface BlockResponseDto {
  id: string;
  startDate: string;     // ISO date string
  endDate: string;       // ISO date string
  reason: 'RESERVATION' | 'MANUAL';
}