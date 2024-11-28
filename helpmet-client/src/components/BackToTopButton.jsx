import React, { useEffect, useState } from 'react';

const BackToTopButton = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    showButton && (
      <button
        onClick={handleBackToTop}
        className="fixed bottom-8 right-12 bg-[#6938EF] text-white p-2 rounded-full shadow-lg hover:bg-[#3E1C96]"
        aria-label="Back to top"
      >
        <img src="images/up-arrow.svg" alt="up arrow icon" />
      </button>
    )
  );
};

export default BackToTopButton;