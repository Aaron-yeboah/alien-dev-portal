import { createRoot } from "react-dom/client";
import { Component, ReactNode } from "react";
import App from "./App.tsx";
import "./index.css";

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error?: Error }> {
    constructor(props: { children: ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{ background: "#050c05", color: "#39ff14", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "monospace", padding: "2rem" }}>
                    <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚠ SYSTEM ERROR</h1>
                    <p style={{ color: "#aaa", marginBottom: "1rem" }}>A critical error occurred during initialization.</p>
                    <pre style={{ background: "#0a1a0a", padding: "1rem", borderRadius: "8px", color: "#ff6b6b", maxWidth: "600px", overflow: "auto", fontSize: "0.75rem" }}>
                        {this.state.error?.message}
                    </pre>
                    <button onClick={() => window.location.reload()} style={{ marginTop: "1.5rem", padding: "0.75rem 2rem", background: "#39ff14", color: "#050c05", border: "none", cursor: "pointer", fontFamily: "monospace", fontWeight: "bold", borderRadius: "4px" }}>
                        REBOOT SYSTEM
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

createRoot(document.getElementById("root")!).render(
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
);

