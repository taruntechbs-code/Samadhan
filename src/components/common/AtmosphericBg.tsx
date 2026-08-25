import React from 'react';

export const AtmosphericBg: React.FC = () => {
  return (
    <div className="atmospheric-wrapper" aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {/* Top Left Primary Orb */}
      <div
        className="atmospheric-blob blob-primary"
        style={{
          width: '500px',
          height: '500px',
          top: '-150px',
          left: '-100px',
          opacity: 0.12,
        }}
      />
      {/* Top Right Tertiary Soft Rose Orb */}
      <div
        className="atmospheric-blob blob-tertiary"
        style={{
          width: '450px',
          height: '450px',
          top: '5%',
          right: '-120px',
          opacity: 0.08,
        }}
      />
      {/* Mid Center Secondary Lilac Orb */}
      <div
        className="atmospheric-blob blob-secondary"
        style={{
          width: '600px',
          height: '600px',
          top: '40%',
          left: '30%',
          opacity: 0.15,
        }}
      />
      {/* Bottom Left Primary Glow */}
      <div
        className="atmospheric-blob blob-primary"
        style={{
          width: '550px',
          height: '550px',
          bottom: '-150px',
          left: '5%',
          opacity: 0.09,
        }}
      />
    </div>
  );
};
