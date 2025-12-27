// ওয়েবসাইট থেকে মেসেজ শোনা
chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
    
    if (request.type === "VERIFY_TASK") {
        
        // ১. যে ট্যাবে ভিডিও চলছে সেটা খোঁজো
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length === 0) {
                sendResponse({ success: false, message: "No active tab found" });
                return;
            }

            const activeTabId = tabs[0].id;

            // ২. ওই ট্যাবে স্পাই স্ক্রিপ্টকে বলো চেক করতে
            chrome.tabs.sendMessage(activeTabId, { 
                action: "CHECK_SUBSCRIPTION", 
                platform: request.platform 
            }, (response) => {
                
                if (chrome.runtime.lastError) {
                    sendResponse({ success: false, error: "Extension not ready on page" });
                } else if (response && response.status === true) {
                    sendResponse({ success: true, message: "Verified" });
                } else {
                    sendResponse({ success: false, message: "User did not subscribe" });
                }
            });
        });
        
        return true; // Async response এর জন্য
    }
});