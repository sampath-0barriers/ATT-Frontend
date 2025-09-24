import React, { Suspense, useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Themeroutes from './routes/Router';
import ThemeSelector from './layouts/theme/ThemeSelector';
import Loader from './layouts/loader/Loader';

const App = () => {
  const routing = useRoutes(Themeroutes);
  const direction = useSelector((state) => state.customizer.isRTL);
  const isMode = useSelector((state) => state.customizer.isDark);
  const isSoundOn = useSelector((state) => state.customizer.isSoundOn);

  // Global sound effect on click for all components
  useEffect(() => {
    // Load the click sound
    // or use https://soundjay.com/buttons/button-28.wav
    const clickSound = new Audio("/sounds/click_sound1.wav");
    // Function to play the sound
    const handleClick = () => {
      clickSound.play().catch((error) => {
        console.error("Error playing sound:", error);
      });
    };
    if (isSoundOn) {
      console.log("Sound is on");
      // set the volume
      clickSound.volume = 0.5;
      // Attach the event listener to the document
      document.addEventListener("click", handleClick);
    }
    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [isSoundOn]);

  return (
    <Suspense fallback={<Loader />}>
      <div
        className={`${direction ? 'rtl' : 'ltr'} ${isMode ? 'dark' : ''}`}
        dir={direction ? 'rtl' : 'ltr'}
      >
        <ThemeSelector />
        {routing}
      </div>
    </Suspense>
  );
};

export default App;
