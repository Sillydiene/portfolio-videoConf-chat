import { useEffect, useState } from "react";

export default function useViewport() {
    const [width, setWidth] = useState(() => window.innerWidth);

    useEffect(() => {
        const onResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    return {
        width,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
    };
}
