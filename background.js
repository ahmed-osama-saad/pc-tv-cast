let targetTabId = null;
let isUserAgentSwitchedOn = false; // New variable to track the state
let currentState = { isUserAgentSwitchedOn: false, targetTabId: null };

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.action === "toggleUserAgent") {
        if (!isUserAgentSwitchedOn) {
            targetTabId = request.tabId ? request.tabId : sender.tab.id;
            isUserAgentSwitchedOn = true;
        } else {
            isUserAgentSwitchedOn = false;
            targetTabId = null;
        }
        currentState = { isUserAgentSwitchedOn, targetTabId };

    }
    if(request.action === "getCurrentState") {
        sendResponse(currentState);
    }
    sendResponse(isUserAgentSwitchedOn); // Send the current state back to the popup

});

chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
        if (isUserAgentSwitchedOn && targetTabId !== null && details.tabId === targetTabId) {
            // Your user agent modification logic
            for (var i = 0; i < details.requestHeaders.length; ++i) {
                if (details.requestHeaders[i].name === 'User-Agent') {
                    details.requestHeaders[i].value = 'Mozilla/5.0 (CrKey armv7l 1.10.41117) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.0 Safari/537.36';
                    break;
                }
            }
        }
        return { requestHeaders: details.requestHeaders };
    },
    {urls: ["<all_urls>"]},
    ["blocking", "requestHeaders"]
);
