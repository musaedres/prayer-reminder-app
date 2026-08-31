/**
 * مكون الإحصائيات
 */

import React, { useState, useEffect } from 'react';
import '../styles/Statistics.css';

function Statistics() {
  const [stats, setStats] = useState({
    totalPrayers: 0,
    currentStreak: 0,
    weeklyCount: 0,
    monthlyCount: 0
  });

  useEffect(() => {
    // تحميل الإحصائيات من التخزين المحلي
    const savedStats = localStorage.getItem('prayerStats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  return (
    <div className="statistics-container">
      <h2>📊 إحصائيات الصلاة</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>إجمالي الصلوات</h3>
            <p className="stat-number">{stats.totalPrayers}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <h3>سلسلة مستمرة</h3>
            <p className="stat-number">{stats.currentStreak} أيام</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>هذا الأسبوع</h3>
            <p className="stat-number">{stats.weeklyCount}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📆</div>
          <div className="stat-content">
            <h3>هذا الشهر</h3>
            <p className="stat-number">{stats.monthlyCount}</p>
          </div>
        </div>
      </div>

      <div className="motivation-section">
        <h3>💪 رسالة تحفيز</h3>
        <p>استمر في المحافظة على صلاتك، فالصلاة عماد الدين!</p>
      </div>
    </div>
  );
}

export default Statistics;
