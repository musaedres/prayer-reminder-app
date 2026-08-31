/**
 * مكون الإعدادات
 */

import React, { useState } from 'react';
import '../styles/Settings.css';

function Settings() {
  const [settings, setSettings] = useState({
    notificationsEnabled: true,
    notificationTime: 5, // دقائق قبل الصلاة
    soundEnabled: true,
    vibrationEnabled: true,
    calculationMethod: 'egyptian'
  });

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('prayerSettings', JSON.stringify(newSettings));
  };

  return (
    <div className="settings-container">
      <h2>⚙️ الإعدادات</h2>
      
      <div className="settings-section">
        <h3>🔔 التنبيهات</h3>
        
        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={settings.notificationsEnabled}
              onChange={(e) => handleSettingChange('notificationsEnabled', e.target.checked)}
            />
            تفعيل التنبيهات
          </label>
        </div>

        <div className="setting-item">
          <label>تنبيه قبل الصلاة بـ:</label>
          <select
            value={settings.notificationTime}
            onChange={(e) => handleSettingChange('notificationTime', parseInt(e.target.value))}
          >
            <option value={1}>دقيقة واحدة</option>
            <option value={5}>5 دقائق</option>
            <option value={10}>10 دقائق</option>
            <option value={15}>15 دقيقة</option>
            <option value={30}>30 دقيقة</option>
          </select>
        </div>

        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
            />
            تفعيل الصوت
          </label>
        </div>

        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={settings.vibrationEnabled}
              onChange={(e) => handleSettingChange('vibrationEnabled', e.target.checked)}
            />
            تفعيل الاهتزاز
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h3>📐 طريقة الحساب</h3>
        
        <div className="setting-item">
          <select
            value={settings.calculationMethod}
            onChange={(e) => handleSettingChange('calculationMethod', e.target.value)}
          >
            <option value="egyptian">الطريقة المصرية</option>
            <option value="saudi">الطريقة السعودية</option>
            <option value="kuwaiti">الطريقة الكويتية</option>
            <option value="uae">طريقة الإمارات</option>
            <option value="moroccan">الطريقة المغربية</option>
          </select>
        </div>
      </div>

      <div className="settings-section">
        <h3>💾 البيانات</h3>
        <button className="settings-button danger">حذف جميع البيانات</button>
        <button className="settings-button">تصدير البيانات</button>
      </div>
    </div>
  );
}

export default Settings;
