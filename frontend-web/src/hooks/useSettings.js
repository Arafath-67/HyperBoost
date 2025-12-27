import { useState, useEffect } from 'react';

const useSettings = () => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // আপনার ব্যাকএন্ডের সঠিক পোর্ট দিন (যেমন: 5000)
                const res = await fetch('http://localhost:5000/api/settings');
                const data = await res.json();
                if (data.success) {
                    setSettings(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch settings');
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    return { settings, loading };
};

export default useSettings;