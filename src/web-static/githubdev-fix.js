/*(function () {
    const GITHUB_DEV = ".app.github.dev";
    if (!window.location.hostname.includes(GITHUB_DEV)) return;

    const OriginalWebSocket = window.WebSocket;

    window.WebSocket = class extends OriginalWebSocket {
        constructor(url, protocols) {
            let finalUrl = url;

            try {
                const parsed = new URL(url);
                
                // 1. Identify if this is a local HMR request or a Codespace-hosted service
                const isLocal = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
                const isCodespace = parsed.hostname.includes(GITHUB_DEV);

                if (isLocal || isCodespace) {
                    // 2. Extract the port. 
                    // If Webpack provided one in the URL string, use it. 
                    // Otherwise, fall back to the current window port.
                    const targetPort = parsed.port || window.location.port || "443";

                    // 3. Clean the hostname
                    // Remove any existing port suffix from the hostname (e.g., -9000)
                    let baseHostname = window.location.hostname.replace(/-\d+\.app\.github\.dev$/, "");
                    
                    // 4. Reconstruct: hostname becomes project-name-PORT.app.github.dev
                    parsed.hostname = `${baseHostname}-${targetPort}${GITHUB_DEV}`;
                    
                    // 5. CRITICAL: Codespaces proxies use standard 443 (HTTPS/WSS). 
                    // We MUST strip the :8080 or :9000 from the end of the URL.
                    parsed.port = ""; 
                    
                    // 6. Force Secure WebSockets
                    parsed.protocol = "wss:";

                    finalUrl = parsed.toString();
                }
            } catch (e) {
                console.warn("WebSocket Mangle Failed:", e);
            }

            super(finalUrl, protocols);
        }
    };
})();*/