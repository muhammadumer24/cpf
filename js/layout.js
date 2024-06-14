var url ="";
var hostUrl = "";
chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    url = tabs[0].url;
    var urlHost = new URL(url);
    hostUrl = urlHost.hostname;
});