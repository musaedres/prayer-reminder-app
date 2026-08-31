import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function StatisticsScreen({ colors, isDarkMode }) {
  const [stats, setStats] = useState({
    totalPrayers: 0,
    currentStreak: 0,
    weeklyCount: 0,
    monthlyCount: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const savedStats = await AsyncStorage.getItem('prayerStats');
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
    } catch (error) {
      console.error('خطأ في تحميل الإحصائيات:', error);
    }
  };

  const StatCard = ({ icon, title, value }) => (
    <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.statValue, { color: colors.primary }]}>{value}</Text>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.primary }]}>📊 إحصائيات الصلاة</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard icon="🕌" title="إجمالي الصلوات" value={stats.totalPrayers} />
        <StatCard icon="🔥" title="سلسلة مستمرة" value={`${stats.currentStreak} أيام`} />
        <StatCard icon="📅" title="هذا الأسبوع" value={stats.weeklyCount} />
        <StatCard icon="📆" title="هذا الشهر" value={stats.monthlyCount} />
      </View>

      <View style={[styles.motivationSection, { backgroundColor: colors.primary }]}>
        <Text style={styles.motivationEmoji}>💪</Text>
        <Text style={styles.motivationTitle}>رسالة تحفيز</Text>
        <Text style={styles.motivationText}>
          استمر في المحافظة على صلاتك، فالصلاة عماد الدين! كل صلاة تؤديها هي خطوة نحو طريق الرحمة.
        </Text>
      </View>

      <View style={[styles.chartContainer, { backgroundColor: colors.surface }]}>
        <Text style={[styles.chartTitle, { color: colors.text }]}>📈 الأسبوع الماضي</Text>
        <View style={styles.weekChart}>
          {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map(
            (day, index) => (
              <View key={index} style={styles.dayChart}>
                <View
                  style={[
                    styles.dayBar,
                    {
                      height: Math.random() * 100 + 20,
                      backgroundColor: colors.primary,
                    },
                  ]}
                />
                <Text style={[styles.dayLabel, { color: colors.text }]}>{day.slice(0, 2)}</Text>
              </View>
            )
          )}
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
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statsGrid: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  motivationSection: {
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 12,
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  motivationEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  motivationTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  motivationText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  chartContainer: {
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  weekChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 150,
  },
  dayChart: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  dayBar: {
    width: '80%',
    borderRadius: 6,
    marginBottom: 10,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});

export default StatisticsScreen;