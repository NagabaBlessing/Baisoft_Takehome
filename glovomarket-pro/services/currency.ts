const USD_TO_UGX_RATE = 3700;

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

const ugxFormatter = new Intl.NumberFormat('en-UG', {
  style: 'currency',
  currency: 'UGX',
  maximumFractionDigits: 0,
});

export const convertUsdToUgx = (usdAmount: number): number => usdAmount * USD_TO_UGX_RATE;

export const formatUsd = (usdAmount: number): string => usdFormatter.format(usdAmount);

export const formatUgxFromUsd = (usdAmount: number): string => ugxFormatter.format(convertUsdToUgx(usdAmount));

