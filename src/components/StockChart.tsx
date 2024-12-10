import React, { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

interface StockChartProps {
  data: { time: string; value: number }[];
}

const StockChart: React.FC<StockChartProps> = ({ data }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartContainerRef.current) {
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 300,
        layout: {
          background: { type: ColorType.Solid, color: '#FFFFFF' },
          textColor: '#333',
        },
        grid: {
          vertLines: { color: '#e0e0e0' },
          horzLines: { color: '#e0e0e0' },
        },
      });

      const lineSeries = chart.addLineSeries({ 
        color: '#2196F3',
      });
      lineSeries.setData(data);

      chart.timeScale().fitContent();

      const handleResize = () => {
        chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();
      };
    }
  }, [data]);

  return <div ref={chartContainerRef} />;
};

export default StockChart;