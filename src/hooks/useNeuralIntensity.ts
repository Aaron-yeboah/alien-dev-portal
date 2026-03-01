import { useState, useEffect } from "react";
import { persistence } from "@/utils/persistence";

/**
 * Returns the BinaryRain intensity (0-100) from Supabase handles.neuralCores.
 * Falls back to `defaultIntensity` while loading or if the value is unavailable.
 */
export function useNeuralIntensity(defaultIntensity = 50): number {
    const [intensity, setIntensity] = useState<number>(defaultIntensity);

    useEffect(() => {
        let cancelled = false;

        const fetch = async () => {
            try {
                const handles = await persistence.getHandles();
                if (cancelled) return;
                if (handles?.neuralCores) {
                    const parsed = parseInt(handles.neuralCores);
                    if (!isNaN(parsed)) setIntensity(parsed);
                }
            } catch {
                // silently fall back to defaultIntensity
            }
        };
        fetch();

        // Subscribe to real-time updates from Supabase
        const sub = persistence.subscribeToHandles((payload) => {
            if (payload.new && payload.new.neuralCores) {
                const parsed = parseInt(payload.new.neuralCores);
                if (!isNaN(parsed)) setIntensity(parsed);
            }
        });

        return () => {
            cancelled = true;
            sub.unsubscribe();
        };
    }, []);

    return intensity;
}
