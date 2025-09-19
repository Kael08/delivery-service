interface Dimensions {
    height: number,
    width: number,
    depth: number,
}

export interface Good {
    code: string,
    name: string,
    volume: number,
    weight: number,
    dimensions: Dimensions,
    quantity: number,
    deliveredQuantity: number,
    price: number,
    requiredSkill: string,
    caseCoefficient: number,
    storageAddress: string,
}