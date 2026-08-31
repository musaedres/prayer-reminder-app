/**
 * خدمة حساب أوقات الصلاة
 */

import axios from 'axios';

/**
 * حساب أوقات الصلاة بناءً على الموقع الجغرافي
 * @param {number} latitude - خط العرض
 * @param {number} longitude - خط الطول
 * @returns {Promise<Object>} أوقات الصلاة
 */
export const calculatePrayerTimes = async (latitude, longitude) => {
  try {
    // استخدام API Aladhan للحصول على أوقات الصلاة
    const today = new Date();
    const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
    
    const response = await axios.get(
      `https://api.aladhan.com/v1/timings/${dateStr}`,
      {
        params: {
          latitude: latitude,
          longitude: longitude,
          method: 5 // الطريقة المصرية
        }
      }
    );

    const timings = response.data.data.timings;
    
    return {
      fajr: timings.Fajr.split(' ')[0],
      dhuhr: timings.Dhuhr.split(' ')[0],
      asr: timings.Asr.split(' ')[0],
      maghrib: timings.Maghrib.split(' ')[0],
      isha: timings.Isha.split(' ')[0]
    };
  } catch (error) {
    console.error('خطأ في حساب أوقات الصلاة:', error);
    return getDefaultTimes();
  }
};

/**
 * الحصول على أوقات افتراضية في حالة الخطأ
 */
const getDefaultTimes = () => {
  return {
    fajr: '05:30',
    dhuhr: '12:30',
    asr: '15:45',
    maghrib: '18:15',
    isha: '19:45'
  };
};

/**
 * إرسال تنبيه للصلاة
 * @param {string} prayerName - اسم الصلاة
 */
export const sendNotification = (prayerName) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(`حان وقت ${prayerName}`, {
      icon: '🕌',
      body: 'قم بالوضوء والصلاة',
      tag: 'prayer-notification',
      requireInteraction: true
    });
  }
};

/**
 * طلب إذن التنبيهات من المستخدم
 */
export const requestNotificationPermission = async () => {
  if ('Notification' in window && Notification.permission === 'default') {
    await Notification.requestPermission();
  }
};
