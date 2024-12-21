import { useState, useEffect } from 'react';

export const useScreenType = (): 'desktop' | 'mobile' => {
    const [screenType, setScreenType] = useState<'desktop' | 'mobile'>(
        window.innerWidth > 768 ? 'desktop' : 'mobile'
    );

    useEffect(() => {
        const handleResize = () => {
            setScreenType(window.innerWidth > 768 ? 'desktop' : 'mobile');
        };

        window.addEventListener('resize', handleResize);

        // Cleanup event listener on unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return screenType;
};