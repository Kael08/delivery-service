export interface ApplicationPayload {
    externalId: string;
    customId: string;
    client: {
        name: string;
        isSendEmail: boolean;
        isSendSMS: boolean;
        addresses: Array<{
            address: string;
            coords: {
                lat: number;
                long: number;
            };
        }>;
    };
    price: number;
    planDeliveryPeriod: {
        startDate: string;
        endDate: string;
    };
    planDeliveryLunchPeriod: {
        startDate: string;
        endDate: string;
    };
    planPickupPeriod: {
        startDate: string;
        endDate: string;
    };
    planPickupLunchPeriod: {
        startDate: string;
        endDate: string;
    };
    addressFrom: Address;
    addressTo: Address;
    appType: string;
    volume: number;
    waitTime: number;
    loadTime: number;
    requireTransportSkill: string;
    priceType: string;
    priority: number;
    reboxInformation: {
        isEnabled: boolean;
        storageId: string;
        smsConfirmation: boolean;
    };
    weight: number;
    additionalDetails: string;
    allDetails: any[];
    details: string;
    deliveryPrice: number;
    sender: {
        fullName: string;
        phone: string;
    };
    goods: Good[];
    dimensions: {
        height: number;
        width: number;
        depth: number;
    };
    tags: string[];
    qrUrl: string;
}

export interface Address {
    address: string;
    coords: {
        lat: number;
        long: number;
    };
    details?: string;
    commentary?: string;
    domofon?: string;
    flat?: string;
    floor?: string;
    porch?: string;
    geozoneRoutes?: Array<{ name: string }>;
}

export interface Good {
    code: string;
    name: string;
    volume: number;
    weight: number;
    dimensions: {
        height: number;
        width: number;
        depth: number;
    };
    quantity: number;
    deliveredQuantity: number;
    price: number;
    requiredSkill: string;
    caseCoefficient: number;
    storageAddress: string;
}