// @flow

export const formatPricePrecision = (price: number): string => `$${(price >= 1) ? price.toFixed(2) : price.toFixed(6)}`;