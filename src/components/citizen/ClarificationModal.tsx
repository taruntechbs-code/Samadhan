import React, { useState, useEffect, useRef } from 'react';
import { RoutingClarification } from '../../intelligence/types';
import { useTranslation } from '../../i18n';
import { HelpCircle, MapPin, ArrowRight, X, Sparkles } from 'lucide-react';

export interface ClarificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  clarification?: RoutingClarification;
  grievanceText: string;
  onResolve: (enrichedQuery: string) => void;
}

export const ClarificationModal: React.FC<ClarificationModalProps> = ({
  isOpen,
  onClose,
  clarification,
  grievanceText,
  onResolve,
}) => {
  const { language } = useTranslation();
  const [locationInput, setLocationInput] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Auto-focus the input if location type
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !clarification) return null;

  const isLocation = clarification.type === 'LOCATION';
  const isDocType = clarification.type === 'DOCUMENT_TYPE';

  const defaultLocations = [
    'Kurnool, Andhra Pradesh',
    'Pimpri Chinchwad, Maharashtra',
    'Jaipur, Rajasthan',
    'Bengaluru, Karnataka',
    'Lucknow, Uttar Pradesh',
    'Patna, Bihar',
  ];

  const suggestedLocations = clarification.suggestedLocations && clarification.suggestedLocations.length > 0
    ? clarification.suggestedLocations
    : defaultLocations;

  const handleLocationSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const loc = locationInput.trim();
    if (!loc) return;

    const base = grievanceText.trim();
    const enriched = base ? `${base}. Location: ${loc}.` : `Grievance in ${loc}.`;
    setLocationInput('');
    onResolve(enriched);
  };

  const handleQuickLocationSelect = (loc: string) => {
    const base = grievanceText.trim();
    const enriched = base ? `${base}. Location: ${loc}.` : `Grievance in ${loc}.`;
    setLocationInput('');
    onResolve(enriched);
  };

  const handleOptionSelect = (option: { label: string; querySuffix: string }) => {
    const base = grievanceText.trim();
    const enriched = base ? `${base} (${option.querySuffix})` : option.querySuffix;
    onResolve(enriched);
  };

  // Header Title
  const getModalTitle = () => {
    if (language === 'hi') {
      if (isLocation) return 'सही प्राधिकरण खोजने में हमारी सहायता करें';
      if (isDocType) return 'सेवा या दस्तावेज़ की पहचान करें';
      return 'सरकारी पोर्टल या सेवा का चयन करें';
    }
    if (isLocation) return 'Help us route this correctly';
    if (isDocType) return 'Help us identify the service';
    return 'Help us identify the portal';
  };

  // Supporting Text
  const getSupportingText = () => {
    if (language === 'hi') {
      if (isLocation) {
        return 'स्थानीय स्वच्छता और ठोस अपशिष्ट प्रबंधन की शिकायतें संबंधित नगर पालिका / नगर निगम द्वारा हल की जाती हैं। सही प्राधिकरण खोजने के लिए हमें आपका शहर या नगर पालिका का नाम चाहिए।';
      }
      return clarification.reason || 'सटीक विभाग में शिकायत भेजने के लिए कृपया संबंधित सेवा या दस्तावेज़ का चयन करें।';
    }
    if (isLocation) {
      return 'Local sanitation and waste-management grievances are handled by the relevant municipal authority. We need your location before we can identify the correct authority.';
    }
    return clarification.reason || 'Selecting the specific public service or document enables accurate statutory routing without guessing.';
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
        padding: '1rem',
        animation: 'fadeIn 0.15s ease-out',
      }}
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="clarification-modal-title"
        aria-describedby="clarification-modal-desc"
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '580px',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid var(--civic-border-light)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
        }}
      >
        {/* Header Strip */}
        <div
          style={{
            padding: '1.5rem 1.5rem 1rem 1.5rem',
            borderBottom: '1px solid var(--civic-border-light)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: isLocation ? '#EFF6FF' : 'var(--civic-brand-light)',
                color: isLocation ? '#1D4ED8' : 'var(--civic-brand)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: `1px solid ${isLocation ? '#BFDBFE' : 'var(--civic-brand-border)'}`,
              }}
            >
              {isLocation ? <MapPin size={22} /> : <HelpCircle size={22} />}
            </div>
            <div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: isLocation ? '#1D4ED8' : 'var(--civic-brand)',
                  display: 'block',
                  marginBottom: '0.15rem',
                }}
              >
                {language === 'hi' ? 'अतिरिक्त जानकारी आवश्यक' : 'CLARIFICATION REQUIRED'}
              </span>
              <h2
                id="clarification-modal-title"
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--civic-text-primary)',
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                {getModalTitle()}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.4rem',
              color: 'var(--civic-text-muted)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '44px',
              minWidth: '44px',
            }}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Question & Explanation */}
          <div>
            <h3
              style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                color: 'var(--civic-text-primary)',
                margin: '0 0 0.5rem 0',
              }}
            >
              {clarification.question}
            </h3>
            <p
              id="clarification-modal-desc"
              style={{
                fontSize: '0.875rem',
                color: 'var(--civic-text-secondary)',
                lineHeight: 1.55,
                margin: 0,
              }}
            >
              {getSupportingText()}
            </p>
          </div>

          {/* Location Specific Input Form */}
          {isLocation && (
            <form onSubmit={handleLocationSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                <label
                  htmlFor="modal-location-input"
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: 'var(--civic-text-secondary)',
                  }}
                >
                  {language === 'hi' ? 'शहर या नगर पालिका' : 'City or Municipality'}
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <input
                    id="modal-location-input"
                    ref={inputRef}
                    type="text"
                    className="input-field"
                    value={locationInput}
                    onChange={e => setLocationInput(e.target.value)}
                    placeholder={language === 'hi' ? 'शहर या नगर पालिका दर्ज करें (उदा. कुरनूल)' : 'Enter city or municipality (e.g. Kurnool)'}
                    style={{
                      flex: 1,
                      minWidth: '220px',
                      minHeight: '44px',
                      padding: '0.65rem 1rem',
                      fontSize: '0.9375rem',
                      borderRadius: 'var(--radius-input)',
                      border: '1.5px solid var(--civic-border-medium)',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    id="btn-modal-add-location"
                    disabled={!locationInput.trim()}
                    className="btn btn-filled"
                    style={{
                      minHeight: '44px',
                      padding: '0.65rem 1.25rem',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span>{language === 'hi' ? 'स्थान जोड़ें एवं पुनः विश्लेषण करें →' : 'Add Location & Re-analyze →'}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              {/* Quick Location Choices */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
                  <Sparkles size={14} style={{ color: 'var(--civic-brand)' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--civic-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {language === 'hi' ? 'त्वरित स्थान विकल्प' : 'Quick Location Choices'}
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '0.5rem',
                  }}
                >
                  {suggestedLocations.map((loc, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="btn btn-tonal"
                      onClick={() => handleQuickLocationSelect(loc)}
                      style={{
                        minHeight: '44px',
                        padding: '0.6rem 0.85rem',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--civic-border-medium)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        gap: '0.5rem',
                        textAlign: 'left',
                        transition: 'all var(--transition-fast)',
                        color: 'var(--civic-text-primary)',
                      }}
                    >
                      <MapPin size={15} style={{ color: 'var(--civic-brand)', flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{loc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}

          {/* Option-Based Choices (Document Type or Service Portal) */}
          {!isLocation && clarification.options && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
                <Sparkles size={14} style={{ color: 'var(--civic-brand)' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--civic-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {language === 'hi' ? 'संबंधित सेवा चुनें' : 'Select Relevant Service'}
                </span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: '0.6rem',
                }}
              >
                {clarification.options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="btn btn-tonal"
                    onClick={() => handleOptionSelect(opt)}
                    style={{
                      minHeight: '48px',
                      padding: '0.75rem 1rem',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid var(--civic-border-medium)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                      textAlign: 'left',
                      transition: 'all var(--transition-fast)',
                      color: 'var(--civic-text-primary)',
                    }}
                  >
                    <span>{opt.label}</span>
                    <ArrowRight size={15} style={{ color: 'var(--civic-brand)', flexShrink: 0 }} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--civic-border-light)',
            backgroundColor: 'var(--civic-canvas-subtle)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            borderBottomLeftRadius: '20px',
            borderBottomRightRadius: '20px',
          }}
        >
          <button
            type="button"
            className="btn btn-text"
            onClick={onClose}
            style={{
              minHeight: '44px',
              padding: '0.55rem 1.25rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--civic-text-secondary)',
            }}
          >
            {language === 'hi' ? 'रद्द करें' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
};
