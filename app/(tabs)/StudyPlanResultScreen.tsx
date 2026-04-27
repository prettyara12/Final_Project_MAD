import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';

export default function StudyPlanResultScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const params = useLocalSearchParams();

  let plan: any = null;
  try {
    if (params.planData) {
      plan = JSON.parse(params.planData as string);
    }
  } catch (e) {
    console.error("Failed to parse plan data");
  }

  const handleFindTutor = () => {
    // Navigate to TutorListScreen with the subject pre-filled if possible
    router.push({
      pathname: '/(tabs)/TutorListScreen' as any,
      params: { subject: params.subject }
    });
  };

  if (!plan || !plan.days) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text }}>Gagal memuat rencana belajar.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: colors.primary }}>Kembali</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
           <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Hasil Rencana</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.heroSection}>
          <Text style={[styles.heroTitle, { color: colors.text }]}>{plan.title || `Rencana Belajar: ${params.subject}`}</Text>
          <Text style={[styles.heroDesc, { color: colors.textSecondary }]}>{plan.overview || "Ikuti rencana terstruktur ini untuk mencapai tujuanmu."}</Text>
        </View>

        <View style={styles.timelineContainer}>
          {plan.days.map((day: any, index: number) => {
            const isLast = index === plan.days.length - 1;
            return (
              <View key={index} style={styles.timelineRow}>
                {/* Timeline Line & Dot */}
                <View style={styles.timelineIndicator}>
                  <View style={[styles.dot, { backgroundColor: colors.primary }]} />
                  {!isLast && <View style={[styles.line, { backgroundColor: colors.border }]} />}
                </View>

                {/* Content Card */}
                <View style={[styles.dayCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={styles.dayHeader}>
                    <Text style={[styles.dayLabel, { color: colors.primary }]}>HARI {day.dayNumber}</Text>
                    <View style={[styles.hoursBadge, { backgroundColor: colors.primaryLight }]}>
                      <Ionicons name="time-outline" size={12} color={colors.primary} style={{ marginRight: 4 }} />
                      <Text style={[styles.hoursText, { color: colors.primary }]}>{day.estimatedHours} Jam</Text>
                    </View>
                  </View>
                  <Text style={[styles.dayTitle, { color: colors.text }]}>{day.title}</Text>
                  
                  <View style={styles.topicsList}>
                    {day.topics && day.topics.map((topic: string, i: number) => (
                      <View key={i} style={styles.topicRow}>
                        <Ionicons name="checkmark-circle" size={16} color="#10B981" style={{ marginRight: 8 }} />
                        <Text style={[styles.topicText, { color: colors.textSecondary }]}>{topic}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            );
          })}
        </View>

      </ScrollView>

      {/* Bottom Sticky Action */}
      <View style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <TouchableOpacity 
          style={[styles.actionBtn, { backgroundColor: colors.primary }]}
          onPress={handleFindTutor}
        >
          <Ionicons name="search" size={20} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.actionBtnText}>Cari Tutor Untuk Materi Ini</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
    paddingBottom: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 120, // space for bottom bar
  },
  heroSection: {
    marginBottom: 32,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 12,
    lineHeight: 36,
  },
  heroDesc: {
    fontSize: 14,
    lineHeight: 22,
  },
  timelineContainer: {
    marginLeft: 8,
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineIndicator: {
    width: 24,
    alignItems: 'center',
    marginRight: 16,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginTop: 4,
    zIndex: 2,
    borderWidth: 3,
    borderColor: '#EEF2FF',
  },
  line: {
    width: 2,
    flex: 1,
    marginTop: -4,
    marginBottom: -24, // connects to next dot
    zIndex: 1,
  },
  dayCard: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  hoursBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  hoursText: {
    fontSize: 10,
    fontWeight: '800',
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 16,
  },
  topicsList: {
    gap: 12,
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  topicText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    borderTopWidth: 1,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 24,
  },
  actionBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  }
});
