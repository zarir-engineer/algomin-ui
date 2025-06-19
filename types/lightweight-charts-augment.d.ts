// types/lightweight-charts-augment.d.ts

import {
  IChartApi as _IChartApi,
  ICandlestickSeriesApi,
  CandlestickSeriesOptions,
} from 'lightweight-charts';

declare module 'lightweight-charts' {
  // Re-export everything so TS still knows about createChart, etc.
  export * from 'lightweight-charts';

  // Then *merge* into the existing IChartApi
  interface IChartApi extends _IChartApi {
    addCandlestickSeries(
      options?: CandlestickSeriesOptions
    ): ICandlestickSeriesApi;
  }
}
