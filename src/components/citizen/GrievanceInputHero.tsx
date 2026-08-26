import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../common/Button';
import { EvidenceBadge } from '../common/EvidenceBadge';
import { routeGrievance } from '../../services/apiClient';
import { RoutingRecommendation } from '../../intelligence/types';
import { useTranslation } from '../../i18n';
import { FacilityContextCard } from './FacilityContextCard';
import { EvidenceViewerModal } from './EvidenceViewerModal';
import { getSpeechProvider, SpeechRecognitionProvider } from '../../services/speechService';
import { parseDocument, validateFile, ExtractedDocument, MAX_FILES_ALLOWED } from '../../intelligence';
import {
  Mic,
  MicOff,
  Building2,
  ArrowRight,
  ShieldCheck,
  Cpu,
  RefreshCw,
  AlertCircle,
  Paperclip,
  Sparkles,
  FileText,
  X,
  Eye,
  FileCheck
} from 'lucide-react';

interface GrievanceInputHeroProps {
  onOpenSubmitModal: (recommendation: RoutingRecommendation, grievanceText: string) => void;
  externalQuery?: string;
}

export const GrievanceInputHero: React.FC<GrievanceInputHeroProps> = ({
  onOpenSubmitModal,
  externalQuery,
}) => {
  const { language } = useTranslation();
  const [text, setText] = useState(externalQuery || '');
  const [isListening, setIsListening] = useState(false);
  const [interimSpeech, setInterimSpeech] = useState('');
  const [speechError, setSpeechError] = useState<string | null>(null);

  const [attachedDocs, setAttachedDocs] = useState<ExtractedDocument[]>([]);
  const [isParsingFiles, setIsParsingFiles] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);

  const [isRouting, setIsRouting] = useState(false);
  const [routingResult, setRoutingResult] = useState<RoutingRecommendation | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const speechProviderRef = useRef<SpeechRecognitionProvider | null>(null);

  const QUICK_STARTERS = language === 'hi'
    ? [
        'आयकर रिटर्न रिफंड 2025-26 ई-सत्यापन के बाद भी खाते में जमा नहीं हुआ',
        'ईपीएफओ (EPFO) भविष्य निधि बैलेंस ट्रांसफर का अनुरोध बिना कारण निरस्त किया गया',
        'एटीएम मशीन से नकदी नहीं निकली लेकिन बैंक खाते से पैसे कट गए',
        'आईआरसीटीसी ट्रेन तत्काल टिकट रद्द हुआ पर रिफंड अभी तक लंबित है',
        'आवासीय क्षेत्र में बिजली की वोल्टेज में उतार-चढ़ाव और बार-बार कटौती',
        'अस्पताल ने आयुष्मान भारत योजना के तहत उपचार करने से मना कर दिया',
      ]
    : [
        'Income tax refund for AY 2025-26 is still not credited to my bank account',
        'EPFO PF balance transfer request from previous employer rejected without reason',
        'Cash debited from ATM but bank machine failed to dispense money',
        'IRCTC train tatkal ticket was cancelled automatically but refund pending',
        'Electricity voltage fluctuation and frequent power cut in residential area',
        'Hospital refused Ayushman Bharat health insurance scheme admission',
      ];

  useEffect(() => {
    speechProviderRef.current = getSpeechProvider();
  }, []);

  useEffect(() => {
    if (externalQuery) {
      setText(externalQuery);
    }
  }, [externalQuery]);

  // Listen to custom scenario trigger event from navbar
  useEffect(() => {
    const handleGlobalTrigger = (e: any) => {
      if (e.detail?.query) {
        setText(e.detail.query);
      }
    };
    window.addEventListener('samadhan:triggerScenario', handleGlobalTrigger);
    return () => window.removeEventListener('samadhan:triggerScenario', handleGlobalTrigger);
  }, []);

  // Auto-route on text or attached documents change
  useEffect(() => {
    if ((!text.trim() || text.trim().length < 5) && attachedDocs.length === 0) {
      setRoutingResult(null);
      return;
    }

    setIsRouting(true);

    const timer = setTimeout(async () => {
      try {
        const result = await routeGrievance(text, attachedDocs);
        setRoutingResult(result);
      } catch (err) {
        console.error('Routing error:', err);
      } finally {
        setIsRouting(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [text, attachedDocs]);

  // ==========================================
  // SPEECH-TO-TEXT CONTROLS
  // ==========================================
  const handleToggleVoice = () => {
    setSpeechError(null);
    const provider = speechProviderRef.current || getSpeechProvider();

    if (!provider.isSupported()) {
      setSpeechError(
        language === 'hi'
          ? 'इस ब्राउज़र में ध्वनि इनपुट समर्थित नहीं है। आप अपनी शिकायत टाइप कर सकते हैं।'
          : "Voice input isn't supported in this browser. You can type your grievance instead."
      );
      return;
    }

    if (isListening) {
      provider.stop();
      setIsListening(false);
      setInterimSpeech('');
      return;
    }

    provider.start(
      {
        onStart: () => {
          setIsListening(true);
          setInterimSpeech('');
        },
        onResult: payload => {
          if (payload.isFinal) {
            setInterimSpeech('');
            setText(prev => {
              const base = prev.trim();
              if (!base) return payload.transcript;
              return `${base} ${payload.transcript}`;
            });
          } else {
            setInterimSpeech(payload.transcript);
          }
        },
        onError: err => {
          setIsListening(false);
          setInterimSpeech('');
          setSpeechError(err.message);
        },
        onEnd: () => {
          setIsListening(false);
          setInterimSpeech('');
        },
      },
      language === 'hi' ? 'hi-IN' : 'en-IN'
    );
  };

  // ==========================================
  // NATIVE FILE PICKER & ATTACHMENT
  // ==========================================
  const handleOpenNativePicker = () => {
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleNativeFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (attachedDocs.length + files.length > MAX_FILES_ALLOWED) {
      setFileError(`You can attach up to ${MAX_FILES_ALLOWED} documents per grievance.`);
      return;
    }

    setIsParsingFiles(true);
    setFileError(null);

    const newDocs: ExtractedDocument[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validation = validateFile(file.name, file.size);

      if (!validation.valid) {
        setFileError(validation.error || 'Invalid file.');
        continue;
      }

      try {
        const buffer = await file.arrayBuffer();
        const doc = parseDocument(file.name, new Uint8Array(buffer), file.size);
        newDocs.push(doc);
      } catch (err: any) {
        setFileError(`Failed to process ${file.name}: ${err.message}`);
      }
    }

    setAttachedDocs(prev => [...prev, ...newDocs]);
    setIsParsingFiles(false);

    // Reset input so re-selecting same file triggers change
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveDoc = (id: string) => {
    setAttachedDocs(prev => prev.filter(d => d.id !== id));
  };

  const handleReset = () => {
    if (isListening && speechProviderRef.current) {
      speechProviderRef.current.stop();
    }
    setIsListening(false);
    setInterimSpeech('');
    setSpeechError(null);
    setText('');
    setAttachedDocs([]);
    setFileError(null);
    setRoutingResult(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.txt,.csv,.jpg,.jpeg,.png"
        style={{ display: 'none' }}
        onChange={handleNativeFileChange}
      />

      {/* Hero Header Section */}
      <div
        className="card-hero"
        style={{
          border: '1px solid var(--civic-border-light)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem', maxWidth: '820px', margin: '0 auto' }}>
          {/* Institutional Status Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', backgroundColor: 'var(--civic-brand-light)', color: 'var(--civic-brand-dark)', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-pill)', fontSize: '0.8125rem', fontWeight: 700 }}>
            <Sparkles size={14} />
            <span>
              {language === 'hi' ? 'नागरिक शिकायत समाधान एवं प्रज्ञान' : 'Assisted Public Grievance Intake'}
            </span>
          </div>

          <h1 className="display-large" style={{ color: 'var(--civic-text-primary)', margin: 0 }}>
            {language === 'hi' ? (
              <>आपकी समस्या। सही प्राधिकरण। <br /><span style={{ color: 'var(--civic-brand)' }}>निवारण का स्पष्ट मार्ग।</span></>
            ) : (
              <>Your problem. The right authority. <br /><span style={{ color: 'var(--civic-brand)' }}>A clearer path to resolution.</span></>
            )}
          </h1>

          <p className="body-large" style={{ color: 'var(--civic-text-secondary)', maxWidth: '680px', margin: 0 }}>
            {language === 'hi'
              ? 'अपनी शिकायत अपने शब्दों में लिखें या बोलें। समाधान उपयुक्त लोक प्राधिकरण की पहचान करता है, कारण स्पष्ट करता है, और सिफारिश के पीछे का डेटा साक्ष्य प्रस्तुत करता है।'
              : 'Describe your grievance in your own words or speak naturally. SAMADHAN identifies the appropriate public authority, explains why, and provides explainable evidence.'}
          </p>

          {/* Grievance Input Form Container */}
          <div style={{ width: '100%', marginTop: '0.75rem', position: 'relative' }}>
            <div className="input-container">
              <label
                htmlFor="grievance-input"
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: 'var(--civic-text-secondary)',
                  textAlign: 'left',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '0.25rem',
                }}
              >
                {language === 'hi' ? 'शिकायत का विवरण दर्ज करें' : 'Describe your grievance'}
              </label>

              <textarea
                id="grievance-input"
                className="input-filled textarea-filled"
                style={{
                  fontSize: '1rem',
                  minHeight: '140px',
                  padding: '1rem 1.25rem',
                  paddingBottom: '3.75rem',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  border: isListening ? '1.5px solid var(--civic-danger)' : '1.5px solid var(--civic-border-medium)',
                  lineHeight: 1.5,
                  transition: 'border-color var(--transition-fast)',
                }}
                placeholder={
                  language === 'hi'
                    ? "उदाहरण: मेरा आयकर रिफंड ई-सत्यापन के छह महीने बाद भी बैंक खाते में जमा नहीं हुआ है..."
                    : "Example: My income tax refund has not been credited to my bank account for six months despite e-verification..."
                }
                value={text}
                onChange={e => setText(e.target.value)}
                aria-label="Describe your grievance in simple words"
              />
            </div>

            {/* Action Bar inside textarea */}
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '12px',
                right: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                {/* Real Microphone Voice Button */}
                <button
                  type="button"
                  className="btn btn-tonal"
                  style={{
                    minHeight: '34px',
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.75rem',
                    color: isListening ? 'var(--civic-danger)' : 'var(--civic-text-secondary)',
                    backgroundColor: isListening ? 'var(--civic-danger-bg)' : '#FFFFFF',
                    border: isListening ? '1px solid var(--civic-danger)' : '1px solid var(--civic-border-medium)',
                    fontWeight: isListening ? 700 : 500,
                  }}
                  onClick={handleToggleVoice}
                  title="Speak grievance via browser microphone"
                  aria-label={isListening ? 'Stop listening' : 'Start speech recognition'}
                >
                  {isListening ? <MicOff size={15} /> : <Mic size={15} />}
                  <span>{isListening ? (language === 'hi' ? '● सुन रहा है...' : '● Listening...') : (language === 'hi' ? 'बोलें' : 'Speak')}</span>
                </button>

                {/* Real Native File Picker Button */}
                <button
                  type="button"
                  className="btn btn-tonal"
                  style={{
                    minHeight: '34px',
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.75rem',
                    backgroundColor: attachedDocs.length > 0 ? 'var(--civic-success-bg)' : '#FFFFFF',
                    color: attachedDocs.length > 0 ? 'var(--civic-success-text)' : 'var(--civic-text-secondary)',
                    border: '1px solid var(--civic-border-medium)',
                  }}
                  onClick={handleOpenNativePicker}
                  title="Attach evidence reference document"
                  disabled={isParsingFiles}
                >
                  <Paperclip size={14} />
                  <span>
                    {isParsingFiles
                      ? (language === 'hi' ? 'विश्लेषण हो रहा है...' : 'Analyzing...')
                      : attachedDocs.length > 0
                      ? `${attachedDocs.length} ${language === 'hi' ? 'साक्ष्य संलग्न ✓' : 'Evidence Attached ✓'}`
                      : (language === 'hi' ? 'साक्ष्य जोड़ें' : 'Attach Evidence')}
                  </span>
                </button>

                {/* Clear / Reset */}
                {(text || attachedDocs.length > 0) && (
                  <button
                    type="button"
                    className="btn btn-text"
                    style={{ minHeight: '34px', padding: '0.35rem 0.5rem', fontSize: '0.75rem', color: 'var(--civic-text-muted)' }}
                    onClick={handleReset}
                  >
                    <RefreshCw size={13} />
                    <span>{language === 'hi' ? 'साफ़ करें' : 'Clear'}</span>
                  </button>
                )}
              </div>

              {routingResult && routingResult.recommendedEntity ? (
                <Button
                  variant="filled"
                  style={{ minHeight: '36px', padding: '0.4rem 1.1rem', fontSize: '0.8125rem' }}
                  onClick={() => onOpenSubmitModal(routingResult, text)}
                >
                  <span>{language === 'hi' ? 'प्राधिकरण को भेजें →' : 'Find the right authority →'}</span>
                </Button>
              ) : (text.trim().length >= 5 || attachedDocs.length > 0) && isRouting ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--civic-brand)', fontWeight: 600 }}>
                  <Cpu size={14} className="spin" />
                  <span>{language === 'hi' ? 'प्राधिकरण मिलान हो रहा है...' : 'Matching public authority...'}</span>
                </div>
              ) : null}
            </div>
          </div>

          {/* Real-time Interim Speech Transcript Banner */}
          {isListening && (
            <div
              style={{
                width: '100%',
                backgroundColor: 'var(--civic-brand-light)',
                color: 'var(--civic-brand-dark)',
                padding: '0.5rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                textAlign: 'left',
                border: '1px solid var(--civic-brand-border)',
              }}
            >
              <Mic size={16} className="spin" />
              <span>
                {interimSpeech ? `"${interimSpeech}"` : language === 'hi' ? 'कृपया स्पष्ट बोलें (हिन्दी)...' : 'Listening... speak clearly (English)...'}
              </span>
            </div>
          )}

          {/* Speech Error Banner */}
          {speechError && (
            <div
              style={{
                width: '100%',
                backgroundColor: 'var(--civic-danger-bg)',
                color: 'var(--civic-danger)',
                padding: '0.5rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.78125rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                textAlign: 'left',
              }}
            >
              <AlertCircle size={15} />
              <span>{speechError}</span>
            </div>
          )}

          {/* File Error Banner */}
          {fileError && (
            <div
              style={{
                width: '100%',
                backgroundColor: 'var(--civic-warning-bg)',
                color: 'var(--civic-warning-text)',
                padding: '0.5rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.78125rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                textAlign: 'left',
              }}
            >
              <AlertCircle size={15} />
              <span>{fileError}</span>
            </div>
          )}

          {/* Attached Files List Chips */}
          {attachedDocs.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', width: '100%', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--civic-text-muted)', fontWeight: 600 }}>
                {language === 'hi' ? 'संलग्न साक्ष्य:' : 'Attached Evidence:'}
              </span>
              {attachedDocs.map(doc => (
                <div
                  key={doc.id}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--civic-border-medium)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    color: 'var(--civic-text-primary)',
                  }}
                >
                  <FileText size={13} style={{ color: 'var(--civic-brand)' }} />
                  <span style={{ fontWeight: 600, maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {doc.sanitizedName}
                  </span>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--civic-text-muted)' }}>
                    ({(doc.sizeBytes / 1024).toFixed(0)}KB)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDoc(doc.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 0.15rem', color: 'var(--civic-text-muted)', display: 'inline-flex', alignItems: 'center' }}
                    title="Remove attachment"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="btn btn-text"
                style={{ padding: '0.2rem 0.4rem', minHeight: 'auto', fontSize: '0.75rem', color: 'var(--civic-brand)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                onClick={() => setIsEvidenceModalOpen(true)}
              >
                <Eye size={13} />
                <span>{language === 'hi' ? 'साक्ष्य देखें' : 'Inspect Evidence'}</span>
              </button>
            </div>
          )}

          {/* Quick Example Starters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', justifyContent: 'center', width: '100%', marginTop: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--civic-text-muted)', alignSelf: 'center', marginRight: '0.25rem', fontWeight: 600 }}>
              {language === 'hi' ? 'त्वरित उदाहरण:' : 'Quick examples:'}
            </span>
            {QUICK_STARTERS.map((qs, i) => (
              <button
                key={i}
                type="button"
                className="btn btn-tonal"
                style={{
                  minHeight: '30px',
                  padding: '0.25rem 0.65rem',
                  fontSize: '0.75rem',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--civic-border-light)',
                }}
                onClick={() => setText(qs)}
              >
                {qs.split(' ').slice(0, 3).join(' ')}...
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Real-Time Intelligent Routing Preview */}
      {routingResult && routingResult.recommendedEntity && (
        <div
          className="card-surface"
          style={{
            border: '1.5px solid var(--civic-brand-border)',
            background: '#FFFFFF',
            padding: '1.5rem',
          }}
        >
          {/* Header Banner */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--civic-border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="chip chip-primary" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                {language === 'hi' ? 'शिकायत का विश्लेषण' : 'UNDERSTANDING YOUR GRIEVANCE'}
              </span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--civic-brand)' }}>
                {Math.round(routingResult.confidence * 100)}% {language === 'hi' ? 'विश्वास स्कोर' : 'Confidence'}
              </span>
            </div>

            <EvidenceBadge
              evidence={{
                dataset: 'live_dashboard_2026',
                entity: routingResult.recommendedEntity,
                metric: 'target_authority_mapping',
                value: routingResult.detectedCategory,
                period: '2026-01-01 to 2026-08-24',
                sourceUrl: 'https://pgportal.gov.in/darpgdashboard',
                sourceNote: 'Entity catalogued in DARPG official master registry.',
              }}
              label={language === 'hi' ? 'सीपीग्राम्स सत्यापित' : 'CPGRAMS Operational Data'}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flex: 1, minWidth: '280px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--civic-brand-light)',
                  color: 'var(--civic-brand-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Building2 size={24} />
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--civic-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {language === 'hi' ? 'पहचाना गया मुद्दा / श्रेणी' : 'Detected Issue'}: <strong style={{ color: 'var(--civic-text-primary)' }}>{routingResult.detectedCategory}</strong>
                </div>

                <h2 className="title-large" style={{ color: 'var(--civic-text-primary)', marginTop: '0.2rem' }}>
                  {routingResult.recommendedEntity}
                </h2>

                <div style={{ fontSize: '0.875rem', color: 'var(--civic-text-secondary)', marginTop: '0.35rem', lineHeight: 1.5 }}>
                  <strong>{language === 'hi' ? 'कारण:' : 'Why:'}</strong> {routingResult.matchReason}
                </div>
              </div>
            </div>

            <Button
              variant="filled"
              style={{ minHeight: '44px', padding: '0.65rem 1.35rem' }}
              onClick={() => onOpenSubmitModal(routingResult, text)}
            >
              <span>{language === 'hi' ? 'इस विभाग में शिकायत दर्ज करें' : 'Lodge Grievance to this Authority'}</span>
              <ArrowRight size={18} />
            </Button>
          </div>

          {/* Document Evidence Section */}
          {routingResult.documentEvidence && routingResult.documentEvidence.totalAnalyzed > 0 && (
            <div
              style={{
                marginTop: '1.25rem',
                backgroundColor: 'var(--civic-canvas-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.25rem',
                border: '1px solid var(--civic-border-light)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--civic-brand)' }}>
                  <FileCheck size={16} />
                  <span>
                    {language === 'hi' ? 'संलग्न दस्तावेज़ साक्ष्य' : 'DOCUMENT EVIDENCE'} ({routingResult.documentEvidence.totalAnalyzed} {language === 'hi' ? 'फ़ाइलें विश्लेषित' : 'file(s) analyzed'})
                  </span>
                </div>

                <button
                  type="button"
                  className="btn btn-tonal"
                  style={{ minHeight: '30px', padding: '0.2rem 0.65rem', fontSize: '0.75rem', backgroundColor: '#FFFFFF' }}
                  onClick={() => setIsEvidenceModalOpen(true)}
                >
                  <Eye size={13} />
                  <span>{language === 'hi' ? 'साक्ष्य विवरण देखें' : 'View Evidence'}</span>
                </button>
              </div>

              <div style={{ fontSize: '0.8125rem', color: 'var(--civic-text-secondary)', lineHeight: 1.45 }}>
                {routingResult.documentEvidence.convergenceExplanation}
              </div>

              {routingResult.documentEvidence.documents[0]?.matchedSnippet && (
                <div style={{ fontSize: '0.75rem', color: 'var(--civic-text-muted)', fontStyle: 'italic', backgroundColor: '#FFFFFF', padding: '0.4rem 0.65rem', borderRadius: '6px', border: '1px solid var(--civic-border-light)' }}>
                  &ldquo;{routingResult.documentEvidence.documents[0].matchedSnippet}&rdquo;
                </div>
              )}
            </div>
          )}

          {/* Alternative Candidates */}
          {routingResult.alternativeCandidates.length > 0 && (
            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--civic-border-light)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--civic-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {language === 'hi' ? 'वैकल्पिक प्राधिकरण विकल्प:' : 'Alternative Authority Candidates:'}
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                {routingResult.alternativeCandidates.map((alt, idx) => (
                  <span
                    key={idx}
                    className="chip chip-secondary"
                    style={{ fontSize: '0.8125rem', padding: '0.35rem 0.75rem' }}
                  >
                    {alt.entity} ({Math.round(alt.confidence * 100)}%)
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Facility Directory Resolution Context (when Healthcare detected) */}
          {routingResult.facilityContextAvailable && (
            <FacilityContextCard
              queryText={routingResult.extractedFacilityQuery || text}
              facilityDomain={routingResult.facilityDomain}
            />
          )}

          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--civic-text-muted)' }}>
            <ShieldCheck size={14} style={{ color: 'var(--civic-brand)' }} />
            <span>{routingResult.disclaimer}</span>
          </div>
        </div>
      )}

      {/* Ambiguous / Needs Information Card (Responsible AI Triage) */}
      {routingResult && !routingResult.recommendedEntity && (text.trim().length >= 5 || attachedDocs.length > 0) && (
        <div
          className="card-surface"
          style={{
            border: '1.5px solid var(--civic-warning-border)',
            background: 'var(--civic-warning-bg)',
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: '#FFFFFF',
                color: 'var(--civic-warning-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: '1px solid var(--civic-warning-border)',
              }}
            >
              <AlertCircle size={22} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                <span className="chip chip-medium" style={{ fontSize: '0.75rem' }}>
                  {language === 'hi' ? 'अतिरिक्त विवरण आवश्यक (NEEDS REVIEW)' : 'Needs More Information (NEEDS REVIEW)'}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--civic-warning-text)' }}>
                  {language === 'hi' ? 'जिम्मेदार एआई वर्गीकरण • शून्य बनावटी अनुमान' : 'Responsible AI Triage • Zero False Guessing'}
                </span>
              </div>

              <h2 className="title-large" style={{ color: 'var(--civic-text-primary)', fontSize: '1.1rem' }}>
                {language === 'hi' ? 'शिकायत में विशिष्ट विभाग या सेवा का विवरण नहीं मिला' : 'Grievance Lacks Specific Departmental Identifiers'}
              </h2>

              <p style={{ fontSize: '0.875rem', color: 'var(--civic-text-secondary)', marginTop: '0.35rem', lineHeight: 1.5 }}>
                {routingResult.missingInfoGuidance || routingResult.matchReason}
              </p>

              {/* Document Evidence if available */}
              {routingResult.documentEvidence && routingResult.documentEvidence.totalAnalyzed > 0 && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.8125rem', color: 'var(--civic-warning-text)' }}>
                  Attached evidence note: {routingResult.documentEvidence.convergenceExplanation}
                </div>
              )}

              <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.45rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--civic-text-secondary)' }}>
                  {language === 'hi' ? 'सुझाए गए विषय जोड़ें:' : 'Add specific domain keyword:'}
                </span>
                {['EPFO / Pension', 'Income Tax / Refund', 'Health / Hospital', 'Railways / IRCTC', 'Electricity / Power', 'Passport'].map(sug => (
                  <button
                    key={sug}
                    type="button"
                    className="btn btn-tonal"
                    style={{ minHeight: '28px', padding: '0.2rem 0.6rem', fontSize: '0.75rem', backgroundColor: '#FFFFFF' }}
                    onClick={() => setText(prev => prev ? `${prev} (${sug})` : sug)}
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Evidence Viewer Modal */}
      <EvidenceViewerModal
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
        documents={attachedDocs}
        onRemoveDocument={handleRemoveDoc}
        grievanceQuery={text}
      />
    </div>
  );
};
