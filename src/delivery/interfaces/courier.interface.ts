interface WorkingTime {
  start: string;
  end: string;
}

interface Transport {
  _id: string;
  transportSkill: string;
  maxVolume: number;
  maxWeight: number;
}

interface Courier {
  _id: string;
  fullName: string;
  status: string;
  companyId: string;
  transportId: string;
  transport?: Transport;
  workingDays: number[];
  workingTime: WorkingTime;
  currentPosition: [number, number];
  lastOnline: string;
  maxVolume: number;
  maxWeight: number;
}

export interface CourierResponse {
  status: string;
  data: Courier[];
}