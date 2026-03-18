import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Configuration options for the Text-to-Speech hook.
 */
interface TTSOptions {
  /** The text content to be spoken */
  text: string;
  /** The voice to use for speech synthesis */
  voice?: SpeechSynthesisVoice;
  /** Speech rate (0.1 to 10, default: 1) */
  rate?: number;
  /** Speech pitch (0 to 2, default: 1) */
  pitch?: number;
  /** Speech volume (0 to 1, default: 1) */
  volume?: number;
  /** Language code for speech synthesis (default: 'en-US') */
  lang?: string;
  /** Callback fired when speech reaches a word or sentence boundary */
  onBoundary?: (event: SpeechSynthesisEvent) => void;
  /** Callback fired when speech synthesis ends */
  onEnd?: () => void;
  /** Callback fired when an error occurs during speech synthesis */
  onError?: (event: SpeechSynthesisErrorEvent) => void;
  /** Callback fired when speech synthesis is paused */
  onPause?: () => void;
  /** Callback fired when speech synthesis resumes */
  onResume?: () => void;
  /** Callback fired when speech synthesis starts */
  onStart?: () => void;
}

/**
 * Control interface returned by the useTTS hook.
 */
interface TTSControls {
  /** Start speaking the configured text */
  speak: () => void;
  /** Pause the current speech synthesis */
  pause: () => void;
  /** Resume paused speech synthesis */
  resume: () => void;
  /** Stop and cancel the current speech synthesis */
  stop: () => void;
  /** Whether speech is currently playing */
  isPlaying: boolean;
  /** Whether speech is currently paused */
  isPaused: boolean;
  /** Whether speech synthesis is active (playing or paused) */
  isSpeaking: boolean;
  /** Array of available speech synthesis voices */
  voices: SpeechSynthesisVoice[];
  /** Set the voice for speech synthesis */
  setVoice: (voice: SpeechSynthesisVoice) => void;
  /** Set the speech rate */
  setRate: (rate: number) => void;
  /** Set the speech pitch */
  setPitch: (pitch: number) => void;
  /** Set the speech volume */
  setVolume: (volume: number) => void;
  /** Set the language for speech synthesis */
  setLanguage: (lang: string) => void;
}

/**
 * A custom React hook for Text-to-Speech functionality using the Web Speech API.
 * Provides comprehensive control over speech synthesis including voice selection,
 * speech parameters, and event handling.
 *
 * @param options - Configuration options for speech synthesis
 * @returns An object containing speech controls and state
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const {
 *     speak,
 *     pause,
 *     resume,
 *     stop,
 *     isPlaying,
 *     isPaused,
 *     voices,
 *     setVoice,
 *     setRate
 *   } = useTTS({
 *     text: "Hello, world!",
 *     rate: 1.2,
 *     onEnd: () => console.log("Speech finished")
 *   });
 *
 *   return (
 *     <div>
 *       <select onChange={(e) => {
 *         const voice = voices.find(v => v.name === e.target.value);
 *         if (voice) setVoice(voice);
 *       }}>
 *         {voices.map(voice => (
 *           <option key={voice.name} value={voice.name}>
 *             {voice.name}
 *           </option>
 *         ))}
 *       </select>
 *
 *       <button onClick={speak} disabled={isPlaying}>
 *         {isPlaying ? 'Speaking...' : 'Speak'}
 *       </button>
 *
 *       {isPlaying && (
 *         <div>
 *           <button onClick={pause} disabled={isPaused}>Pause</button>
 *           <button onClick={resume} disabled={!isPaused}>Resume</button>
 *           <button onClick={stop}>Stop</button>
 *         </div>
 *       )}
 *     </div>
 *   );
 * };
 * ```
 */
export const useTTS = (options: TTSOptions): TTSControls => {
  // State management
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Refs
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const {
    text,
    voice,
    rate = 1,
    pitch = 1,
    volume = 1,
    lang = 'en-US',
    onBoundary,
    onEnd,
    onError,
    onPause,
    onResume,
    onStart,
  } = options;

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Create and configure utterance
  const createUtterance = useCallback(() => {
    const utterance = new SpeechSynthesisUtterance(text);

    // Configure utterance
    if (voice) utterance.voice = voice;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    utterance.lang = lang;

    // Event handlers
    utterance.onstart = () => {
      setIsPlaying(true);
      setIsSpeaking(true);
      onStart?.();
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsSpeaking(false);
      setIsPaused(false);
      onEnd?.();
    };

    utterance.onpause = () => {
      setIsPaused(true);
      onPause?.();
    };

    utterance.onresume = () => {
      setIsPaused(false);
      onResume?.();
    };

    utterance.onerror = (event) => {
      setIsPlaying(false);
      setIsSpeaking(false);
      setIsPaused(false);
      onError?.(event);
    };

    utterance.onboundary = onBoundary || null;

    return utterance;
  }, [text, voice, rate, pitch, volume, lang, onBoundary, onEnd, onError, onPause, onResume, onStart]);

  // Control functions
  const speak = useCallback(() => {
    if (!text) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Create new utterance
    const utterance = createUtterance();
    utteranceRef.current = utterance;

    // Start speaking
    window.speechSynthesis.speak(utterance);
  }, [text, createUtterance]);

  const pause = useCallback(() => {
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    window.speechSynthesis.resume();
    setIsPaused(false);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  // Setters for voice properties
  const setVoice = useCallback((newVoice: SpeechSynthesisVoice) => {
    if (utteranceRef.current) {
      utteranceRef.current.voice = newVoice;
    }
  }, []);

  const setRate = useCallback((newRate: number) => {
    if (utteranceRef.current) {
      utteranceRef.current.rate = newRate;
    }
  }, []);

  const setPitch = useCallback((newPitch: number) => {
    if (utteranceRef.current) {
      utteranceRef.current.pitch = newPitch;
    }
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    if (utteranceRef.current) {
      utteranceRef.current.volume = newVolume;
    }
  }, []);

  const setLanguage = useCallback((newLang: string) => {
    if (utteranceRef.current) {
      utteranceRef.current.lang = newLang;
    }
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    speak,
    pause,
    resume,
    stop,
    isPlaying,
    isPaused,
    isSpeaking,
    voices,
    setVoice,
    setRate,
    setPitch,
    setVolume,
    setLanguage,
  };
};
