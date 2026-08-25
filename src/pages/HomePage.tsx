import React, { useState } from 'react';
import { GrievanceInputHero } from '../components/citizen/GrievanceInputHero';
import { GrievanceSubmitModal } from '../components/citizen/GrievanceSubmitModal';
import { SamadhanJourney } from '../components/citizen/SamadhanJourney';
import { RoutingRecommendation } from '../intelligence/types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useTranslation } from '../i18n';
import {
  Search,
  Zap,
  CreditCard,
  Train,
  FileText,
  Lightbulb,
  HeartPulse,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const [selectedRouting, setSelectedRouting] = useState<RoutingRecommendation | null>(null);
  const [grievanceText, setGrievanceText] = useState('');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [activeScenarioQuery, setActiveScenarioQuery] = useState<string | undefined>(undefined);

  const handleOpenSubmit = (routing: RoutingRecommendation, text: string) => {
    setSelectedRouting(routing);
    setGrievanceText(text);
    setIsSubmitModalOpen(true);
  };

  const handleTriggerScenario = (query: string) => {
    setActiveScenarioQuery(query);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const CATEGORIES = [
    {
      title: t('categories.incomeTax'),
      icon: <CreditCard size={20} />,
      query: language === 'hi'
        ? 'आयकर रिटर्न रिफंड ई-सत्यापन के 6 महीने बाद भी बैंक खाते में जमा नहीं हुआ'
        : 'Income tax return refund delayed for 6 months after e-verification',
    },
    {
      title: t('categories.railways'),
      icon: <Train size={20} />,
      query: language === 'hi'
        ? 'तत्काल टिकट अपने आप रद्द हुआ लेकिन रिफंड खाते में वापस नहीं आया'
        : 'Tatkal ticket cancelled automatically but refund not credited to account',
    },
    {
      title: t('categories.epfo'),
      icon: <FileText size={20} />,
      query: language === 'hi'
        ? 'पिछली कंपनी से ईपीएफओ भविष्य निधि बैलेंस ट्रांसफर का अनुरोध निरस्त'
        : 'EPFO transfer of provident fund balance from previous company rejected',
    },
    {
      title: t('categories.banking'),
      icon: <Zap size={20} />,
      query: language === 'hi'
        ? 'एटीएम लेनदेन विफल हुआ और बचत बैंक खाते से पैसे कट गए'
        : 'ATM transaction failed and cash debited from my savings bank account',
    },
    {
      title: t('categories.electricity'),
      icon: <Lightbulb size={20} />,
      query: language === 'hi'
        ? 'मेरे इलाके में बिजली के वोल्टेज में अत्यधिक उतार-चढ़ाव और मीटर खराब'
        : 'Frequent voltage fluctuation and electric meter faulty in my area',
    },
    {
      title: t('categories.health'),
      icon: <HeartPulse size={20} />,
      query: language === 'hi'
        ? 'अस्पताल ने आयुष्मान भारत स्वास्थ्य योजना के तहत भर्ती करने से मना कर दिया'
        : 'Hospital refused Ayushman Bharat health insurance scheme admission',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', paddingBottom: '2.5rem' }}>
      {/* Hero Section */}
      <GrievanceInputHero
        onOpenSubmitModal={handleOpenSubmit}
        externalQuery={activeScenarioQuery}
      />

      {/* Frequently Lodged Categories */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 className="title-large">{t('categories.heading')}</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
              {t('categories.subheading')}
            </p>
          </div>
          <Button variant="tonal" onClick={() => navigate('/track')}>
            <Search size={16} />
            <span>{t('categories.trackExisting')}</span>
          </Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {CATEGORIES.map((cat, idx) => (
            <Card
              key={idx}
              variant="low"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.875rem',
                cursor: 'pointer',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onClick={() => {
                handleTriggerScenario(cat.query);
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--md-sys-color-primary-container)',
                  color: 'var(--md-sys-color-on-primary-container)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {cat.icon}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--md-sys-color-on-surface)' }}>
                  {cat.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
                  {t('categories.clickToPrefill')}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Complete SAMADHAN Journey & Before-After Transformation */}
      <SamadhanJourney onTriggerScenario={handleTriggerScenario} />

      {/* Submission Dialog Modal */}
      <GrievanceSubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        routing={selectedRouting}
        grievanceText={grievanceText}
      />
    </div>
  );
};
