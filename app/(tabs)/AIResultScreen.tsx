import React, { useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  Platform,
  ActivityIndicator,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { getTutorRecommendation } from '../../services/gemini';

const { width } = Dimensions.get('window');

export default function AIResultScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t, language } = useLanguage();
  const { subject, preferredTime, learningStyle, difficulty, notes } = useLocalSearchParams();

  const [aiRankings, setAiRankings] = React.useState<any[] | null>(null);
  const [isAiLoading, setIsAiLoading] = React.useState(true);

  const allTutors = useQuery(api.tutors.getRecommendedTutors, { 
    subject: (subject as string) || '',
    preferredTime: (preferredTime as string) || '',
    learningStyle: (learningStyle as string) || ''
  });

  // Reset state when search parameters change
  React.useEffect(() => {
    setAiRankings(null);
    setIsAiLoading(true);
  }, [subject, preferredTime, learningStyle, difficulty, notes]);

  React.useEffect(() => {
    if (allTutors && allTutors.length > 0 && isAiLoading) {
      const getAiRanking = async () => {
        try {
          const results = await getTutorRecommendation({
            subject: (subject as string) || "Umum",
            preferredTime: (preferredTime as string) || "Kapan saja",
            learningStyle: (learningStyle as string) || "Campuran",
            difficulty: (difficulty as string) || "Menengah",
            notes: (notes as string) || ""
          }, allTutors, language as any);

          if (results && Array.isArray(results)) {
            // Map AI rankings back to full tutor objects
            const rankedTutors = results.map((rank, index) => {
              const tutorData = allTutors.find(t => t._id === rank.tutorId);
              
              // Double check: Does this tutor actually teach the subject or have relevant bio/specialization?
              const subjectLower = (subject as string || "").toLowerCase();
              const teachesSubject = tutorData?.subjects?.some(s => s.toLowerCase().includes(subjectLower)) ||
                                   tutorData?.specialization?.toLowerCase().includes(subjectLower) ||
                                   tutorData?.bio?.toLowerCase().includes(subjectLower);

              if (!teachesSubject) return null; // Skip non-matching tutors if AI hallucinates

              return {
                ...tutorData,
                aiExplanation: rank.explanation,
                aiRank: rank.rank
              };
            }).filter(t => t !== null && t._id !== undefined);
            
            setAiRankings(rankedTutors);
          } else {
            setAiRankings(allTutors); // Fallback to algorithmic
          }
        } catch (e) {
          console.error("AI Ranking Error:", e);
          setAiRankings(allTutors);
        } finally {
          setIsAiLoading(false);
        }
      };
      getAiRanking();
    } else if (allTutors && allTutors.length === 0) {
      setIsAiLoading(false);
      setAiRankings([]);
    }
  }, [allTutors]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Ionicons 
        key={i} 
        name={i < Math.round(rating) ? "star" : "star-outline"} 
        size={12} 
        color={colors.primary} 
      />
    ));
  };

  if (isAiLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>{t('ai_analyzing_profiles')}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('ai_analysis_title')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.resultsInfo}>
          <View style={styles.aiBadgeRow}>
            <View style={[styles.aiBadge, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons name="sparkles" size={14} color={colors.primary} />
              <Text style={[styles.aiBadgeText, { color: colors.primary }]}>AI POWERED</Text>
            </View>
          </View>
          <Text style={[styles.resultsTitle, { color: colors.text }]}>{t('smart_recommendation')}</Text>
          <Text style={[styles.resultsSubtitle, { color: colors.textSecondary }]}>
            {t('ai_match_desc').replace('{style}', t(`opt_${(learningStyle as string || '').toLowerCase()}`) || (learningStyle as string))}
          </Text>
        </View>

        {aiRankings && aiRankings.length > 0 ? (
          aiRankings.map((tutor, index) => (
            <TouchableOpacity 
              key={tutor._id}
              style={[
                styles.tutorCard, 
                { backgroundColor: colors.surface, borderColor: colors.border },
                index === 0 && { borderColor: colors.primary, borderWidth: 2 }
              ]}
              onPress={() => router.push({ pathname: '/TutorProfileScreen', params: { id: tutor._id } } as any)}
            >
              {index === 0 && (
                <View style={[styles.bestMatchBadge, { backgroundColor: colors.primary }]}>
                  <Ionicons name="sparkles" size={10} color="#FFF" style={{ marginRight: 4 }} />
                  <Text style={styles.bestMatchText}>{t('ai_best_choice')}</Text>
                </View>
              )}

              <View style={styles.cardContent}>
                <View style={[styles.avatarBox, { backgroundColor: colors.avatarBg }]}>
                  {tutor.user?.profileImage ? (
                    <Image source={{ uri: tutor.user.profileImage }} style={styles.avatarImg} />
                  ) : (
                    <Ionicons name="person" size={24} color="#FFF" />
                  )}
                </View>

                <View style={styles.tutorInfo}>
                  <View style={styles.nameRow}>
                    <Text style={[styles.tutorName, { color: colors.text }]}>{tutor.user?.name || tutor.name}</Text>
                    <View style={[styles.matchPercentage, { backgroundColor: colors.successLight }]}>
                      <Text style={[styles.matchPercentageText, { color: colors.success }]}>
                        {t('top_match')}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={[styles.tutorSubject, { color: colors.textSecondary }]}>
                    {tutor.subjects?.join(', ') || 'Umum'}
                  </Text>

                  {/* AI INSIGHT */}
                  <View style={[styles.aiInsightBox, { backgroundColor: colors.surfaceHover }]}>
                    <Ionicons name="bulb-outline" size={14} color={colors.primary} />
                    <Text style={[styles.aiInsightText, { color: colors.textTertiary }]}>
                      {tutor.aiExplanation || t('ai_insight_default')}
                    </Text>
                  </View>

                  <View style={styles.ratingRow}>
                    {renderStars(tutor.rating)}
                    <Text style={[styles.ratingScore, { color: colors.text }]}>{tutor.rating?.toFixed(1)}</Text>
                  </View>
                </View>
              </View>

              <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
                <Text style={[styles.expText, { color: colors.textSecondary }]}>
                  <Ionicons name="time-outline" size={12} color={colors.textSecondary} /> 8th Exp
                </Text>
                <TouchableOpacity 
                  style={[styles.viewProfileBtn, { backgroundColor: colors.primary }]}
                  onPress={() => router.push({ pathname: '/TutorProfileScreen', params: { id: tutor._id } } as any)}
                >
                  <Text style={styles.viewProfileText}>{t('start_learning')}</Text>
                  <Ionicons name="chevron-forward" size={14} color="#FFF" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={64} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>{t('no_tutor_found')}</Text>
            <TouchableOpacity 
              style={[styles.retryButton, { borderColor: colors.primary }]}
              onPress={() => router.back()}
            >
              <Text style={[styles.retryText, { color: colors.primary }]}>{t('try_again')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
    paddingBottom: 16,
  },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  backButton: { padding: 4 },
  loadingText: { marginTop: 16, fontSize: 14, fontWeight: '600' },
  scrollContent: { padding: 20 },
  resultsInfo: { marginBottom: 24 },
  resultsTitle: { fontSize: 24, fontWeight: '900', marginBottom: 4 },
  resultsSubtitle: { fontSize: 14 },
  tutorCard: {
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  bestMatchBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomLeftRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bestMatchText: { color: '#FFF', fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  cardContent: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  avatarBox: { width: 64, height: 64, borderRadius: 20, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%' },
  tutorInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  tutorName: { fontSize: 17, fontWeight: '800', maxWidth: '65%' },
  matchPercentage: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  matchPercentageText: { fontSize: 10, fontWeight: '800' },
  tutorSubject: { fontSize: 13, marginBottom: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingScore: { fontSize: 12, fontWeight: '700' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1 },
  expText: { fontSize: 12, fontWeight: '600' },
  viewProfileBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, gap: 4 },
  viewProfileText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  aiBadgeRow: {
    marginBottom: 12,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 6,
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  aiInsightBox: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 16,
    gap: 10,
    marginBottom: 12,
  },
  aiInsightText: {
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
    flex: 1,
  },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyText: { marginTop: 16, fontSize: 16, fontWeight: '600', textAlign: 'center' },
  retryButton: { marginTop: 24, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 16, borderWidth: 1 },
  retryText: { fontWeight: '700' },
});
