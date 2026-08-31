import axios from 'axios';

/**
 * حساب أوقات الصلاة بناءً على الموقع الجغرافي
 * @param {number} latitude - خط العرض
 * @param {number} longitude - خط الطول
 * @returns {Promise<Object>} أوقات الصلاة
 */
export const calculatePrayerTimes = async (latitude, longitude) => {
  try {
    const today = new Date();
    const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

    const response = await axios.get(
      `https://api.aladhan.com/v1/timings/${dateStr}`,
      {
        params: {
          latitude: latitude,
          longitude: longitude,
          method: 5, // الطريقة المصرية
        },
      }
    );

    const timings = response.data.data.timings;

    return {
      fajr: timings.Fajr.split(' ')[0],
      dhuhr: timings.Dhuhr.split(' ')[0],
      asr: timings.Asr.split(' ')[0],
      maghrib: timings.Maghrib.split(' ')[0],
      isha: timings.Isha.split(' ')[0],
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
    isha: '19:45',
  };
};

/**
 * إرسال تنبيه للصلاة
 * @param {string} prayerName - اسم الصلاة
 * @param {string} prayerTime - وقت الصلاة
 */
export const sendNotification = async (prayerName, prayerTime) => {
  try {
    const * Notifications from 'expo-notifications';
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `🕌 حان وقت ${prayerName}`,
        body: `الوقت: ${prayerTime}`,
        sound: true,
        badge: 1,
      },
      trigger: null,
    });
  } catch (error) {
    console.error('خطأ في إرسال التنبيه:', error);
  }
};
