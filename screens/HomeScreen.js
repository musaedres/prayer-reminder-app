import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Notifications from 'expo-notifications';
import { calculatePrayerTimes } from '../services/prayerService';

const PRAYER_NAMES = {
  fajr: 'الفجر',
  dhuhr: 'الظهر',
  asr: 'العصر',
  maghrib: 'المغرب',
  isha: 'العشاء',
};

const PRAYER_ICONS = {
  fajr: '🌅',
  dhuhr: '☀️',
  asr: '⛅',
  maghrib: '🌅',
  isha: '🌙',
};

function HomeScreen({ location, colors, isDarkMode, setIsDarkMode }) {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeUntilNext, setTimeUntilNext] = useState('');

  useEffect(() => {
    if (location) {
      fetchPrayerTimes();
    }
  }, [location]);

  useEffect(() => {
    if (prayerTimes) {
      updateNextPrayer();
      const interval = setInterval(updateNextPrayer, 10000); // تحديث كل 10 ثواني
      return () => clearInterval(interval);
    }
  }, [prayerTimes]);

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
      Alert.alert('خطأ', 'فشل تحميل أوقات الصلاة');
    }
  };

  const updateNextPrayer = () => {
    if (prayerTimes) {
      const now = new Date();
      const prayerOrder = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

      for (let prayer of prayerOrder) {
        const [hours, minutes] = prayerTimes[prayer].split(':');
        const prayerTime = new Date();
        prayerTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        if (prayerTime > now) {
          setNextPrayer({
            name: PRAYER_NAMES[prayer],
            time: prayerTimes[prayer],
            key: prayer,
          });
          calculateTimeUntil(prayerTime);
          return;
        }
      }

      // إذا لم توجد صلاة اليوم، الفجر غداً
      setNextPrayer({
        name: PRAYER_NAMES['fajr'],
        time: prayerTimes['fajr'],
        key: 'fajr',
      });
    }
  };

  const calculateTimeUntil = (targetTime) => {
    const now = new Date();
    const diff = targetTime - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    setTimeUntilNext(`${hours}س ${minutes}د`);
  };

  const handleEnableNotifications = async (prayerKey, prayerName, prayerTime) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `🕌 حان وقت ${prayerName}`,
          body: `الوقت: ${prayerTime}`,
          sound: true,
          badge: 1,
        },
        trigger: {
          type: 'daily',
          hour: parseInt(prayerTime.split(':')[0]),
          minute: parseInt(prayerTime.split(':')[1]),
        },
      });
      Alert.alert('نجح', `تم تفعيل التنبيه لصلاة ${prayerName}`);
    } catch (error) {
      Alert.alert('خطأ', 'فشل تفعيل التنبيه');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          جاري تحميل أوقات الصلاة...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* رأس التطبيق */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.primary }]}>🕌 تذكير الصلاة</Text>
          <Text style={[styles.headerSubtitle, { color: colors.text }]}>حافظ على أوقات صلاتك</Text>
        </View>
        <TouchableOpacity
          style={styles.themeToggle}
          onPress={() => setIsDarkMode(!isDarkMode)}
        >
          <Text style={styles.themeIcon}>{isDarkMode ? '☀️' : '🌙'}</Text>
        </TouchableOpacity>
      </View>

      {/* بطاقة الصلاة القادمة */}
      {nextPrayer && (
        <View
          style={[
            styles.nextPrayerCard,
            {
              backgroundColor: colors.primary,
              shadowColor: colors.primary,
            },
          ]}
        >
          <View style={styles.nextPrayerContent}>
            <Text style={styles.nextPrayerEmoji}>{PRAYER_ICONS[nextPrayer.key]}</Text>
            <View style={styles.nextPrayerInfo}>
              <Text style={styles.nextPrayerLabel}>الصلاة القادمة</Text>
              <Text style={styles.nextPrayerName}>{nextPrayer.name}</Text>
              <Text style={styles.nextPrayerTime}>{nextPrayer.time}</Text>
            </View>
            <View style={styles.timeRemaining}>
              <Text style={styles.timeRemainingLabel}>المتبقي</Text>
              <Text style={styles.timeRemainingValue}>{timeUntilNext}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() =>
              handleEnableNotifications(
                nextPrayer.key,
                nextPrayer.name,
                nextPrayer.time
              )
            }
          >
            <MaterialIcons name="notifications-active" size={24} color={colors.primary} />
            <Text style={[styles.notificationButtonText, { color: colors.primary }]}>
              تفعيل التنبيه
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* أوقات الصلوات اليوم */}
      <View style={styles.prayersSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>أوقات الصلوات اليوم</Text>
        <View style={styles.prayersGrid}>
          {prayerTimes &&
            Object.entries(PRAYER_NAMES).map(([key, name]) => (
              <View
                key={key}
                style={[
                  styles.prayerCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: nextPrayer?.key === key ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text style={styles.prayerIcon}>{PRAYER_ICONS[key]}</Text>
                <Text style={[styles.prayerName, { color: colors.text }]}>{name}</Text>
                <Text style={[styles.prayerTime, { color: colors.primary }]}>
                  {prayerTimes[key]}
                </Text>
                {nextPrayer?.key === key && (
                  <View
                    style={[
                      styles.nextBadge,
                      { backgroundColor: colors.primary },
                    ]}
                  >
                    <Text style={styles.nextBadgeText}>القادمة</Text>
                  </View>
                )}
              </View>
            ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  themeToggle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeIcon: {
    fontSize: 24,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  nextPrayerCard: {
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 15,
    padding: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nextPrayerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  nextPrayerEmoji: {
    fontSize: 40,
    marginRight: 15,
  },
  nextPrayerInfo: {
    flex: 1,
  },
  nextPrayerLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  nextPrayerName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  nextPrayerTime: {
    fontSize: 16,
    color: 'white',
  },
  timeRemaining: {
    alignItems: 'flex-end',
  },
  timeRemainingLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  timeRemainingValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  notificationButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  notificationButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  prayersSection: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  prayersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  prayerCard: {
    width: '48%',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  prayerIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  prayerName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  prayerTime: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextBadge: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  nextBadgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default HomeScreen;