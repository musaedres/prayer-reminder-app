/**
 * مكون رأس التطبيق
 */

import React from 'react';
import '../styles/Header.css';

function Header({ onPageChange, isDarkMode, onToggleDarkMode }) {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo-section">
          <h1 className="app-title">🕌 تذكير الصلاة</h1>
          <p className="app-subtitle">حافظ على أوقات صلاتك</p>
        </div>
        
        <nav className="header-nav">
          <button 
            className="nav-button active"
            onClick={() => onPageChange('home')}
          >
            🏠 الرئيسية
          </button>
          <button 
            className="nav-button"
            onClick={() => onPageChange('statistics')}
          >
            📊 الإحصائيات
          </button>
          <button 
            className="nav-button"
            onClick={() => onPageChange('settings')}
          >
            ⚙️ الإعدادات
          </button>
        </nav>
        
        <button 
          className="theme-toggle"
          onClick={onToggleDarkMode}
          title={isDarkMode ? 'الوضع الفاتح' : 'الوضع المظلم'}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}

export default Header;
