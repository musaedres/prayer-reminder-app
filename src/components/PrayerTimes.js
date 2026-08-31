/**
 * مكون أوقات الصلاة الرئيسي
 */

import React, { useState, useEffect } from 'react';
import '../styles/PrayerTimes.css';
import PrayerCard from './PrayerCard';
import { calculatePrayerTimes } from '../services/prayerService';

const PRAYER_NAMES = {
  fajr: 'الفجر',
  dhuhr: 'الظهر',
  asr: 'العصر',
  maghrib: 'المغرب',
  isha: 'العشاء'
};

function PrayerTimes({ location }) {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hijriDate, setHijriDate] = useState('');

  useEffect(() => {
    if (location) {
      fetchPrayerTimes();
      updateNextPrayer();
      const interval = setInterval(updateNextPrayer, 60000); // تحديث كل دقيقة
      return () => clearInterval(interval);
    }
  }, [location]);

  const fetchPrayerTimes = async () => {
    try {
      const times = await calculatePrayerTimes(
        location.latitude,
        location.longitude
      );
      setPrayerTimes(times);
      setLoading(false);
    } catch (error) {
      console.error('خطأ في جلب أوقات الصلاة:', error);
      setLoading(false);
    }
  };

  const updateNextPrayer = () => {
    if (prayerTimes) {
      // حساب الصلاة القادمة
      const now = new Date();
      const prayerOrder = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
      
      for (let prayer of prayerOrder) {
        const prayerTime = new Date(`${new Date().toISOString().split('T')[0]}T${prayerTimes[prayer]}`);
        if (prayerTime > now) {
          setNextPrayer({
            name: PRAYER_NAMES[prayer],
            time: prayerTimes[prayer],
            key: prayer
          });
          return;
        }
      }
      
      // إذا لم توجد صلاة اليوم، الفجر غداً
      setNextPrayer({
        name: PRAYER_NAMES['fajr'],
        time: prayerTimes['fajr'],
        key: 'fajr'
      });
    }
  };

  if (loading) {
    return <div className="prayer-container loading">جاري تحميل أوقات الصلاة...</div>;
  }

  return (
    <div className="prayer-container">
      {nextPrayer && (
        <div className="next-prayer-section">
          <h2>الصلاة القادمة</h2>
          <div className="next-prayer-card">
            <div className="prayer-icon">🕌</div>
            <div className="prayer-info">
              <h3>{nextPrayer.name}</h3>
              <p className="prayer-time">{nextPrayer.time}</p>
            </div>
            <button className="notification-btn">🔔 فعّل التنبيهات</button>
          </div>
        </div>
      )}

      <div className="all-prayers-section">
        <h2>أوقات الصلوات اليوم</h2>
        <div className="prayers-grid">
          {prayerTimes && Object.entries(PRAYER_NAMES).map(([key, name]) => (
            <PrayerCard
              key={key}
              prayerName={name}
              time={prayerTimes[key]}
              icon={['🌅', '☀️', '⛅', '🌆', '🌙'][Object.keys(PRAYER_NAMES).indexOf(key)]}
              isNext={nextPrayer?.key === key}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PrayerTimes;
