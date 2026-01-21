export type Accommodation = {
    id: number;
    name: string;
    location: string;
    image: string;
    guests: { min: number; max: number };
    amenities: { wifi: boolean; ac: boolean; parking: boolean };
    totalPrice: number;
    pricePerNight: number;
    priceType: string;
    rating: number;
};