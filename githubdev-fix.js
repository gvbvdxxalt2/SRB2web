/*
Fix for Webpack Dev Server's hot reload not
  working on Github Codespaces due to WebSocket connection issues.
This script overrides the WebSocket constructor to modify
  the URL for the hot reload connection, ensuring it works
  correctly in the Codespace environment.
*/

(function () {
    var githubDevName = ".app.github.dev";
    var githubDevNameDash = "-";
    var isGithubDev = (window.location.hostname.indexOf(githubDevName) > -1);
    if (!isGithubDev) return;
    

    var OriginalWebsocket = window.WebSocket;
    class WebSocket extends OriginalWebsocket {
        constructor(url, protocols) {
            var newURL = new URL(url);
            
            var targetPort = newURL.port;
            newURL.port = "";

            var devHostname = newURL.hostname.split(githubDevName)[0];
            var devParts = devHostname.split(githubDevNameDash);

            devParts.pop();
            devParts.push(targetPort);
            newURL.hostname = devParts.join(githubDevNameDash) + githubDevName;

            url = newURL.href;
            super(url, protocols);
        }
    }

    window.WebSocket = WebSocket;
})();