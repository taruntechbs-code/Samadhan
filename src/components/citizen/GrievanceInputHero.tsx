import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../common/Button';
import { EvidenceBadge } from '../common/EvidenceBadge';
import { routeGrievanceText } from '../../intelligence/routingEngine';
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
  Landmark,
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
  FileCheck,
  CheckCircle2,
  MapPin,
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
  const [routingError, setRoutingError] = useState<string | null>(null);
  const [progressStep] = useState(4);
  const [locationInput, setLocationInput] = useState('');

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
      handleAnalyze(externalQuery);
    }
  }, [externalQuery]);

  // Listen to custom scenario trigger event from navbar/evaluator
  useEffect(() => {
    const handleGlobalTrigger = (e: any) => {
      if (e.detail?.query) {
        setText(e.detail.query);
        handleAnalyze(e.detail.query);
      }
    };
    window.addEventListener('samadhan:triggerScenario', handleGlobalTrigger);
    return () => window.removeEventListener('samadhan:triggerScenario', handleGlobalTrigger);
  }, []);

  // Primary analysis execution
  const handleAnalyze = (overrideText?: string) => {
    const queryToAnalyze = (overrideText !== undefined ? overrideText : text).trim();
    if (!queryToAnalyze && attachedDocs.length === 0) return;

    if ((import.meta as any).env?.DEV) {
      console.log('[CTA CLICK] Triggering routing analysis for:', queryToAnalyze);
      console.log('[ANALYZE START] Query:', queryToAnalyze);
      console.log('[ROUTING CALL] Invoking routeGrievanceText directly');
    }

    setRoutingError(null);

    try {
      const result = routeGrievanceText(queryToAnalyze, attachedDocs);

      if ((import.meta as any).env?.DEV) {
        console.log('[ROUTING RESULT]', result);
        console.log('[STATE UPDATE] Setting routingResult');
      }

      setRoutingResult(result);
      setIsRouting(false);

      if ((import.meta as any).env?.DEV) {
        console.log('[ANALYZE COMPLETE] Routing finished successfully');
      }
    } catch (err: any) {
      if ((import.meta as any).env?.DEV) {
        console.error('[ANALYZE ERROR]', err);
      }
      setRoutingError(err?.message || 'Routing analysis failed. Please try again.');
      setIsRouting(false);
    }
  };

  const handleAppendLocation = (loc: string) => {
    if (!loc.trim()) return;
    const base = text.trim();
    const updated = base ? `${base} in ${loc.trim()}` : `Grievance in ${loc.trim()}`;
    setText(updated);
    setLocationInput('');
    handleAnalyze(updated);
  };

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

          <h1
            className="display-large"
            style={{
              color: 'var(--civic-text-primary)',
              margin: 0,
              fontSize: 'clamp(1.65rem, 4.5vw, 2.75rem)',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
            }}
          >
            {language === 'hi' ? (
              <>
                <span>आपकी समस्या। सही प्राधिकरण।</span>{' '}
                <span style={{ color: 'var(--civic-brand)', display: 'inline-block' }}>निवारण का स्पष्ट मार्ग।</span>
              </>
            ) : (
              <>
                <span>Your problem. The right authority.</span>{' '}
                <span style={{ color: 'var(--civic-brand)', display: 'inline-block' }}>A clearer path to resolution.</span>
              </>
            )}
          </h1>

          <p
            className="body-large"
            style={{
              color: 'var(--civic-text-secondary)',
              maxWidth: '680px',
              margin: 0,
              fontSize: 'clamp(0.875rem, 2vw, 1.05rem)',
              lineHeight: 1.5,
            }}
          >
            {language === 'hi'
              ? 'अपनी शिकायत अपने शब्दों में लिखें या बोलें। समाधान उपयुक्त लोक प्राधिकरण की पहचान करता है, कारण स्पष्ट करता है, और सिफारिश के पीछे का डेटा साक्ष्य प्रस्तुत करता है।'
              : 'Describe your grievance in your own words or speak naturally. SAMADHAN identifies the appropriate public authority, explains why, and provides explainable evidence.'}
          </p>

          {/* Grievance Input Form Container - Dedicated Composer Architecture */}
          <div style={{ width: '100%', marginTop: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label
                htmlFor="grievance-input"
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: 'var(--civic-text-secondary)',
                  textAlign: 'left',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {language === 'hi' ? 'शिकायत का विवरण दर्ज करें' : 'Describe your grievance'}
              </label>

              <span style={{ fontSize: '0.75rem', color: 'var(--civic-text-muted)' }}>
                {text.length > 0 ? `${text.length} chars` : (language === 'hi' ? 'हिंदी या अंग्रेजी' : 'Hindi or English')}
              </span>
            </div>

            <div
              className="grievance-composer"
              style={{
                width: '100%',
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                border: isListening ? '1.5px solid var(--civic-danger)' : '1.5px solid var(--civic-border-medium)',
                boxShadow: 'var(--shadow-xs)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                transition: 'border-color var(--transition-fast)',
              }}
            >
              <textarea
                id="grievance-input"
                style={{
                  width: '100%',
                  minHeight: '190px',
                  padding: '1.1rem 1.25rem',
                  fontSize: '1rem',
                  lineHeight: 1.5,
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  color: 'var(--civic-text-primary)',
                  boxSizing: 'border-box',
                }}
                placeholder={
                  language === 'hi'
                    ? "उदाहरण: मेरा आयकर रिफंड ई-सत्यापन के छह महीने बाद भी बैंक खाते में जमा नहीं हुआ है..."
                    : "Example: My income tax refund has not been credited to my bank account for six months despite e-verification..."
                }
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    handleAnalyze();
                  }
                }}
                aria-label="Describe your grievance in simple words"
              />

              {/* Dedicated Bottom Toolbar */}
              <div
                className="composer-toolbar"
                style={{
                  borderTop: '1px solid var(--civic-border-light)',
                  backgroundColor: 'var(--civic-canvas-subtle)',
                  padding: '0.65rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {/* Real Microphone Voice Button */}
                  <button
                    type="button"
                    className="btn btn-tonal"
                    style={{
                      minHeight: '42px',
                      padding: '0.45rem 0.85rem',
                      fontSize: '0.8125rem',
                      color: isListening ? 'var(--civic-danger)' : 'var(--civic-text-secondary)',
                      backgroundColor: isListening ? 'var(--civic-danger-bg)' : '#FFFFFF',
                      border: isListening ? '1px solid var(--civic-danger)' : '1px solid var(--civic-border-medium)',
                      fontWeight: isListening ? 700 : 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                    onClick={handleToggleVoice}
                    title="Speak grievance via browser microphone"
                    aria-label={isListening ? 'Stop listening' : 'Start speech recognition'}
                  >
                    {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                    <span>{isListening ? (language === 'hi' ? '● सुन रहा है...' : '● Listening...') : (language === 'hi' ? 'बोलें' : 'Speak')}</span>
                  </button>

                  {/* Real Native File Picker Button */}
                  <button
                    type="button"
                    className="btn btn-tonal"
                    style={{
                      minHeight: '42px',
                      padding: '0.45rem 0.85rem',
                      fontSize: '0.8125rem',
                      backgroundColor: attachedDocs.length > 0 ? 'var(--civic-success-bg)' : '#FFFFFF',
                      color: attachedDocs.length > 0 ? 'var(--civic-success-text)' : 'var(--civic-text-secondary)',
                      border: '1px solid var(--civic-border-medium)',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                    onClick={handleOpenNativePicker}
                    title="Attach evidence reference document"
                    disabled={isParsingFiles}
                  >
                    <Paperclip size={16} />
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
                      style={{ minHeight: '42px', padding: '0.45rem 0.65rem', fontSize: '0.75rem', color: 'var(--civic-text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                      onClick={handleReset}
                    >
                      <RefreshCw size={14} />
                      <span>{language === 'hi' ? 'साफ़ करें' : 'Clear'}</span>
                    </button>
                  )}
                </div>

                {/* Primary Unmissable Analyze CTA Button */}
                <Button
                  id="btn-find-authority"
                  type="button"
                  variant="filled"
                  className="composer-analyze-cta"
                  style={{
                    minHeight: '44px',
                    padding: '0.55rem 1.4rem',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                  disabled={isRouting || (!text.trim() && attachedDocs.length === 0)}
                  onClick={() => {
                    if ((import.meta as any).env?.DEV) {
                      console.log('[CLICK] Find the Right Authority button clicked');
                    }
                    handleAnalyze();
                  }}
                  aria-label={
                    !text.trim() && attachedDocs.length === 0
                      ? (language === 'hi' ? 'प्राधिकरण खोजने से पहले अपनी शिकायत लिखें' : 'Enter a grievance before finding the appropriate authority')
                      : (language === 'hi' ? 'शिकायत का विश्लेषण करें एवं लोक प्राधिकरण खोजें' : 'Analyze grievance and find public authority')
                  }
                >
                  {isRouting ? (
                    <>
                      <Cpu size={16} className="spin" />
                      <span>{language === 'hi' ? 'शिकायत का विश्लेषण हो रहा है...' : 'Analyzing grievance...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{language === 'hi' ? 'सही प्राधिकरण खोजें' : 'Find the Right Authority'}</span>
                      <ArrowRight size={17} />
                    </>
                  )}
                </Button>
              </div>
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

          {/* Quick Example Starters (Smooth Swipeable Rail) */}
          <div style={{ width: '100%', marginTop: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.45rem', justifyContent: 'center' }}>
              <Sparkles size={13} style={{ color: 'var(--civic-brand)' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--civic-text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {language === 'hi' ? 'त्वरित उदाहरण आजमाएं' : 'Try Quick Example Grievances'}
              </span>
            </div>
            <div
              className="mobile-scroll-strip"
              style={{
                gap: '0.5rem',
                padding: '0.2rem 0.25rem 0.5rem 0.25rem',
                justifyContent: 'center',
              }}
            >
              {QUICK_STARTERS.map((qs, i) => (
                <button
                  key={i}
                  type="button"
                  className="btn btn-tonal"
                  style={{
                    minHeight: '44px',
                    padding: '0.45rem 0.95rem',
                    fontSize: '0.8125rem',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--civic-border-medium)',
                    borderRadius: 'var(--radius-pill)',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    fontWeight: 500,
                  }}
                  onClick={() => {
                    setText(qs);
                    setRoutingResult(null);
                  }}
                  aria-label={`Select example grievance: ${qs}`}
                >
                  {qs.split(' ').slice(0, 3).join(' ')}...
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Analysis In-Progress State (4-Step Lightweight Visual Progress) */}
      {isRouting && (
        <div
          className="card-surface"
          aria-live="polite"
          aria-busy="true"
          style={{
            border: '1.5px solid var(--civic-brand-border)',
            backgroundColor: '#FFFFFF',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.875rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--civic-brand)', fontWeight: 700, fontSize: '0.9375rem' }}>
            <Cpu size={18} className="spin" />
            <span>{language === 'hi' ? 'समाधान प्रज्ञान इंजन विश्लेषण कर रहा है...' : 'SAMADHAN Intelligence Engine is Analyzing Your Grievance...'}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.65rem' }}>
            {[
              { step: 1, label: language === 'hi' ? 'विवरण एवं मुख्य शब्दों का विश्लेषण' : '1. Understanding Description' },
              { step: 2, label: language === 'hi' ? 'लोक सेवा श्रेणी की पहचान' : '2. Identifying Service Category' },
              { step: 3, label: language === 'hi' ? 'सक्षम प्राधिकारी क्षेत्राधिकार का निर्धारण' : '3. Determining Authority Jurisdiction' },
              { step: 4, label: language === 'hi' ? 'सीपीग्राम्स डेटा एवं साक्ष्य सत्यापन' : '4. Checking Verified Telemetry' },
            ].map(st => (
              <div
                key={st.step}
                style={{
                  backgroundColor: progressStep >= st.step ? 'var(--civic-brand-light)' : 'var(--civic-canvas-subtle)',
                  color: progressStep >= st.step ? 'var(--civic-brand-dark)' : 'var(--civic-text-muted)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s ease',
                }}
              >
                {progressStep > st.step ? <CheckCircle2 size={14} color="var(--civic-success)" /> : <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'currentColor' }} />}
                <span>{st.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recoverable Error State */}
      {routingError && !isRouting && (
        <div
          className="card-surface"
          aria-live="polite"
          style={{
            border: '1.5px solid var(--civic-danger)',
            backgroundColor: 'var(--civic-danger-bg)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--civic-danger)', fontWeight: 700 }}>
            <AlertCircle size={18} />
            <span>{language === 'hi' ? 'विश्लेषण पूरा नहीं हो सका' : "We couldn't complete the routing analysis."}</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--civic-text-secondary)', margin: 0 }}>
            {language === 'hi'
              ? 'आपकी शिकायत का विवरण सुरक्षित है। कृपया पुनः प्रयास करें।'
              : 'Your grievance description is preserved. Please try analyzing again or edit your input.'}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
            <Button variant="filled" style={{ minHeight: '44px', padding: '0.35rem 1.25rem', fontSize: '0.8125rem' }} onClick={() => handleAnalyze()}>
              <span>{language === 'hi' ? 'पुनः प्रयास करें' : 'Try Again'}</span>
            </Button>
          </div>
        </div>
      )}

      {/* Prominent High-Visibility Routing Result (ROUTED) */}
      {!isRouting && !routingError && routingResult && (routingResult.outcomeKind === 'ROUTED' || !!routingResult.recommendedEntity) && (
        <div
          id="routing-result-section"
          className="card-surface"
          aria-live="polite"
          style={{
            border: '1.5px solid var(--civic-brand-border)',
            background: '#FFFFFF',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {/* Header Banner */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', paddingBottom: '0.875rem', borderBottom: '1px solid var(--civic-border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="chip chip-primary" style={{ fontSize: '0.75rem', fontWeight: 800 }}>
                {language === 'hi' ? 'अनुशंसित लोक प्राधिकरण' : 'ROUTING RESULT'}
              </span>
              <span
                className="chip"
                style={{
                  backgroundColor: routingResult.jurisdictionLevel === 'LOCAL_MUNICIPAL' ? '#EEF2FF' : 'var(--civic-brand-light)',
                  color: routingResult.jurisdictionLevel === 'LOCAL_MUNICIPAL' ? '#3730A3' : 'var(--civic-brand-dark)',
                  border: '1px solid var(--civic-brand-border)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                {routingResult.jurisdictionLevel === 'LOCAL_MUNICIPAL'
                  ? (language === 'hi' ? 'स्थानीय नगर निकाय (ULB)' : 'Local Municipal Authority')
                  : routingResult.jurisdictionLevel === 'STATE_GOVERNMENT'
                  ? (language === 'hi' ? 'राज्य सरकार' : 'State Government')
                  : (language === 'hi' ? 'केंद्रीय मंत्रालय / विभाग' : 'Central Ministry / Department')}
              </span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--civic-brand)' }}>
                {Math.round(routingResult.confidence * 100)}% {language === 'hi' ? 'विश्वास स्कोर' : 'Certainty'}
              </span>
            </div>

            <EvidenceBadge
              evidence={{
                dataset: routingResult.jurisdictionLevel === 'LOCAL_MUNICIPAL' ? 'pcmc_municipal_case_study' : 'live_dashboard_2026',
                entity: routingResult.recommendedEntity || 'Public Authority',
                metric: 'target_authority_mapping',
                value: routingResult.detectedCategory,
                period: '2026-01-01 to 2026-08-24',
                sourceUrl: 'https://pgportal.gov.in/darpgdashboard',
                sourceNote: 'Statutory jurisdiction catalogued in DARPG official master registry.',
              }}
              label={language === 'hi' ? 'सीपीग्राम्स सत्यापित' : 'CPGRAMS Operational Data'}
            />
          </div>

          {/* Authority & Category Profile */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
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
                {routingResult.jurisdictionLevel === 'LOCAL_MUNICIPAL' ? <Landmark size={24} /> : <Building2 size={24} />}
              </div>

              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--civic-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {language === 'hi' ? 'पहचाना गया मुद्दा / श्रेणी' : 'Detected Category'}: <strong style={{ color: 'var(--civic-text-primary)' }}>{routingResult.detectedCategory}</strong>
                </div>

                <h2 className="title-large" style={{ color: 'var(--civic-text-primary)', marginTop: '0.25rem', fontSize: 'clamp(1.15rem, 3.5vw, 1.5rem)', wordBreak: 'break-word' }}>
                  {routingResult.recommendedEntity}
                </h2>
              </div>
            </div>

            <Button
              variant="filled"
              style={{ minHeight: '46px', padding: '0.65rem 1.4rem', width: 'auto', fontWeight: 700 }}
              onClick={() => onOpenSubmitModal(routingResult, text)}
            >
              <span>{language === 'hi' ? 'इस विभाग में शिकायत दर्ज करें' : 'Lodge Grievance to this Authority'}</span>
              <ArrowRight size={18} />
            </Button>
          </div>

          {/* Why this authority? Structured Deterministic Explanations */}
          <div style={{ backgroundColor: 'var(--civic-canvas-subtle)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', border: '1px solid var(--civic-border-light)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--civic-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {language === 'hi' ? 'इस प्राधिकरण की सिफारिश क्यों की गई?' : 'Why this Authority?'}
            </span>
            <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.84rem', color: 'var(--civic-text-primary)', lineHeight: 1.5 }}>
              {routingResult.explanations && routingResult.explanations.length > 0 ? (
                routingResult.explanations.map((exp, i) => <li key={i}>{exp}</li>)
              ) : (
                <li>{routingResult.matchReason}</li>
              )}
            </ul>
          </div>

          {/* Document Evidence Section */}
          {routingResult.documentEvidence && routingResult.documentEvidence.totalAnalyzed > 0 && (
            <div
              style={{
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
            <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--civic-border-light)' }}>
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--civic-text-muted)' }}>
            <ShieldCheck size={14} style={{ color: 'var(--civic-brand)' }} />
            <span>{routingResult.disclaimer}</span>
          </div>
        </div>
      )}

      {/* Ambiguous / Needs Information / Location Required Card (NEEDS_INFORMATION) */}
      {!isRouting && !routingError && routingResult && (routingResult.outcomeKind === 'NEEDS_INFORMATION' || !routingResult.recommendedEntity) && (
        <div
          id="routing-needs-info-section"
          className="card-surface"
          aria-live="polite"
          style={{
            border: '1.5px solid var(--civic-warning-border)',
            background: 'var(--civic-warning-bg)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
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
              {routingResult.needsLocation || routingResult.clarification?.type === 'LOCATION' ? <MapPin size={22} /> : <AlertCircle size={22} />}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                <span className="chip chip-medium" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                  {routingResult.needsLocation || routingResult.clarification?.type === 'LOCATION'
                    ? (language === 'hi' ? 'स्थान का विवरण आवश्यक' : 'Location Required')
                    : (language === 'hi' ? 'अतिरिक्त विवरण आवश्यक (NEEDS INFORMATION)' : 'Needs More Information (NEEDS INFORMATION)')}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--civic-warning-text)', fontWeight: 600 }}>
                  {language === 'hi' ? 'जिम्मेदार एआई वर्गीकरण • शून्य बनावटी अनुमान' : 'Responsible AI Triage • Zero False Guessing'}
                </span>
              </div>

              <h2 className="title-large" style={{ color: 'var(--civic-text-primary)', fontSize: '1.15rem' }}>
                {routingResult.clarification?.question
                  ? routingResult.clarification.question
                  : routingResult.needsLocation
                  ? (language === 'hi' ? 'यह शिकायत किस शहर या नगर पालिका की है?' : 'Which city or municipality is this in?')
                  : (language === 'hi' ? 'शिकायत में विशिष्ट विभाग या सेवा का विवरण नहीं मिला' : 'Grievance Lacks Specific Departmental Identifiers')}
              </h2>

              <p style={{ fontSize: '0.875rem', color: 'var(--civic-text-secondary)', marginTop: '0.35rem', lineHeight: 1.5 }}>
                {routingResult.clarification?.reason || routingResult.missingInfoGuidance || routingResult.matchReason}
              </p>

              {/* Explanations bullet points */}
              {routingResult.explanations && routingResult.explanations.length > 0 && (
                <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.8125rem', color: 'var(--civic-text-secondary)' }}>
                  {routingResult.explanations.map((exp, i) => <li key={i}>{exp}</li>)}
                </ul>
              )}

              {/* Interactive Clarification Option Cards */}
              {routingResult.clarification?.options && routingResult.clarification.options.length > 0 && (
                <div style={{ marginTop: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--civic-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {language === 'hi' ? 'प्रासंगिक श्रेणी या पोर्टल चुनें:' : 'Select Relevant Service or Portal:'}
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem' }}>
                    {routingResult.clarification.options.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        className="btn btn-tonal"
                        style={{
                          minHeight: '44px',
                          padding: '0.5rem 0.85rem',
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          backgroundColor: '#FFFFFF',
                          border: '1px solid var(--civic-border-medium)',
                          borderRadius: 'var(--radius-md)',
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          color: 'var(--civic-text-primary)',
                        }}
                        onClick={() => {
                          const updated = `${text.trim()} (${opt.querySuffix})`;
                          setText(updated);
                          handleAnalyze(updated);
                        }}
                      >
                        <span style={{ color: 'var(--civic-brand)', marginRight: '0.4rem', fontWeight: 800 }}>→</span>
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Location prompt input and chips when needsLocation */}
              {(routingResult.needsLocation || routingResult.clarification?.type === 'LOCATION') && (
                <div style={{ marginTop: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      className="input-filled"
                      style={{ flex: '1 1 200px', minHeight: '44px', padding: '0.4rem 0.85rem', fontSize: '0.875rem', backgroundColor: '#FFFFFF' }}
                      placeholder={language === 'hi' ? 'उदा. कुरनूल, आंध्र प्रदेश या पिंपरी चिंचवड' : 'e.g. Kurnool, Andhra Pradesh or Pune'}
                      value={locationInput}
                      onChange={e => setLocationInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && locationInput.trim()) {
                          e.preventDefault();
                          handleAppendLocation(locationInput);
                        }
                      }}
                    />
                    <Button
                      variant="filled"
                      style={{ minHeight: '44px', padding: '0.4rem 1.25rem', fontSize: '0.8125rem', fontWeight: 700 }}
                      onClick={() => handleAppendLocation(locationInput)}
                      disabled={!locationInput.trim()}
                    >
                      <span>{language === 'hi' ? 'स्थान जोड़ें एवं पुनः विश्लेषण करें' : 'Add Location & Re-analyze'}</span>
                    </Button>
                  </div>

                  {(routingResult.suggestedLocations || routingResult.clarification?.suggestedLocations) && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--civic-text-muted)' }}>
                        {language === 'hi' ? 'त्वरित शहर चुनें:' : 'Quick locations:'}
                      </span>
                      {(routingResult.suggestedLocations || routingResult.clarification?.suggestedLocations || []).map(loc => (
                        <button
                          key={loc}
                          type="button"
                          className="btn btn-tonal"
                          style={{ minHeight: '36px', padding: '0.3rem 0.75rem', fontSize: '0.75rem', backgroundColor: '#FFFFFF', border: '1px solid var(--civic-border-medium)' }}
                          onClick={() => handleAppendLocation(loc)}
                        >
                          + {loc}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Domain suggestion chips for general ambiguity without explicit options */}
              {!routingResult.needsLocation && !routingResult.clarification?.options && (
                <div style={{ marginTop: '0.875rem', display: 'flex', flexWrap: 'wrap', gap: '0.45rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--civic-text-secondary)' }}>
                    {language === 'hi' ? 'सुझाए गए विषय जोड़ें:' : 'Add specific domain keyword:'}
                  </span>
                  {['EPFO / Pension', 'Income Tax / Refund', 'Health / Hospital', 'Railways / IRCTC', 'Electricity / Power', 'Passport'].map(sug => (
                    <button
                      key={sug}
                      type="button"
                      className="btn btn-tonal"
                      style={{ minHeight: '36px', padding: '0.3rem 0.75rem', fontSize: '0.75rem', backgroundColor: '#FFFFFF', border: '1px solid var(--civic-border-medium)' }}
                      onClick={() => {
                        const updated = text ? `${text} (${sug})` : sug;
                        setText(updated);
                        handleAnalyze(updated);
                      }}
                    >
                      + {sug}
                    </button>
                  ))}
                </div>
              )}
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
