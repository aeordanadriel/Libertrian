import { useEffect, useRef, useState } from "react";
import {
  createChart,
  ColorType,
  CandlestickSeries,
  HistogramSeries,
  type IChartApi,
  type ISeriesApi,
  type CandlestickData,
  type Time,
} from "lightweight-charts";

// ── Mock OHLCV data generators ──────────────────────────────────────────────

function generateCandles(
  startPrice: number,
  count: number,
  volatility: number,
  startTimestamp: number
): CandlestickData<Time>[] {
  const candles: CandlestickData<Time>[] = [];
  let price = startPrice;
  const interval = 4 * 60 * 60; // 4-hour bars

  for (let i = 0; i < count; i++) {
    const change = (Math.random() - 0.48) * volatility;
    const open = price;
    const close = Math.max(price + change, 0.01);
    const high = Math.max(open, close) + Math.random() * volatility * 0.4;
    const low = Math.min(open, close) - Math.random() * volatility * 0.4;
    candles.push({
      time: (startTimestamp + i * interval) as Time,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(Math.max(low, 0.01).toFixed(2)),
      close: parseFloat(close.toFixed(2)),
    });
    price = close;
  }
  return candles;
}

// Base timestamps for each timeframe (seconds)
const NOW = Math.floor(Date.now() / 1000);
const START_BY_FRAME: Record<string, number> = {
  "1D":  NOW - 24 * 60 * 60,
  "1W":  NOW - 7 * 24 * 60 * 60,
  "1M":  NOW - 30 * 24 * 60 * 60,
  "3M":  NOW - 90 * 24 * 60 * 60,
  "1Y":  NOW - 365 * 24 * 60 * 60,
};
const BARS_BY_FRAME: Record<string, number> = {
  "1D": 24, "1W": 42, "1M": 90, "3M": 180, "1Y": 365,
};

// Seed data per symbol (starting price, volatility)
const SYMBOL_PARAMS: Record<string, { price: number; vol: number }> = {
  TSLA:  { price: 406,   vol: 8 },
  COIN:  { price: 168,   vol: 6 },
  KO:    { price: 77,    vol: 1 },
  FIG:   { price: 22,    vol: 1 },
  BABA:  { price: 159,   vol: 5 },
  QQQ:   { price: 605,   vol: 6 },
  JNJ:   { price: 234,   vol: 3 },
  WMT:   { price: 128,   vol: 2 },
  BTC:   { price: 67320, vol: 1200 },
  SUI:   { price: 2.06,  vol: 0.12 },
};

// ── Theme helpers ────────────────────────────────────────────────────────────

function chartColors(dark: boolean) {
  return {
    background:   dark ? "#09090b" : "#ffffff",
    text:         dark ? "#a1a1aa" : "#52525b",
    grid:         dark ? "#1e1e21" : "#f3f4f6",
    border:       dark ? "#27272a" : "#e5e7eb",
    crosshair:    dark ? "#52525b" : "#d1d5db",
  };
}

// ── Props ────────────────────────────────────────────────────────────────────

interface TradingChartProps {
  symbol: string;
  isDarkMode: boolean;
  overlayBTC?: boolean; // show BTC+SUI overlay mode
  quoteColorUpGreen?: boolean; // dynamic green/red preference
  showVolume?: boolean;
  showGrid?: boolean;
  enableCrosshair?: boolean;
  extendedHours?: boolean;
}

const TIMEFRAMES = ["1D", "1W", "1M", "3M", "1Y"];

// ── Component ────────────────────────────────────────────────────────────────

