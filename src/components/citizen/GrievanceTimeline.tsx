import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';

export interface TimelineItem {
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
}

export interface GrievanceTimelineProps {
  items: TimelineItem[];
}

export const GrievanceTimeline: React.FC<GrievanceTimelineProps> = ({ items }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0', position: 'relative', padding: '0.5rem 0' }}>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <div key={idx} style={{ display: 'flex', gap: '1.25rem', position: 'relative' }}>
            {/* Left Timeline Dot & Connector Line */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: item.completed
                    ? 'var(--md-sys-color-primary-container)'
                    : 'var(--md-sys-color-surface-container-low)',
                  color: item.completed
                    ? 'var(--md-sys-color-on-primary-container)'
                    : 'var(--md-sys-color-on-surface-variant)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                }}
              >
                {item.completed ? <CheckCircle2 size={18} /> : <Clock size={16} />}
              </div>

              {!isLast && (
                <div
                  style={{
                    width: '2px',
                    flex: 1,
                    minHeight: '44px',
                    backgroundColor: item.completed
                      ? 'var(--md-sys-color-primary)'
                      : 'var(--md-sys-color-outline-variant)',
                    margin: '4px 0',
                  }}
                />
              )}
            </div>

            {/* Right Content */}
            <div style={{ paddingBottom: isLast ? '0' : '1.75rem', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h4 className="title-medium" style={{ fontSize: '1rem', color: item.completed ? 'var(--md-sys-color-on-surface)' : 'var(--md-sys-color-on-surface-variant)' }}>
                  {item.title}
                </h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)', fontWeight: 500 }}>
                  {item.timestamp}
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--md-sys-color-on-surface-variant)', marginTop: '0.2rem' }}>
                {item.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
