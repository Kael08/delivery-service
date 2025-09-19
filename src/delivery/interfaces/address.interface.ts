interface Coords {
    lat: number;
    long: number;
}

interface GeozoneRoutes {
    name: string
}

export interface Address {
    address: string;
    coords: Coords;
    details: string;
    commentary: string;
    domofon:string;
    flat:string;
    floor:string;
    porch:string;
    geozoneRoutes: GeozoneRoutes[];
}

