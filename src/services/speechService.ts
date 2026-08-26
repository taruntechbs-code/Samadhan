/**
 * SAMADHAN — Real Browser Speech-to-Text Service
 * Uses browser-native Web Speech API (window.SpeechRecognition / webkitSpeechRecognition)
 * with a provider abstraction for zero external API key requirements.
 */

export interface SpeechRecognitionResultPayload {
  transcript: string;
  isFinal: boolean;
  confidence?: number;
}

export type SpeechErrorType =
  | 'NOT_SUPPORTED'
  | 'PERMISSION_DENIED'
  | 'NO_SPEECH'
  | 'NETWORK_ERROR'
  | 'ABORTED'
  | 'UNKNOWN';

export interface SpeechRecognitionErrorPayload {
  type: SpeechErrorType;
  message: string;
}

export interface SpeechRecognitionCallbacks {
  onStart?: () => void;
  onResult?: (payload: SpeechRecognitionResultPayload) => void;
  onError?: (error: SpeechRecognitionErrorPayload) => void;
  onEnd?: () => void;
}

export interface SpeechRecognitionProvider {
  isSupported(): boolean;
  start(callbacks: SpeechRecognitionCallbacks, language?: string): void;
  stop(): void;
  isListening(): boolean;
}

export class BrowserSpeechRecognitionProvider implements SpeechRecognitionProvider {
  private recognition: any | null = null;
  private listening: boolean = false;
  private callbacks: SpeechRecognitionCallbacks = {};

  constructor() {
    // Check for browser support (SpeechRecognition or webkitSpeechRecognition)
    const SpeechRecognitionAPI =
      typeof window !== 'undefined'
        ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        : null;

    if (SpeechRecognitionAPI) {
      try {
        this.recognition = new SpeechRecognitionAPI();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;
      } catch (err) {
        console.warn('SpeechRecognition initialization error:', err);
        this.recognition = null;
      }
    }
  }

  public isSupported(): boolean {
    return this.recognition !== null;
  }

  public isListening(): boolean {
    return this.listening;
  }

  public start(callbacks: SpeechRecognitionCallbacks, language: string = 'en-IN'): void {
    if (!this.recognition) {
      if (callbacks.onError) {
        callbacks.onError({
          type: 'NOT_SUPPORTED',
          message: 'Voice input is not supported in this browser. You can type your grievance instead.',
        });
      }
      return;
    }

    this.callbacks = callbacks;
    this.recognition.lang = language === 'hi' || language === 'hi-IN' ? 'hi-IN' : 'en-IN';

    this.recognition.onstart = () => {
      this.listening = true;
      if (this.callbacks.onStart) {
        this.callbacks.onStart();
      }
    };

    this.recognition.onresult = (event: any) => {
      if (!this.callbacks.onResult) return;

      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        const text = item[0].transcript;
        if (item.isFinal) {
          finalTranscript += text;
        } else {
          interimTranscript += text;
        }
      }

      if (finalTranscript.trim()) {
        this.callbacks.onResult({
          transcript: finalTranscript.trim(),
          isFinal: true,
          confidence: event.results[event.resultIndex]?.[0]?.confidence,
        });
      } else if (interimTranscript.trim()) {
        this.callbacks.onResult({
          transcript: interimTranscript.trim(),
          isFinal: false,
        });
      }
    };

    this.recognition.onerror = (event: any) => {
      let errorType: SpeechErrorType = 'UNKNOWN';
      let message = 'An unexpected speech recognition error occurred.';

      switch (event.error) {
        case 'not-allowed':
        case 'permission-denied':
          errorType = 'PERMISSION_DENIED';
          message = 'Microphone permission was denied. Please allow microphone access in your browser settings.';
          break;
        case 'no-speech':
          errorType = 'NO_SPEECH';
          message = 'No speech was detected. Please try speaking again.';
          break;
        case 'network':
          errorType = 'NETWORK_ERROR';
          message = 'Network error during speech recognition. Please check your connection.';
          break;
        case 'aborted':
          errorType = 'ABORTED';
          message = 'Speech recognition was stopped.';
          break;
        default:
          message = event.message || `Speech recognition error: ${event.error}`;
      }

      if (this.callbacks.onError) {
        this.callbacks.onError({ type: errorType, message });
      }
    };

    this.recognition.onend = () => {
      this.listening = false;
      if (this.callbacks.onEnd) {
        this.callbacks.onEnd();
      }
    };

    try {
      this.recognition.start();
    } catch (err: any) {
      if (err.name === 'InvalidStateError') {
        // Recognition already started
        this.listening = true;
      } else if (this.callbacks.onError) {
        this.callbacks.onError({
          type: 'UNKNOWN',
          message: err.message || 'Failed to start speech recognition.',
        });
      }
    }
  }

  public stop(): void {
    if (this.recognition && this.listening) {
      try {
        this.recognition.stop();
      } catch (err) {
        console.warn('Speech recognition stop warning:', err);
      } finally {
        this.listening = false;
      }
    }
  }
}

// Global Singleton Provider Instance
let defaultSpeechProvider: SpeechRecognitionProvider | null = null;

export function getSpeechProvider(): SpeechRecognitionProvider {
  if (!defaultSpeechProvider) {
    defaultSpeechProvider = new BrowserSpeechRecognitionProvider();
  }
  return defaultSpeechProvider;
}
