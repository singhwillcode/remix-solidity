'use client';
import { useEffect, useRef, memo } from 'react';

function PriceChartComponent() {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;

        // Check if script already exists to prevent duplicates
        if (container.current.querySelector("script")) return;

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = `
      {
        "autosize": true,
        "symbol": "COINBASE:ETHUSD",
        "interval": "1",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "enable_publishing": false,
        "backgroundColor": "rgba(0, 0, 0, 1)",
        "gridColor": "rgba(42, 46, 57, 0.3)",
        "hide_top_toolbar": true,
        "hide_legend": true,
        "save_image": false,
        "calendar": false,
        "hide_volume": true,
        "support_host": "https://www.tradingview.com"
      }`;

        const widgetContainer = container.current.querySelector('.tradingview-widget-container');
        if (widgetContainer) {
            widgetContainer.appendChild(script);
        }
    }, []);

    return (
        <div className="w-full h-[500px] bg-gray-900/50 rounded-2xl border border-gray-800 backdrop-blur-sm overflow-hidden p-4" ref={container}>
            <div className="tradingview-widget-container" style={{ height: "100%", width: "100%" }}>
                <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
            </div>
        </div>
    );
}

export const PriceChart = memo(PriceChartComponent);
