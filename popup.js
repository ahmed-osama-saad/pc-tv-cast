document.getElementById('changeUserAgent').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeTab = tabs[0];
        chrome.runtime.sendMessage({action: "toggleUserAgent", tabId: activeTab.id}, function(response) {
            document.getElementById('status').textContent = 'Status: ' + (response ? 'On' : 'Off');
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    chrome.runtime.sendMessage({action: "getCurrentState"}, function(response) {
        if (response && response.isUserAgentSwitchedOn) {
            document.getElementById('status').textContent = 'Status: On';
        } else {
            document.getElementById('status').textContent = 'Status: Off';
        }
    });
});