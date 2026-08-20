import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface MetaData {
  lastShipped: {
    text: string;
    date: string;
  };
  siteUpdatedAt: string;
}

const ActivityTicker: React.FC = () => {
  const [tickerText, setTickerText] = useState('Shipped OpenFlow v0.9 & ML Churn Model');
  const [tickerDate, setTickerDate] = useState('2026-08-14');

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const localSaved = localStorage.getItem('curated_meta_json');
        if (localSaved) {
          const parsed = JSON.parse(localSaved);
          if (parsed.lastShipped) {
            setTickerText(parsed.lastShipped.text);
            setTickerDate(parsed.lastShipped.date);
            return;
          }
        }

        const res = await fetch('/data/meta.json');
        if (res.ok) {
          const data: MetaData = await res.json();
          if (data.lastShipped) {
            setTickerText(data.lastShipped.text);
            setTickerDate(data.lastShipped.date);
          }
        }
      } catch (err) {
        console.error('Failed to load activity ticker meta:', err);
      }
    };
    fetchMeta();
  }, []);

  const formatDate = (rawDate: string) => {
    try {
      const date = new Date(rawDate);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return rawDate;
    }
  };

  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-background-secondary/80 border border-border text-xs font-mono text-muted-foreground shadow-sm animate-fade-in-smooth">
      <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
      <span className="text-foreground font-semibold flex items-center gap-1.5">
        <Sparkles className="w-3 h-3 text-primary" /> {tickerText}
      </span>
      <span className="text-muted-foreground/60">•</span>
      <span className="text-muted-foreground font-normal">{formatDate(tickerDate)}</span>
    </div>
  );
};

export default ActivityTicker;
