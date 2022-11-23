export interface GeoPosition {
    longitude: number;
    latitude: number;
}

export interface MeteorImpact {
    /** Unique identifier, randomized */
    id: string;
    type: string;
    position: GeoPosition;
    /** Radius in meters */
    threatRadius: number;
    /** DD/MM/yyyy - HH:mm */
    impactTime: string;
}