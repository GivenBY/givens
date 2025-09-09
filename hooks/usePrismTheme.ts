import { useEffect, useState } from 'react';

export const usePrismTheme = (theme: string) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      setIsLoading(true);

      // Remove existing theme stylesheets
      const existingLinks = document.querySelectorAll('link[data-prism-theme]');
      existingLinks.forEach(link => link.remove());

      // Load new theme
      if (theme && theme !== 'default') {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `/themes/prism-${theme}.css`;
        link.setAttribute('data-prism-theme', theme);

        link.onload = () => setIsLoading(false);
        link.onerror = () => setIsLoading(false);

        document.head.appendChild(link);
      } else {
        // Use default theme or no theme
        setIsLoading(false);
      }
    };

    loadTheme();
  }, [theme]);

  return { isLoading };
};
