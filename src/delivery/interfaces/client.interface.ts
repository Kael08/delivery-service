export interface ClientAddress {
  address: string;
  coords: {
    lat: number;
    long: number;
  };
  details: string;
  commentary: string;
  domofon: string;
  flat: string;
  floor: string;
  porch: string;
  geozoneRoutes: { name: string }[];
}

export interface ClientTimestamps {
  createdAt: string;
  updatedAt: string;
}

export interface ClientData {
  _id: string;
  shortId: string;
  timestamps: ClientTimestamps;
  phone: string;
  name: string;
  email: string;
  description: string;
  isSendEmail: boolean;
  isSendSMS: boolean;
  allPhones: string[];
  addresses: ClientAddress[];
  companyId: string;
  searchField: string;
  createdUserId: string;
  customId: string;
}

export interface ClientResponse {
  statusCode: number;
  status: string;
  _id: string;
  data: ClientData;
}