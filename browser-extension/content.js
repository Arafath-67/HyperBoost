// 1. Listen for messages from Background Script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    
    if (request.action === "CHECK_SUBSCRIPTION") {
        const platform = request.platform;
        let isSubscribed = false;

        // === YOUTUBE LOGIC ===
        if (platform === 'youtube') {
            // ইউটিউবের সাবস্ক্রাইব বাটন খোঁজা
            const subBtn = document.querySelector("#subscribe-button button, .ytd-subscribe-button-renderer");
            
            if (subBtn) {
                // বাটন টেক্সট বা অ্যাট্রিবিউট চেক করা
                const text = subBtn.innerText || subBtn.textContent;
                // যদি "Subscribed" লেখা থাকে
                if (text.includes("Subscribed") || subBtn.hasAttribute("subscribed")) {
                    isSubscribed = true;
                }
            }
        }

        // === FACEBOOK LOGIC ===
        if (platform === 'facebook') {
            // ফেসবুকের লাইক/ফলো বাটন খোঁজা (aria-label বা text দিয়ে)
            const followBtn = document.querySelector("[aria-label='Liked']"); // বা 'Following'
            if (followBtn) {
                isSubscribed = true;
            }
        }

        // === RESULT SEND BACK ===
        sendResponse({ status: isSubscribed });
    }
    return true;
});