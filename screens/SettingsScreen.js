import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  Picker,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

function SettingsScreen({ colors, isDarkMode }) {
  const [settings, setSettings] = useState({
    notificationsEnabled: true,
    notificationTime: '5',
    soundEnabled: true,
    vibrationEnabled: true,
    calculationMethod: 'egyptian',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('prayerSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('خطأ في تحميل الإعدادات:', error);
    }
  };

  const handleSettingChange = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    try {
      await AsyncStorage.setItem('prayerSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('خطأ في حفظ الإعدادات:', error);
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'تأكيد حذف البيانات',
      'هل أنت متأكد من رغبتك في حذف جميع البيانات؟',
      [
        { text: 'إلغاء', onPress: () => {}, style: 'cancel' },
        {
          text: 'حذف',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('prayerStats');
              Alert.alert('نجح', 'تم حذف البيانات بنجاح');
            } catch (error) {
              Alert.alert('خطأ', 'فشل حذف البيانات');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const SettingItem = ({ icon, title, children }) => (
    <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
      <View style={styles.settingLabel}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
      </View>
      {children}
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.primary }]}>⚙️ الإعدادات</Text>
      </View>

      {/* قسم التنبيهات */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>🔔 التنبيهات</Text>

        <SettingItem icon="📢" title="تفعيل التنبيهات">
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={(value) =>
              handleSettingChange('notificationsEnabled', value)
            }
            trackColor={{ false: '#ccc', true: colors.primary }}
            thumbColor="white"
          />
        </SettingItem>

        <SettingItem icon="⏰" title="وقت التنبيه قبل الصلاة">
          <Picker
            selectedValue={settings.notificationTime}
            onValueChange={(value) => handleSettingChange('notificationTime', value)}
            style={[styles.picker, { color: colors.text }]}
          >
            <Picker.Item label="دقيقة واحدة" value="1" />
            <Picker.Item label="5 دقائق" value="5" />
            <Picker.Item label="10 دقائق" value="10" />
            <Picker.Item label="15 دقيقة" value="15" />
            <Picker.Item label="30 دقيقة" value="30" />
          </Picker>
        </SettingItem>

        <SettingItem icon="🔊" title="تفعيل الصوت">
          <Switch
            value={settings.soundEnabled}
            onValueChange={(value) => handleSettingChange('soundEnabled', value)}
            trackColor={{ false: '#ccc', true: colors.primary }}
            thumbColor="white"
          />
        </SettingItem>

        <SettingItem icon="📳" title="تفعيل الاهتزاز">
          <Switch
            value={settings.vibrationEnabled}
            onValueChange={(value) => handleSettingChange('vibrationEnabled', value)}
            trackColor={{ false: '#ccc', true: colors.primary }}
            thumbColor="white"
          />
        </SettingItem>
      </View>

      {/* قسم طريقة الحساب */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>📐 طريقة الحساب</Text>

        <SettingItem icon="🧮" title="طريقة حساب أوقات الصلاة">
          <Picker
            selectedValue={settings.calculationMethod}
            onValueChange={(value) => handleSettingChange('calculationMethod', value)}
            style={[styles.picker, { color: colors.text }]}
          >
            <Picker.Item label="الطريقة المصرية" value="egyptian" />
            <Picker.Item label="الطريقة السعودية" value="saudi" />
            <Picker.Item label="الطريقة الكويتية" value="kuwaiti" />
            <Picker.Item label="طريقة الإمارات" value="uae" />
            <Picker.Item label="الطريقة المغربية" value="moroccan" />
          </Picker>
        </SettingItem>
      </View>

      {/* قسم البيانات */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>💾 البيانات</Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleClearData}
        >
          <MaterialIcons name="delete-outline" size={20} color="white" />
          <Text style={styles.buttonText}>حذف جميع البيانات</Text>
        </TouchableOpacity>
      </View>

      {/* معلومات التطبيق */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>ℹ️ معلومات</Text>
        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { color: colors.text }]}>الإصدار</Text>
          <Text style={[styles.infoValue, { color: colors.primary }]}>1.0.0</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { color: colors.text }]}>المطور</Text>
          <Text style={[styles.infoValue, { color: colors.primary }]}>musaedres</Text>
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
  section: {
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  settingIcon: {
    fontSize: 18,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  picker: {
    width: 150,
    height: 40,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 15,
    marginVertical: 10,
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SettingsScreen;