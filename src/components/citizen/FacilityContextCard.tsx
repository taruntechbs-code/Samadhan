import React, { useEffect, useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { EvidenceBadge } from '../common/EvidenceBadge';
import { fetchFacilitiesSearch, FacilityRecord } from '../../services/apiClient';
import { useTranslation } from '../../i18n';
import { Hospital, MapPin, CheckCircle, Info, Sparkles, Building } from 'lucide-react';

interface FacilityContextCardProps {
  queryText: string;
  facilityDomain?: 'HEALTHCARE' | 'GENERAL';
}

export const FacilityContextCard: React.FC<FacilityContextCardProps> = ({
  queryText,
  facilityDomain,
}) => {
  const { t } = useTranslation();
  const [matchedFacility, setMatchedFacility] = useState<FacilityRecord | null>(null);

  useEffect(() => {
    if (facilityDomain !== 'HEALTHCARE' || !queryText || queryText.trim().length < 3) {
      setMatchedFacility(null);
      return;
    }

    let isMounted = true;

    // Extract potential geographic and facility tokens from user query
    const cleanQuery = queryText
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    fetchFacilitiesSearch({ q: cleanQuery, limit: 3 })
      .then(res => {
        if (!isMounted) return;
        if (res.results && res.results.length > 0) {
          setMatchedFacility(res.results[0]);
        } else {
          setMatchedFacility(null);
        }
      })
      .catch(() => {
        if (isMounted) {
          setMatchedFacility(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [queryText, facilityDomain]);

  if (facilityDomain !== 'HEALTHCARE') return null;

  return (
    <Card
      variant="standard"
      style={{
        border: '1.5px solid var(--md-sys-color-primary-container)',
        background: '#FDFBFE',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.875rem',
        marginTop: '0.75rem',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              backgroundColor: 'var(--md-sys-color-secondary-container)',
              color: 'var(--md-sys-color-on-secondary-container)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Hospital size={18} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--md-sys-color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {t('facility.badge')}
            </span>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--md-sys-color-on-surface)', margin: 0 }}>
              {matchedFacility ? matchedFacility.facilityName : t('facility.detectedHeading')}
            </h4>
          </div>
        </div>

        {matchedFacility && (
          <Badge type="primary">
            <Sparkles size={12} />
            <span>{matchedFacility.facilityType}</span>
          </Badge>
        )}
      </div>

      {/* Matched Facility Specific Information */}
      {matchedFacility ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {/* Location details */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--md-sys-color-on-surface)', fontSize: '0.875rem' }}>
            <MapPin size={15} style={{ color: 'var(--md-sys-color-primary)', flexShrink: 0 }} />
            <span>
              <strong>{matchedFacility.subdistrict || matchedFacility.district}</strong>
              {matchedFacility.subdistrict && matchedFacility.district !== matchedFacility.subdistrict ? ` • ${matchedFacility.district}` : ''}
              {` • ${matchedFacility.state}`}
            </span>
          </div>

          {/* Metadata chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
            {matchedFacility.locationType && (
              <span className="chip chip-secondary" style={{ fontSize: '0.75rem' }}>
                {matchedFacility.locationType}
              </span>
            )}
            {matchedFacility.typeOfFacility && (
              <span className="chip chip-secondary" style={{ fontSize: '0.75rem' }}>
                {matchedFacility.typeOfFacility}
              </span>
            )}
            {matchedFacility.active && (
              <span className="chip chip-low" style={{ fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <CheckCircle size={12} />
                <span>{t('facility.activeStatus')}</span>
              </span>
            )}
            {matchedFacility.address && (
              <span style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
                {matchedFacility.address}
              </span>
            )}
          </div>

          {/* Footer Lineage & Traceability */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.5rem',
              borderTop: '1px solid var(--md-sys-color-border-subtle)',
              paddingTop: '0.625rem',
              fontSize: '0.75rem',
              color: 'var(--md-sys-color-on-surface-variant)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Building size={14} />
              <span>{t('facility.contextNotice')}</span>
            </div>

            <EvidenceBadge
              evidence={{
                dataset: 'facility_directory',
                entity: matchedFacility.facilityName,
                metric: 'geographic_jurisdiction',
                value: `${matchedFacility.district}, ${matchedFacility.state}`,
                period: 'National Facility Registry',
                sourceUrl: 'https://facility.ndhm.gov.in',
                sourceNote: 'National public healthcare facility directory for geographic jurisdiction resolution.',
              }}
              label={t('facility.directoryEvidence')}
            />
          </div>
        </div>
      ) : (
        /* Helpful Hint when Healthcare is detected without specific geographic mention */
        <div
          style={{
            backgroundColor: 'var(--md-sys-color-surface-container-low)',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.625rem',
            fontSize: '0.8125rem',
            color: 'var(--md-sys-color-on-surface-variant)',
            lineHeight: 1.4,
          }}
        >
          <Info size={16} style={{ color: 'var(--md-sys-color-primary)', marginTop: '2px', flexShrink: 0 }} />
          <div>
            <span>{t('facility.guidanceHint')}</span>
          </div>
        </div>
      )}
    </Card>
  );
};
