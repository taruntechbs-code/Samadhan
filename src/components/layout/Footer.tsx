import React, { useState } from 'react';
import { Shield, ExternalLink, ShieldCheck } from 'lucide-react';
import { TransparencyModal } from '../common/TransparencyModal';
import { useTranslation } from '../../i18n';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const [isTrustOpen, setIsTrustOpen] = useState(false);

  return (
    <>
      <footer className="footer">
        <div className="footer-inner">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--md-sys-color-primary)' }}>
              <Shield size={16} />
              <span>{t('footer.title')}</span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
              {t('footer.desc')}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.8125rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-text"
              style={{ padding: '0.25rem 0.5rem', minHeight: 'auto', fontSize: '0.8125rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              onClick={() => setIsTrustOpen(true)}
            >
              <ShieldCheck size={14} />
              <span>{t('footer.methodology')}</span>
            </button>
            <span>•</span>
            <a
              href="https://pgportal.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--md-sys-color-primary)', textDecoration: 'none' }}
            >
              <span>{t('footer.officialPortal')}</span>
              <ExternalLink size={12} />
            </a>
            <span>•</span>
            <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
              {t('footer.copyright')}
            </span>
          </div>
        </div>
      </footer>

      <TransparencyModal isOpen={isTrustOpen} onClose={() => setIsTrustOpen(false)} />
    </>
  );
};
