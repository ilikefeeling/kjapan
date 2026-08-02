// Web Audio API Emergency Siren & Speech Synthesizer

let audioCtx: AudioContext | null = null;
let isPlayingSiren = false;
let sirenInterval: any = null;

export function playEmergencySirenTone() {
  if (isPlayingSiren) return;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isPlayingSiren = true;

    // Siren oscillator loop
    const playPulse = () => {
      if (!audioCtx || !isPlayingSiren) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sawtooth';
      
      const now = audioCtx.currentTime;
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.4);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.8);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.8);
    };

    playPulse();
    sirenInterval = setInterval(playPulse, 900);
  } catch (err) {
    console.warn("Web Audio API error:", err);
  }
}

export function stopEmergencySirenTone() {
  isPlayingSiren = false;
  if (sirenInterval) {
    clearInterval(sirenInterval);
    sirenInterval = null;
  }
  // Also stop any running speech synthesis (TTS)
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  if (audioCtx && audioCtx.state !== 'closed') {
    // Suspend context to immediately silence any residual oscillator output
    audioCtx.suspend().catch(() => {});
  }
}

export function speakEmergencyKoreanGuide(text: string) {
  if (!('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel(); // stop current
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 1.0;
    utterance.pitch = 1.1;
    utterance.volume = 1.0;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn("Web Speech API error:", e);
  }
}
