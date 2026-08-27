import React, { useState } from 'react';
import { GrievanceInputHero } from '../components/citizen/GrievanceInputHero';
import { GrievancePreparationModal } from '../components/citizen/GrievancePreparationModal';
import { RoutingRecommendation } from '../intelligence/types';
import { Button } from '../components/common/Button';
import { TransparencyModal } from '../components/common/TransparencyModal';
import { useTranslation } from '../i18n';
import {
  CreditCard,
  Train,
  FileText,
  HeartPulse,
  Zap,
  Building2,
  Plane,
  Coins,
  ArrowRight,
  Cpu,
  BarChart3,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const { language } = useTranslation();
  const navigate = useNavigate();
  const [selectedRouting, setSelectedRouting] = useState<RoutingRecommendation | null>(null);
  const [grievanceText, setGrievanceText] = useState('');
  const [isPreparationModalOpen, setIsPreparationModalOpen] = useState(false);
  const [activeScenarioQuery, setActiveScenarioQuery] = useState<string | undefined>(undefined);
  const [isTrustOpen, setIsTrustOpen] = useState(false);

  const handleOpenPreparation = (routing: RoutingRecommendation, text: string) => {
    setSelectedRouting(routing);
    setGrievanceText(text);
    setIsPreparationModalOpen(true);
  };

  const handleTriggerCategory = (query: string) => {
    setActiveScenarioQuery(query);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const POPULAR_SERVICES = [
    {
      title: language === 'hi' ? 'आयकर एवं टीडीएस' : 'Income Tax & Refund',
      icon: <CreditCard size={18} />,
      department: 'CBDT',
      query: language === 'hi'
        ? 'आयकर रिटर्न रिफंड ई-सत्यापन के 6 महीने बाद भी बैंक खाते में जमा नहीं हुआ'
        : 'Income tax return refund delayed for 6 months after e-verification',
    },
    {
      title: language === 'hi' ? 'भारतीय रेल एवं आईआरसीटीसी' : 'Railways & IRCTC',
      icon: <Train size={18} />,
      department: 'Railway Board',
      query: language === 'hi'
        ? 'तत्काल टिकट अपने आप रद्द हुआ लेकिन रिफंड खाते में वापस नहीं आया'
        : 'Tatkal ticket cancelled automatically but refund not credited to account',
    },
    {
      title: language === 'hi' ? 'ईपीएफओ एवं पेंशन' : 'EPFO & Pension',
      icon: <FileText size={18} />,
      department: 'Labour & Employment',
      query: language === 'hi'
        ? 'पिछली कंपनी से ईपीएफओ भविष्य निधि बैलेंस ट्रांसफर का अनुरोध निरस्त'
        : 'EPFO transfer of provident fund balance from previous company rejected',
    },
    {
      title: language === 'hi' ? 'स्वास्थ्य एवं आयुष्मान भारत' : 'Healthcare & Hospitals',
      icon: <HeartPulse size={18} />,
      department: 'Health & Family Welfare',
      query: language === 'hi'
        ? 'अस्पताल ने आयुष्मान भारत स्वास्थ्य योजना के तहत भर्ती करने से मना कर दिया'
        : 'Hospital refused Ayushman Bharat health insurance scheme admission',
    },
    {
      title: language === 'hi' ? 'बिजली एवं पावर ग्रिड' : 'Electricity & Utilities',
      icon: <Zap size={18} />,
      department: 'Ministry of Power',
      query: language === 'hi'
        ? 'मेरे इलाके में बिजली के वोल्टेज में अत्यधिक उतार-चढ़ाव और मीटर खराब'
        : 'Frequent voltage fluctuation and electric meter faulty in my area',
    },
    {
      title: language === 'hi' ? 'बैंकिंग एवं यूपीआई' : 'Banking & Financial',
      icon: <Coins size={18} />,
      department: 'Financial Services',
      query: language === 'hi'
        ? 'एटीएम लेनदेन विफल हुआ और बचत बैंक खाते से पैसे कट गए'
        : 'ATM transaction failed and cash debited from my savings bank account',
    },
    {
      title: language === 'hi' ? 'पासपोर्ट सेवा' : 'Passport Services',
      icon: <Plane size={18} />,
      department: 'External Affairs',
      query: language === 'hi'
        ? 'पासपोर्ट नवीनीकरण आवेदन पुलिस सत्यापन चरण में एक महीने से अटका हुआ है'
        : 'Passport reissue application stuck at police verification stage for over a month',
    },
    {
      title: language === 'hi' ? 'नगर निगम एवं नागरिक सुविधा' : 'Municipal Services (ULB)',
      icon: <Building2 size={18} />,
      department: 'Municipal Corporation',
      query: language === 'hi'
        ? 'सड़क पर जलभराव और सीवर लाइन जाम की समस्या दो हफ्तों से बनी हुई है'
        : 'Street waterlogging and blocked municipal sewer line in our locality',
    },
  ];

  const HOW_IT_WORKS = [
    {
      num: '01',
      title: language === 'hi' ? 'समस्या समझें' : 'Understand',
      desc: language === 'hi'
        ? 'अपनी शिकायत रोज़मर्रा की बोलचाल में लिखें, बिना किसी मंत्रालय कोड या प्रशासनिक पदानुक्रम को जाने।'
        : 'Describe the problem naturally without navigating ministry hierarchies or bureaucratic nomenclature.',
      icon: <Compass size={20} />,
    },
    {
      num: '02',
      title: language === 'hi' ? 'सटीक मार्ग' : 'Route',
      desc: language === 'hi'
        ? '278 वास्तविक केंद्रीय एवं राज्य प्राधिकरणों में से उपयुक्त नोडल सेल की तत्काल पहचान।'
        : 'Deterministically identify the appropriate public authority from 278 real departments.',
      icon: <Cpu size={20} />,
    },
    {
      num: '03',
      title: language === 'hi' ? 'साक्ष्य देखें' : 'Explain',
      desc: language === 'hi'
        ? 'सिफारिश के पीछे का कारण और सीपीग्राम्स आधिकारिक डेटा का साक्ष्य स्पष्ट देखें।'
        : 'Review explainable causation rationale and underlying CPGRAMS telemetry evidence.',
      icon: <CheckCircle2 size={20} />,
    },
    {
      num: '04',
      title: language === 'hi' ? 'तैयार करें एवं आगे बढ़ें' : 'Prepare & Continue',
      desc: language === 'hi'
        ? 'मसौदे की समीक्षा और कॉपी करें, फिर आधिकारिक प्रस्तुति एवं ट्रैकिंग के लिए CPGRAMS पर जाएं।'
        : 'Review and copy the draft, then continue to CPGRAMS for official submission and tracking.',
      icon: <BarChart3 size={20} />,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingBottom: '2.5rem' }}>
      {/* 1. Primary Civic Grievance Intake Hero */}
      <GrievanceInputHero
        onOpenPreparationModal={handleOpenPreparation}
        externalQuery={activeScenarioQuery}
      />

      {/* 2. How SAMADHAN Helps (Civic Process Architecture) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
          <span className="chip chip-primary" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
            {language === 'hi' ? 'समाधान कैसे कार्य करता है' : 'HOW SAMADHAN HELPS'}
          </span>
          <h2 className="headline-medium" style={{ marginTop: '0.35rem', color: 'var(--civic-text-primary)' }}>
            {language === 'hi' ? 'नागरिक समस्या से प्रशासनिक समाधान तक' : 'From Citizen Problem to Administrative Resolution'}
          </h2>
          <p className="body-medium" style={{ color: 'var(--civic-text-muted)', marginTop: '0.25rem' }}>
            {language === 'hi'
              ? 'जटिल सरकारी प्रक्रियाओं को सरल और पारदर्शी बनाने वाली आधुनिक प्रणाली'
              : 'Next-generation civic triage connecting citizens with explainable accountability'}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {HOW_IT_WORKS.map((step, idx) => (
            <div
              key={idx}
              className="card-surface"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                backgroundColor: '#FFFFFF',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--civic-brand-light)',
                    color: 'var(--civic-brand-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {step.icon}
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--civic-brand)', opacity: 0.5 }}>
                  {step.num}
                </span>
              </div>

              <h3 className="title-medium" style={{ fontSize: '1.05rem', color: 'var(--civic-text-primary)' }}>
                {step.title}
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--civic-text-secondary)', lineHeight: 1.5 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Popular Grievance Categories */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 className="title-large" style={{ fontSize: '1.2rem', color: 'var(--civic-text-primary)' }}>
              {language === 'hi' ? 'लोकप्रिय शिकायत श्रेणियाँ' : 'Popular Grievance Services'}
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--civic-text-muted)' }}>
              {language === 'hi' ? 'सामान्य विषयों पर तुरंत शिकायत तैयार करने के लिए क्लिक करें' : 'Select a frequent domain to pre-fill an assisted query'}
            </p>
          </div>
          <Button variant="tonal" onClick={() => navigate('/track')} style={{ minHeight: '36px', fontSize: '0.8125rem' }}>
            <span>{language === 'hi' ? 'आधिकारिक CPGRAMS ट्रैकिंग' : 'Official CPGRAMS Tracking'}</span>
            <ArrowRight size={14} />
          </Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.875rem' }}>
          {POPULAR_SERVICES.map((cat, idx) => (
            <div
              key={idx}
              className="card-surface"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.875rem',
                cursor: 'pointer',
                padding: '1rem',
                backgroundColor: '#FFFFFF',
              }}
              onClick={() => handleTriggerCategory(cat.query)}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--civic-canvas-subtle)',
                  color: 'var(--civic-brand)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: '1px solid var(--civic-border-light)',
                }}
              >
                {cat.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--civic-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {cat.title}
                </div>
                <div style={{ fontSize: '0.7125rem', color: 'var(--civic-text-muted)' }}>
                  &rarr; {cat.department}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Public Grievance Pulse (National Macro Summary) */}
      <div
        className="card-surface"
        style={{
          border: '1px solid var(--civic-border-medium)',
          backgroundColor: '#FFFFFF',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="chip chip-primary" style={{ fontSize: '0.6875rem', fontWeight: 700 }}>
                {language === 'hi' ? 'राष्ट्रीय लोक शिकायत पल्स' : 'PUBLIC GRIEVANCE PULSE'}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--civic-text-muted)' }}>
                {language === 'hi' ? 'सत्यापित सीपीग्राम्स टेलीमेट्री (2026)' : 'Current Verified Period (01 Jan – 24 Aug 2026)'}
              </span>
            </div>
            <h3 className="headline-medium" style={{ fontSize: '1.35rem', color: 'var(--civic-text-primary)' }}>
              {language === 'hi' ? 'राष्ट्रीय लोक शिकायत निपटान अवलोकन' : 'National Grievance Disposal Performance'}
            </h3>
          </div>

          <Button variant="filled" onClick={() => navigate('/government')} style={{ minHeight: '40px', fontSize: '0.8125rem' }}>
            <span>{language === 'hi' ? 'सरकारी प्रज्ञान कॉकपिट देखें →' : 'View Operational Intelligence →'}</span>
          </Button>
        </div>

        {/* 4 Macro KPI Blocks */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          <div style={{ backgroundColor: 'var(--civic-canvas-subtle)', padding: '1rem', borderRadius: 'var(--radius-card)', border: '1px solid var(--civic-border-light)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--civic-text-muted)', fontWeight: 600 }}>
              {language === 'hi' ? 'कुल प्राप्त शिकायतें' : 'Received'}
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--civic-text-primary)', marginTop: '0.2rem' }}>
              21.77L+
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--civic-text-muted)', marginTop: '0.2rem' }}>
              127 reporting authorities
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--civic-canvas-subtle)', padding: '1rem', borderRadius: 'var(--radius-card)', border: '1px solid var(--civic-border-light)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--civic-text-muted)', fontWeight: 600 }}>
              {language === 'hi' ? 'निपटाए गए मामले' : 'Disposed'}
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--civic-success)', marginTop: '0.2rem' }}>
              19.02L+
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--civic-success)', marginTop: '0.2rem' }}>
              Active resolution throughput
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--civic-canvas-subtle)', padding: '1rem', borderRadius: 'var(--radius-card)', border: '1px solid var(--civic-border-light)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--civic-text-muted)', fontWeight: 600 }}>
              {language === 'hi' ? 'समग्र निपटान दर' : 'Disposal Rate'}
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--civic-brand)', marginTop: '0.2rem' }}>
              87.36%
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--civic-text-muted)', marginTop: '0.2rem' }}>
              National baseline: 85.0%
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--civic-canvas-subtle)', padding: '1rem', borderRadius: 'var(--radius-card)', border: '1px solid var(--civic-border-light)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--civic-text-muted)', fontWeight: 600 }}>
              {language === 'hi' ? 'सक्रिय लंबित मामले' : 'Active Backlog'}
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--civic-warning)', marginTop: '0.2rem' }}>
              2.75L+
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--civic-success)', marginTop: '0.2rem' }}>
              0 cases &gt; 1 year
            </div>
          </div>
        </div>

        {/* Where Attention is Needed Signals */}
        <div style={{ backgroundColor: 'var(--civic-canvas-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-card)', border: '1px solid var(--civic-border-light)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--civic-text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {language === 'hi' ? 'प्रशासनिक ध्यान आवश्यक (प्रमुख संकेत)' : 'Where Administrative Attention is Needed'}
              </span>
              <button
                type="button"
                className="btn btn-text"
                style={{ padding: '0.25rem 0.5rem', minHeight: '36px', fontSize: '0.75rem', color: 'var(--civic-brand)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                onClick={() => setIsTrustOpen(true)}
              >
                <span>{language === 'hi' ? 'डेटा स्रोत एवं पद्धति →' : 'Data Source & Methodology →'}</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
            {/* Signal 1 */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '0.875rem 1rem', borderRadius: '8px', borderLeft: '4px solid var(--civic-danger)', border: '1px solid var(--civic-border-light)', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--civic-text-primary)', wordBreak: 'break-word' }}>Manipur</span>
                <span className="chip chip-critical" style={{ fontSize: '0.6875rem', whiteSpace: 'nowrap' }}>2.51% Disposal</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--civic-text-muted)', marginTop: '0.35rem', lineHeight: 1.45 }}>
                Low disposal velocity requires nodal administrative reinforcement.
              </p>
            </div>

            {/* Signal 2 */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '0.875rem 1rem', borderRadius: '8px', borderLeft: '4px solid var(--civic-warning)', border: '1px solid var(--civic-border-light)', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--civic-text-primary)', wordBreak: 'break-word' }}>Labour & Employment</span>
                <span className="chip chip-medium" style={{ fontSize: '0.6875rem', whiteSpace: 'nowrap' }}>-5.96 pp Delta</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--civic-text-muted)', marginTop: '0.35rem', lineHeight: 1.45 }}>
                Disposal (92.81%) is below 10-year historical baseline (98.77%).
              </p>
            </div>

            {/* Signal 3 */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '0.875rem 1rem', borderRadius: '8px', borderLeft: '4px solid var(--civic-success)', border: '1px solid var(--civic-border-light)', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--civic-text-primary)', wordBreak: 'break-word' }}>Financial Services (Banking)</span>
                <span className="chip chip-low" style={{ fontSize: '0.6875rem', whiteSpace: 'nowrap' }}>96.90% Disposal</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--civic-text-muted)', marginTop: '0.35rem', lineHeight: 1.45 }}>
                High-volume efficiency: 1,95,849 cases redressed with stable velocity.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CPGRAMS preparation and review dialog */}
      <GrievancePreparationModal
        isOpen={isPreparationModalOpen}
        onClose={() => setIsPreparationModalOpen(false)}
        routing={selectedRouting}
        grievanceText={grievanceText}
      />

      <TransparencyModal isOpen={isTrustOpen} onClose={() => setIsTrustOpen(false)} />
    </div>
  );
};
