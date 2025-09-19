export interface TimePeriod {
  startDate: string;
  endDate: string;
}

export interface TimePeriods {
  planDeliveryPeriod: TimePeriod;
  planDeliveryLunchPeriod: TimePeriod;
  planPickupPeriod: TimePeriod;
  planPickupLunchPeriod: TimePeriod;
}

export function generateTimePeriods(): TimePeriods {
  const today = new Date();
  const year = today.getUTCFullYear();
  const month = String(today.getUTCMonth() + 1).padStart(2, '0');
  const day = String(today.getUTCDate()).padStart(2, '0');

  const startTime = `${year}-${month}-${day}T09:00:00.000Z`;
  const endTime = `${year}-${month}-${day}T21:00:00.000Z`;

  return {
    planDeliveryPeriod: { startDate: startTime, endDate: endTime },
    planDeliveryLunchPeriod: { startDate: startTime, endDate: endTime },
    planPickupPeriod: { startDate: startTime, endDate: endTime },
    planPickupLunchPeriod: { startDate: startTime, endDate: endTime },
  };
}