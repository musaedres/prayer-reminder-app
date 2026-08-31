/**
 * مكون التطبيق الرئيسي
 */

import React, { useState, useEffect } from 'react';
import './styles/App.css';
import PrayerTimes from './components/PrayerTimes';
import Header from './components/Header';
import Settings from './components/Settings';
import Statistics from './components/Statistics';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [prayerData, setPrayerData] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    // الحصول على موقع المستخدم
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('خطأ في الحصول على الموقع:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    // تطبيق الوضع المظلم
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark-mode');
    } else {
      html.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  return (
    <div className="app-container">
      <Header 
        onPageChange={setCurrentPage}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />
      
      <main className="app-main">
        {currentPage === 'home' && (
          <PrayerTimes location={location} />
        )}
        {currentPage === 'statistics' && (
          <Statistics />
        )}
        {currentPage === 'settings' && (
          <Settings />
        )}
      </main>
    </div>
  );
}

export default App;
