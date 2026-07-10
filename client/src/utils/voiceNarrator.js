// Pennywise Voice Narrator — speaks anywhere in the app
const fixPronunciation = (text) => {
  return text
    .replace(/\bI T\b/g, "It")
    .replace(/\bI\.T\.\b/g, "It")
    .replace(/\bIT\b/g, "It")
    .replace(/₹/g, "rupees")
    .replace(/🎈/g, "")
    .replace(/🩸/g, "")
    .replace(/[^\w\s.,!?'"()-]/g, "");
};

const getScariestVoice = () => {
  const voices = window.speechSynthesis.getVoices();

  // Priority order — deep, dark, dramatic voices
  const preferred = [
    "Google UK English Male",
    "Microsoft George",
    "Microsoft David",
    "Daniel",
    "Alex",
  ];

  for (const name of preferred) {
    const match = voices.find((v) => v.name.includes(name));
    if (match) return match;
  }

  // Fallback — pick any male English voice
  const male = voices.find(
    (v) => v.lang.startsWith("en") && v.name.toLowerCase().includes("male"),
  );
  if (male) return male;

  return voices.find((v) => v.lang.startsWith("en")) || voices[0];
};

export const speakAsPennywise = (text, onEnd) => {
  if (!window.speechSynthesis) return;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const cleaned = fixPronunciation(text);
  const utterance = new SpeechSynthesisUtterance(cleaned);

  const setVoiceAndSpeak = () => {
    const voice = getScariestVoice();
    if (voice) utterance.voice = voice;

    // Scary voice settings
    utterance.pitch = 0.3; // Very deep
    utterance.rate = 0.75; // Slow and deliberate
    utterance.volume = 1; // Full volume

    if (onEnd) utterance.onend = onEnd;

    window.speechSynthesis.speak(utterance);
  };

  // Voices may not be loaded yet
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = setVoiceAndSpeak;
  } else {
    setVoiceAndSpeak();
  }
};

export const stopSpeaking = () => {
  window.speechSynthesis.cancel();
};
