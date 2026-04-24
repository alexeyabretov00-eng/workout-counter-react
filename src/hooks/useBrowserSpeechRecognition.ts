import { useEffect, useRef, useState } from 'react';
import type { VoiceStatus } from '@types';

const TRANSIENT_SPEECH_ERRORS = new Set(['aborted', 'no-speech']);

type UseBrowserSpeechRecognitionParams = {
  lang?: string;
  onTranscript: (transcript: string) => void;
};

const getSpeechRecognitionCtor = () => {
  return window.SpeechRecognition ?? window.webkitSpeechRecognition;
};

const getInitialVoiceStatus = (): VoiceStatus => {
  return getSpeechRecognitionCtor() ? 'starting' : 'unsupported';
};

export const useBrowserSpeechRecognition = ({
  lang = 'ru-RU',
  onTranscript,
}: UseBrowserSpeechRecognitionParams) => {
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>(() => getInitialVoiceStatus());

  const onTranscriptRef = useRef(onTranscript);
  const shouldRestartRef = useRef(false);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  useEffect(() => {
    const SpeechRecognitionCtor = getSpeechRecognitionCtor();
    if (!SpeechRecognitionCtor) {
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;

    shouldRestartRef.current = true;

    recognition.onstart = () => {
      setVoiceStatus('listening');
    };

    recognition.onresult = event => {
      const firstResult = event.results[event.resultIndex];
      if (!firstResult || firstResult.length === 0) {
        return;
      }

      onTranscriptRef.current(firstResult[0].transcript);
    };

    recognition.onerror = event => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setVoiceStatus('blocked');
        shouldRestartRef.current = false;
        return;
      }

      if (TRANSIENT_SPEECH_ERRORS.has(event.error)) {
        return;
      }

      setVoiceStatus('error');
    };

    recognition.onend = () => {
      if (!shouldRestartRef.current) {
        return;
      }

      try {
        recognition.start();
        setVoiceStatus('listening');
      } catch {
        // Ignore repeated starts during rapid onend chains.
      }
    };

    const syncRecognitionToVisibility = () => {
      if (document.hidden) {
        shouldRestartRef.current = false;
        try {
          recognition.stop();
        } catch {
          // ignore
        }
        setVoiceStatus('inactive-tab');
        return;
      }

      shouldRestartRef.current = true;
      setVoiceStatus('starting');
      try {
        recognition.start();
      } catch {
        setVoiceStatus('listening');
      }
    };

    document.addEventListener('visibilitychange', syncRecognitionToVisibility);
    syncRecognitionToVisibility();

    return () => {
      document.removeEventListener('visibilitychange', syncRecognitionToVisibility);
      shouldRestartRef.current = false;
      recognition.onstart = null;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.stop();
    };
  }, [lang]);

  return { voiceStatus };
};
