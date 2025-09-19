interface Timestamps {
    createdAt: string;
    updatedAt: string;
}

interface ClientTimestamps extends Timestamps {}

interface Client {
    _id: string;
    timestamps: ClientTimestamps;
    isSendEmail: boolean;
    isSendSMS: boolean;
    companyId: string;
    createdUserId: string;
    name: string;
    phone: string;
    email: string;
    allPhones: string[];
    description: string;
    customId: string;
}

interface Period {
    startDate: string;
    endDate: string;
}

interface Coords {
    lat: number;
    long: number;
}

interface GeozoneRoute {
    name: string;
}

interface Address {
    coords: Coords;
    details: string;
    commentary: string;
    domofon: string;
    flat: string;
    floor: string;
    porch: string;
    _isGeoCoding: boolean;
    _isValidateCoords: boolean;
    geoJSON: {
        type: string;
        coordinates: number[];
    };
    address: string;
    geozoneRoutes: GeozoneRoute[];
}

interface ReboxInformation {
    isEnabled: boolean;
    storageId: string;
    smsConfirmation: boolean;
}

interface WrongAddresses {
    addressTo: boolean;
    addressToError: string;
    addressFrom: boolean;
    addressFromError: string;
}

interface Dimensions {
    height: number;
    width: number;
    depth: number;
}

interface GoodTimestamps extends Timestamps {}

interface Good {
    _id: string;
    timestamps: GoodTimestamps;
    dimensions: Dimensions;
    code: string;
    name: string;
    volume: number;
    weight: number;
    quantity: number;
    deliveredQuantity: number;
    price: number;
    requiredSkill: string;
    caseCoefficient: number;
    companyId: string;
    isDemo: boolean;
    searchField: string;
    storageAddress: string;
    goodId: string;
}

interface Sender {
    fullName: string;
    phone: string;
}

interface WrongGoods {
    weight: boolean;
    volume: boolean;
    caseCoefficient: boolean;
}

interface ApplicationData {
    _id: string;
    shortId: string;
    timestamps: Timestamps;
    externalId: string;
    customId: string;
    client: Client;
    courier: null;
    companyId: string;
    price: number;
    planDeliveryPeriod: Period;
    planDeliveryLunchPeriod: Period;
    planPickupPeriod: Period;
    planPickupLunchPeriod: Period;
    addressFrom: Address;
    addressTo: Address;
    appType: string;
    volume: number;
    waitTime: number;
    loadTime: number;
    requireTransportSkill: string;
    status: string;
    statusGroup: string;
    searchField: string;
    createdUserId: string;
    createdUserName: string;
    createdUserPhone: string;
    time_bucket: string[];
    delivery_time_bucket: string[];
    isGhost: boolean;
    ghostIds: any[]; 
    generalPrice: number;
    priceType: string;
    priority: number;
    reboxInformation: ReboxInformation;
    serviceType: number;
    wrongAddresses: WrongAddresses;
    caseVolume: number;
    goodsCount: number;
    goodsPrice: number;
    hasWrongAddress: boolean;
    weight: number;
    routeId: null;
    isCustomIdExternal: boolean;
    index: number;
    isBaseScheduler: boolean;
    commentsCount: number;
    rejectCount: number;
    servicesPrice: number;
    imagesCount: number;
    additionalDetails: string;
    allDetails: any[]; 
    details: string;
    isDemo: boolean;
    schedulerId: string;
    days: any[]; 
    monthDays: any[]; 
    potentialCouriersIds: any[]; 
    baseSchedulerRef: string;
    pickupAppRef: string;
    typeOfDeliver: string;
    waitingStarted: null;
    waitingEnded: null;
    waitingInArea: boolean;
    deliveryPrice: number;
    finishedInArea: boolean;
    customGoodsPrice: number;
    pickedMoneyAmount: number;
    partlyShipped: boolean;
    courierNote: string;
    statusName: string;
    hasWrongGoods: boolean;
    sender: Sender;
    delivery_date_time_bucket: string[];
    isDispatcher: boolean;
    goods: Good[];
    dimensions: Dimensions;
    tags: any[]; 
    courierWentDate: null;
    qrUrl: string;
    distance: number;
    wentDate: null;
    late: number;
    wrongGoods: WrongGoods;
    updated: string;
}

export interface ApplicationResponse {
    _id: string;
    externalId: string;
    status: string;
    companyId: string;
    data: ApplicationData;
}