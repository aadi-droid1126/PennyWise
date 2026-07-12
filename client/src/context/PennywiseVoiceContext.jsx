import { createContext, useContext, useState, useCallback, useRef } from "react";
import { speakAsPennywise, stopSpeaking } from "../utils/voiceNarrator";
import { getPennywiseRoast } from "../utils/contextualRoast";

const PennywiseVoiceContext = createContext(null);

export const PennywiseVoiceProvider = ({ children }) => {
    const [speaking, setSpeaking] = useState(false);
    const [lastLine, setLastLine] = useState("");
    const cooldownRef = useRef(false);

    const speak = useCallback(async (context) => {
        // Prevent overlapping triggers (e.g. two events firing back to back)
        if (cooldownRef.current) return;
        cooldownRef.current = true;

        try {
            const roast = await getPennywiseRoast(context);
            setLastLine(roast);
            setSpeaking(true);
            speakAsPennywise(roast, () => {
                setSpeaking(false);
                cooldownRef.current = false;
            });
        } catch {
            cooldownRef.current = false;
        }
    }, []);

    const stop = useCallback(() => {
        stopSpeaking();
        setSpeaking(false);
        cooldownRef.current = false;
    }, []);

    return (
        <PennywiseVoiceContext.Provider value={{ speak, stop, speaking, lastLine }}>
            {children}
        </PennywiseVoiceContext.Provider>
    );
};

export const usePennywiseVoice = () => {
    const ctx = useContext(PennywiseVoiceContext);
    if (!ctx) throw new Error("usePennywiseVoice must be used within PennywiseVoiceProvider");
    return ctx;
};