/**
 * بطاقة الصلاة الفردية
 */

import React from 'react';
import '../styles/PrayerCard.css';

function PrayerCard({ prayerName, time, icon, isNext }) {
  return (
    <div className={`prayer-card ${isNext ? 'next-prayer' : ''}`}>
      <div className="prayer-icon-large">{icon}</div>
      <h3 className="prayer-name">{prayerName}</h3>
      <p className="prayer-time-display">{time}</p>
      {isNext && <span className="next-badge">الصلاة القادمة</span>}
    </div>
  );
}

export default PrayerCard;
