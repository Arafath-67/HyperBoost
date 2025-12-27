'use client';
import { useState, useEffect } from 'react';

const AdBlockTrap = () => {
    const [isBlocked, setIsBlocked] = useState(false);

    useEffect(() => {
        const checkTrap = () => {
            // ১. Iframe ফাঁদ (PC তে খুব কার্যকর)
            const iframeBait = document.createElement('iframe');
            iframeBait.style.height = '1px';
            iframeBait.style.width = '1px';
            iframeBait.style.position = 'absolute';
            iframeBait.style.top = '-10000px';
            iframeBait.style.left = '-10000px';
            iframeBait.id = 'google_ads_frame'; 
            
            // ২. Div ফাঁদ (ব্যাকআপ)
            const divBait = document.createElement('div');
            divBait.className = 'ad-banner pub_300x250 adsbox';
            divBait.style.height = '1px';
            divBait.style.width = '1px';
            divBait.style.position = 'absolute';
            divBait.style.top = '-10000px';
            divBait.style.left = '-10000px';

            document.body.appendChild(iframeBait);
            document.body.appendChild(divBait);

            setTimeout(() => {
                if (
                    iframeBait.offsetParent === null ||
                    iframeBait.offsetHeight === 0 ||
                    iframeBait.offsetLeft === 0 ||
                    window.getComputedStyle(iframeBait).display === 'none' ||
                    
                    divBait.offsetParent === null ||
                    divBait.offsetHeight === 0 ||
                    window.getComputedStyle(divBait).display === 'none'
                ) {
                    setIsBlocked(true); // লাইভ সার্ভারে এটা কাজ করবে
                }
                
                iframeBait.remove();
                divBait.remove();
            }, 500);
        };

        checkTrap();
    }, []);

    if (!isBlocked) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: '#0f0f13', zIndex: 9999999,
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            padding: '20px', textAlign: 'center'
        }}>
            <h1 style={{ color: '#ef4444', fontSize: '2.5rem', marginBottom: '20px' }}>🛑 AdBlock Detected!</h1>
            <p style={{ color: '#ccc', marginBottom: '30px' }}>Please disable AdBlock to continue.</p>
            <button 
                onClick={() => window.location.reload()}
                style={{
                    backgroundColor: '#6366f1', color: 'white', padding: '10px 25px',
                    borderRadius: '8px', border: 'none', cursor: 'pointer'
                }}
            >
                Reload 🔄
            </button>
        </div>
    );
};

export default AdBlockTrap;