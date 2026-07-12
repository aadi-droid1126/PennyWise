// Pennywise Voice Narrator — speaks anywhere in the app.
// Uses the browser's built-in speechSynthesis. No external API, no cost.
// Tricks used to sound less robotic:
//   1. Smarter voice selection (prefers higher-quality neural/network voices)
//   2. Text is split into short clauses spoken as separate utterances with
//      tiny gaps between them — this fakes dramatic pauses, since the
//      Web Speech API doesn't support SSML <break> tags.
//   3. Pitch/rate get a small random wobble per line instead of being
//      perfectly identical every time, which is what makes TTS sound "flat."
//   4. Sentence-ending punctuation gets slightly longer pauses than commas.

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

// Split on sentence-enders and commas, keeping the punctuation attached
// so we know how long to pause after each chunk.
// Split only on sentence-enders. Splitting on commas too created a
// noticeable pause every few words, which felt sluggish rather than dramatic.
const splitIntoClauses = (text) => {
  const raw = text.match(/[^.!?]+[.!?]?/g) || [text];
  return raw
    .map((s) => s.trim())
    .filter(Boolean);
};

const pauseFor = (clause) => {
  if (/[.!?]$/.test(clause)) return 150; // end of sentence — brief beat
  return 30;
};

let cachedVoices = [];

const loadVoices = () =>
  new Promise((resolve) => {
    const existing = window.speechSynthesis.getVoices();
    if (existing.length) {
      cachedVoices = existing;
      resolve(existing);
      return;
    }
    window.speechSynthesis.onvoiceschanged = () => {
      cachedVoices = window.speechSynthesis.getVoices();
      resolve(cachedVoices);
    };
  });

// Ranked by how natural/deep they tend to sound across platforms.
// Neural/"Online"/"Natural" voices are dramatically less robotic than
// the default compact/legacy voices most OSes fall back to.
const VOICE_PRIORITY = [
  "Google UK English Male",
  "Microsoft Ryan Online (Natural)",
  "Microsoft Guy Online (Natural)",
  "Microsoft George Online (Natural)",
  "Microsoft Ryan",
  "Microsoft Guy",
  "Microsoft George",
  "Microsoft David",
  "Daniel",
  "Alex",
  "Fred",
];

const getScariestVoice = (voices) => {
  for (const name of VOICE_PRIORITY) {
    const match = voices.find((v) => v.name.includes(name));
    if (match) return match;
  }

  // Prefer anything explicitly tagged "Natural" or "Online" — usually
  // means a cloud/neural voice rather than the old robotic offline one.
  const natural = voices.find(
    (v) => v.lang.startsWith("en") && /natural|online|neural/i.test(v.name),
  );
  if (natural) return natural;

  const male = voices.find(
    (v) => v.lang.startsWith("en") && v.name.toLowerCase().includes("male"),
  );
  if (male) return male;

  return voices.find((v) => v.lang.startsWith("en")) || voices[0];
};

// Small random wobble so every line doesn't sound machine-identical.
const wobble = (base, spread) => base + (Math.random() * spread * 2 - spread);

export const speakAsPennywise = async (text, onEnd) => {
  if (!window.speechSynthesis) {
    if (onEnd) onEnd();
    return;
  }

  window.speechSynthesis.cancel();

  const voices = cachedVoices.length ? cachedVoices : await loadVoices();
  const voice = getScariestVoice(voices);

  const cleaned = fixPronunciation(text);
  const clauses = splitIntoClauses(cleaned);

  if (clauses.length === 0) {
    if (onEnd) onEnd();
    return;
  }

  let index = 0;
  let cancelled = false;

  const speakNext = () => {
    if (cancelled || index >= clauses.length) {
      if (onEnd) onEnd();
      return;
    }

    const clause = clauses[index];
    const gap = pauseFor(clause);
    const utterance = new SpeechSynthesisUtterance(clause);

    if (voice) utterance.voice = voice;
    utterance.pitch = wobble(0.32, 0.06); // deep, with slight variance per clause
    utterance.rate = wobble(0.78, 0.05); // slow and deliberate, not uniform
    utterance.volume = 1;

    utterance.onend = () => {
      index += 1;
      if (cancelled) {
        if (onEnd) onEnd();
        return;
      }
      setTimeout(speakNext, gap);
    };

    utterance.onerror = () => {
      index += 1;
      if (!cancelled) setTimeout(speakNext, gap);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Expose a way for stopSpeaking() to halt the clause chain, not just
  // the current utterance.
  speakAsPennywise._cancel = () => {
    cancelled = true;
  };

  speakNext();
};

export const stopSpeaking = () => {
  if (speakAsPennywise._cancel) speakAsPennywise._cancel();
  window.speechSynthesis.cancel();
};