export default function TradingChart({ 
  symbol, 
  isDarkMode, 
  overlayBTC, 
  quoteColorUpGreen = true,
  showVolume = true,
  showGrid = true,
  enableCrosshair = true,
  extendedHours = true
}: TradingChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef     = useRef<IChartApi | null>(null);
  const series1Ref   = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const series2Ref   = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);

  const [timeframe, setTimeframe]     = useState("1M");
  const [showOverlay, setShowOverlay] = useState(overlayBTC ?? false);

  // Sync prop changes to local overlay state
  useEffect(() => {
    setShowOverlay(overlayBTC ?? false);
  }, [overlayBTC]);

  // ── Create chart on mount ──────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;
    const colors = chartColors(isDarkMode);

    const chart = createChart(containerRef.current, {
      layout: {
        background:    { type: ColorType.Solid, color: colors.background },
        textColor:     colors.text,
        attributionLogo: false,
      },
      grid: {
        vertLines:   { color: colors.grid, visible: showGrid !== false },
        horzLines:   { color: colors.grid, visible: showGrid !== false },
      },
      crosshair: {
        vertLine: { color: colors.crosshair, labelBackgroundColor: "#10b981", visible: enableCrosshair !== false },
        horzLine: { color: colors.crosshair, labelBackgroundColor: "#10b981", visible: enableCrosshair !== false },
      },
      rightPriceScale: {
        borderColor: colors.border,
        textColor:   colors.text,
      },
      leftPriceScale: {
        visible:     true,
        borderColor: colors.border,
        textColor:   colors.text,
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
      timeScale: {
        borderColor:       colors.border,
        timeVisible:       true,
        secondsVisible:    false,
        rightOffset:       5,
        barSpacing:        8,
        fixLeftEdge:       true,
        fixRightEdge:      true,
      },
      handleScroll:   true,
      handleScale:    true,
      width:  containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
    });

    chartRef.current = chart;

    const initialUp = quoteColorUpGreen !== false ? "#10b981" : "#f43f5e";
    const initialDown = quoteColorUpGreen !== false ? "#f43f5e" : "#10b981";

    // Primary candlestick series (right price scale)
    const s1 = chart.addSeries(CandlestickSeries, {
      upColor:          initialUp,
      downColor:        initialDown,
      borderUpColor:    initialUp,
      borderDownColor:  initialDown,
      wickUpColor:      initialUp,
      wickDownColor:    initialDown,
      priceScaleId:     "right",
    });
    series1Ref.current = s1;

    // Volume Histogram Series
    const volSeries = chart.addSeries(HistogramSeries, {
      priceScaleId: "volume",
      priceFormat: {
        type: "volume",
      },
    });
    chart.priceScale("volume").applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });
    volumeSeriesRef.current = volSeries;

    // Resize observer
    const ro = new ResizeObserver(() => {
      if (containerRef.current) {
        chart.applyOptions({
          width:  containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    });
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      chart.remove();
      chartRef.current  = null;
      series1Ref.current = null;
      series2Ref.current = null;
      volumeSeriesRef.current = null;
    };
  }, []); // run once

  // ── Sync theme changes ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!chartRef.current) return;
    const colors = chartColors(isDarkMode);
    chartRef.current.applyOptions({
      layout: {
        background: { type: ColorType.Solid, color: colors.background },
        textColor:  colors.text,
      },
      grid: {
        vertLines: { color: colors.grid, visible: showGrid !== false },
        horzLines: { color: colors.grid, visible: showGrid !== false },
      },
      crosshair: {
        vertLine: { color: colors.crosshair, labelBackgroundColor: "#10b981", visible: enableCrosshair !== false },
        horzLine: { color: colors.crosshair, labelBackgroundColor: "#10b981", visible: enableCrosshair !== false },
      },
      rightPriceScale: { borderColor: colors.border, textColor: colors.text },
      leftPriceScale:  { borderColor: colors.border, textColor: colors.text },
      timeScale:       { borderColor: colors.border },
    });
  }, [isDarkMode, showGrid, enableCrosshair]);

  // ── Sync quote colors ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!series1Ref.current) return;
    const upCol = quoteColorUpGreen !== false ? "#10b981" : "#f43f5e";
    const downCol = quoteColorUpGreen !== false ? "#f43f5e" : "#10b981";
    series1Ref.current.applyOptions({
      upColor:          upCol,
      downColor:        downCol,
      borderUpColor:    upCol,
      borderDownColor:  downCol,
      wickUpColor:      upCol,
      wickDownColor:    downCol,
    });
  }, [quoteColorUpGreen]);

  // ── Update data when symbol / timeframe / overlay changes ──────────────────
  useEffect(() => {
    if (!chartRef.current || !series1Ref.current) return;

    const chart = chartRef.current;
    const start = START_BY_FRAME[timeframe];
    const bars  = BARS_BY_FRAME[timeframe];

    // Primary series data
    const sym1 = showOverlay ? "BTC" : symbol;
    const baseParams = SYMBOL_PARAMS[sym1] ?? SYMBOL_PARAMS.TSLA;
    
    // Adjust volatility/price parameters slightly based on extendedHours toggle for visual distinction
    const volMult = extendedHours ? 1.0 : 0.7;
    const priceMult = extendedHours ? 1.0 : 0.98;
    const p1 = {
      price: baseParams.price * priceMult,
      vol: baseParams.vol * volMult
    };

    const data1 = generateCandles(p1.price, bars, p1.vol, start);
    series1Ref.current.setData(data1);
    series1Ref.current.applyOptions({
      priceScaleId: showOverlay ? "right" : "right",
      title: sym1,
    });

    // Update volume data series
    if (volumeSeriesRef.current) {
      if (showVolume !== false) {
        const upCol = quoteColorUpGreen !== false ? "#10b981" : "#f43f5e";
        const downCol = quoteColorUpGreen !== false ? "#f43f5e" : "#10b981";
        const volumeData = data1.map((c) => ({
          time: c.time,
          value: Math.random() * 500000 + 50000,
          color: c.close >= c.open ? upCol : downCol,
        }));
        volumeSeriesRef.current.setData(volumeData);
      } else {
        volumeSeriesRef.current.setData([]);
      }
    }

    // Remove old overlay series
    if (series2Ref.current) {
      chart.removeSeries(series2Ref.current);
      series2Ref.current = null;
    }

    // Add SUI overlay if enabled
    if (showOverlay) {
      const baseSui = SYMBOL_PARAMS.SUI;
      const p2 = {
        price: baseSui.price * priceMult,
        vol: baseSui.vol * volMult
      };
      const data2 = generateCandles(p2.price, bars, p2.vol, start);

      const s2 = chart.addSeries(CandlestickSeries, {
        upColor:          "#14b8a6",
        downColor:        "#f97316",
        borderUpColor:    "#14b8a6",
        borderDownColor:  "#f97316",
        wickUpColor:      "#14b8a6",
        wickDownColor:    "#f97316",
        priceScaleId:     "left",
        title:            "SUI",
      });
      s2.setData(data2);
      series2Ref.current = s2;
    }

    chart.timeScale().fitContent();
  }, [symbol, timeframe, showOverlay, showVolume, quoteColorUpGreen, extendedHours]);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-1 pb-2 flex-shrink-0">
        {/* Timeframe pills */}
        <div className="flex gap-1">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                timeframe === tf
                  ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30"
                  : "text-gray-400 hover:text-black dark:hover:text-white border border-transparent"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* BTC + SUI overlay toggle */}
        <button
          onClick={() => setShowOverlay((v) => !v)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer border transition-all ${
            showOverlay
              ? "border-teal-500/40 bg-teal-500/10 text-teal-400"
              : "border-gray-200 dark:border-[#27272a] text-gray-400 hover:border-emerald-500/30"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          BTC
          <span className="text-gray-500">+</span>
          <span className="w-2 h-2 rounded-full bg-teal-400 inline-block" />
          SUI
          <span className="ml-1 opacity-60">{showOverlay ? "ON" : "OFF"}</span>
        </button>
      </div>

      {/* Chart canvas */}
      <div ref={containerRef} className="flex-1 min-h-0 rounded-lg overflow-hidden" />

      {/* Legend */}
      <div className="flex items-center gap-4 pt-1.5 px-1 text-[9px] font-bold select-none flex-shrink-0">
        <span className="flex items-center gap-1 text-gray-400">
          <span className="w-2 h-2 rounded-sm bg-emerald-500 inline-block" />
          <span className="w-2 h-2 rounded-sm bg-rose-500 inline-block" />
          {showOverlay ? "BTC (right axis)" : `${symbol} (right axis)`}
        </span>
        {showOverlay && (
          <span className="flex items-center gap-1 text-gray-400">
            <span className="w-2 h-2 rounded-sm bg-teal-400 inline-block" />
            <span className="w-2 h-2 rounded-sm bg-orange-400 inline-block" />
            SUI (left axis)
          </span>
        )}
      </div>
    </div>
  );
}
