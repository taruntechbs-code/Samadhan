import React from 'react';
import { NodalGrievanceOfficer, findNodalOfficer } from '../../data/cpgramsNodalOfficers';
import { useTranslation } from '../../i18n';
import {
  User,
  Briefcase,
  Building,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Info,
  CalendarCheck2,
} from 'lucide-react';

interface NodalOfficerCardProps {
  officer?: NodalGrievanceOfficer | null;
  authorityName?: string | null;
  jurisdictionLevel?: 'CENTRAL_MINISTRY' | 'STATE_GOVERNMENT' | 'LOCAL_MUNICIPAL' | 'GENERAL';
  queryText?: string;
  className?: string;
}

export const NodalOfficerCard: React.FC<NodalOfficerCardProps> = ({
  officer,
  authorityName,
  jurisdictionLevel,
  queryText,
  className = '',
}) => {
  const { language } = useTranslation();

  // If officer not passed directly, look up deterministically
  const resolvedOfficer =
    officer ||
    (authorityName
      ? findNodalOfficer(authorityName, { jurisdictionLevel, queryText }).officer
      : null);

  if (!resolvedOfficer) {
    return (
      <div
        className={`nodal-officer-card ${className}`}
        style={{
          backgroundColor: '#F8FAFC',
          border: '1px solid var(--civic-border-light)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.15rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--civic-text-secondary)' }}>
          <Info size={15} style={{ color: 'var(--civic-brand)' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {language === 'hi' ? 'सत्यापित सीपीग्राम्स संपर्क' : 'VERIFIED GRIEVANCE CONTACT'}
          </span>
        </div>
        <p style={{ fontSize: '0.8125rem', color: 'var(--civic-text-muted)', margin: 0, lineHeight: 1.5 }}>
          {language === 'hi'
            ? 'इस प्राधिकरण के लिए आधिकारिक सीपीग्राम्स नोडल अधिकारी जानकारी उपलब्ध नहीं है।'
            : 'Official CPGRAMS nodal officer information not available for this authority.'}
        </p>
        <div style={{ fontSize: '0.75rem', color: 'var(--civic-text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
          <ShieldCheck size={13} style={{ color: 'var(--civic-brand)' }} />
          <span>
            {language === 'hi'
              ? 'आपकी शिकायत प्रशासनिक चैनलों के माध्यम से संबंधित विभाग को प्रेषित की जाएगी।'
              : 'Grievance allocation will proceed through standard administrative workflow.'}
          </span>
        </div>
      </div>
    );
  }

  const isStateEscalation = resolvedOfficer.sourceType === 'STATE_UT';

  return (
    <div
      className={`nodal-officer-card ${className}`}
      style={{
        backgroundColor: '#F8FAFC',
        border: '1px solid #E2E8F0',
        borderRadius: 'var(--radius-md)',
        padding: '1.15rem 1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.875rem',
        position: 'relative',
      }}
    >
      {/* Header Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
          paddingBottom: '0.65rem',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <ShieldCheck size={16} style={{ color: 'var(--civic-brand)' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--civic-brand-dark)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {language === 'hi' ? 'सत्यापित सीपीग्राम्स नोडल अधिकारी' : 'VERIFIED GRIEVANCE CONTACT'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span
            className="chip"
            style={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              padding: '0.15rem 0.5rem',
              backgroundColor: isStateEscalation ? '#EEF2FF' : '#F1F5F9',
              color: isStateEscalation ? '#3730A3' : '#334155',
              border: '1px solid #CBD5E1',
            }}
          >
            {isStateEscalation
              ? (language === 'hi' ? 'राज्य / केंद्र शासित प्रदेश नोडल' : 'State / UT Nodal Directory')
              : (language === 'hi' ? 'केंद्रीय नोडल संवर्ग' : 'Central Nodal Directory')}
          </span>
        </div>
      </div>

      {/* Officer Identity and Organisation */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#EFF6FF',
              color: '#1D4ED8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '0.1rem',
            }}
          >
            <User size={17} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h4
              style={{
                margin: 0,
                fontSize: '1rem',
                fontWeight: 800,
                color: 'var(--civic-text-primary)',
                lineHeight: 1.3,
                wordBreak: 'break-word',
              }}
            >
              {resolvedOfficer.name}
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem', color: 'var(--civic-text-secondary)', fontSize: '0.8125rem', fontWeight: 600 }}>
              <Briefcase size={13} style={{ flexShrink: 0, opacity: 0.8 }} />
              <span style={{ wordBreak: 'break-word' }}>{resolvedOfficer.designation}</span>
            </div>
          </div>
        </div>

        {/* Organisation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--civic-text-secondary)', fontSize: '0.8125rem', paddingLeft: '2.5rem' }}>
          <Building size={13} style={{ flexShrink: 0, opacity: 0.7 }} />
          <span style={{ fontWeight: 600, color: 'var(--civic-text-primary)' }}>{resolvedOfficer.organisation}</span>
        </div>

        {/* Address if available */}
        {resolvedOfficer.address && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', color: 'var(--civic-text-muted)', fontSize: '0.75rem', paddingLeft: '2.5rem', lineHeight: 1.4, marginTop: '0.15rem' }}>
            <MapPin size={12} style={{ flexShrink: 0, marginTop: '0.15rem', opacity: 0.7 }} />
            <span>{resolvedOfficer.address}</span>
          </div>
        )}
      </div>

      {/* Direct Verified Contact Channels (Interactive & Touch Friendly >=44px) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.5rem',
          marginTop: '0.15rem',
        }}
      >
        {resolvedOfficer.phone && (
          <a
            href={`tel:${resolvedOfficer.phone.split(',')[0].replace(/[^0-9+]/g, '')}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.55rem 0.85rem',
              minHeight: '44px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--civic-text-primary)',
              textDecoration: 'none',
              fontSize: '0.8125rem',
              fontWeight: 600,
              transition: 'background-color 0.15s ease, border-color 0.15s ease',
            }}
            aria-label={`Call Nodal Officer at ${resolvedOfficer.phone}`}
          >
            <Phone size={14} style={{ color: 'var(--civic-brand)', flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {resolvedOfficer.phone}
            </span>
          </a>
        )}

        {resolvedOfficer.email && (
          <a
            href={`mailto:${resolvedOfficer.email}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.55rem 0.85rem',
              minHeight: '44px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--civic-text-primary)',
              textDecoration: 'none',
              fontSize: '0.8125rem',
              fontWeight: 600,
              transition: 'background-color 0.15s ease, border-color 0.15s ease',
            }}
            aria-label={`Email Nodal Officer at ${resolvedOfficer.email}`}
          >
            <Mail size={14} style={{ color: 'var(--civic-brand)', flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {resolvedOfficer.email}
            </span>
          </a>
        )}
      </div>

      {/* Official Directory Provenance & Disclaimer Footer */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
          paddingTop: '0.65rem',
          borderTop: '1px solid #E2E8F0',
          fontSize: '0.6875rem',
          color: 'var(--civic-text-muted)',
          lineHeight: 1.45,
        }}
      >
        <p style={{ margin: 0 }}>
          {language === 'hi'
            ? 'यह अधिकारी आधिकारिक सीपीग्राम्स नोडल लोक शिकायत अधिकारी निर्देशिका में सूचीबद्ध हैं। अंतिम शिकायत आवंटन प्रशासनिक प्रसंस्करण के अधीन है।'
            : 'This officer is listed in the official CPGRAMS Nodal Public Grievance Officer directory. Final grievance allocation remains subject to administrative processing.'}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <CalendarCheck2 size={12} style={{ color: 'var(--civic-brand)' }} />
            <span>
              Source: Official CPGRAMS directory · bundled dataset · verified {resolvedOfficer.verifiedAt}
            </span>
          </div>

          <a
            href={resolvedOfficer.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              color: 'var(--civic-brand)',
              fontWeight: 700,
              textDecoration: 'none',
              fontSize: '0.6875rem',
            }}
          >
            <span>{language === 'hi' ? 'आधिकारिक सीपीग्राम्स निर्देशिका देखें' : 'View official CPGRAMS directory'}</span>
            <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </div>
  );
};
