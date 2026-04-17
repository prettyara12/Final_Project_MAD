import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function SessionScreen() {
  const router = useRouter();

  const handleEndCall = () => {
    // Hang up and return to Home or Review screen
    console.log("Ending session...");
    router.push('/HomeScreen' as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <View style={styles.avatarMini}>
            <Ionicons name="person" size={16} color="#FFF" />
          </View>
          <Text style={styles.headerLogoText}>EduPartner AI</Text>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.timerPill}>
            <Ionicons name="stopwatch" size={14} color="#E11D48" />
            <Text style={styles.timerText}>42:18</Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons name="notifications" size={20} color="#4F46E5" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Interactive Whiteboard */}
        <View style={styles.whiteboardCard}>
           {/* Whiteboard Header */}
           <View style={styles.wbHeader}>
              <View style={styles.wbTitleRow}>
                <Ionicons name="pulse" size={20} color="#4F46E5" style={{marginRight: 8}} />
                <Text style={styles.wbTitle}>Papan Tulis{'\n'}Interaktif</Text>
              </View>
              <View style={styles.wbToolsRow}>
                 <TouchableOpacity style={styles.wbToolBtn}>
                   <Ionicons name="pencil" size={16} color="#4B5563" />
                 </TouchableOpacity>
                 <TouchableOpacity style={styles.wbToolBtn}>
                   <Ionicons name="chatbubble" size={16} color="#4B5563" />
                 </TouchableOpacity>
                 <TouchableOpacity style={styles.wbToolBtn}>
                   <Ionicons name="trash" size={16} color="#4B5563" />
                 </TouchableOpacity>
              </View>
           </View>

           {/* Whiteboard Canvas Mock */}
           <View style={styles.wbCanvas}>
              {/* Fake mindmap/diagram using icons */}
              <View style={styles.diagramMock}>
                 <Ionicons name="git-network-outline" size={120} color="#0EA5E9" style={{ opacity: 0.6 }} />
                 <View style={styles.diagramCenterBadge}>
                    <Text style={styles.diagramCenterText}>SAFE{'\n'}NETWORK</Text>
                 </View>
              </View>
              
              <Text style={styles.wbCaption}>
                 Papan Tulis Bersama: Diagram Mekanika Kuantum Kolaboratif
              </Text>
           </View>
        </View>

        {/* Video Feeds Section */}
        <View style={styles.videosContainer}>
           <View style={[styles.videoBox, { backgroundColor: '#111827' }]}>
               {/* Tutor Video Mock */}
               <Ionicons name="person" size={80} color="#374151" />
               <View style={styles.videoActiveIndicator} />
           </View>
           
           <View style={[styles.videoBox, { backgroundColor: '#A7F3D0' }]}>
               {/* Student Video Mock */}
               <Ionicons name="happy" size={80} color="#059669" />
           </View>
        </View>

      </ScrollView>

      {/* Floating Call Controls */}
      <View style={styles.callControlsContainer}>
         <View style={styles.callControlsPill}>
            <TouchableOpacity style={styles.controlBtn}>
               <Ionicons name="mic" size={24} color="#111827" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlBtn}>
               <Ionicons name="videocam" size={24} color="#111827" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlBtn}>
               <Ionicons name="copy" size={22} color="#111827" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.endCallBtn} onPress={handleEndCall}>
               <Ionicons name="call" size={22} color="#FFFFFF" style={{ transform: [{ rotate: '135deg' }] }} />
            </TouchableOpacity>
         </View>
      </View>

      {/* Mock Bottom Tab Bar */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="home-outline" size={24} color="#9CA3AF" />
          <Text style={styles.tabLabel}>Beranda</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="search-outline" size={24} color="#9CA3AF" />
          <Text style={styles.tabLabel}>Cari</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <View style={styles.activeTabIconWrap}>
            <Ionicons name="book" size={20} color="#4F46E5" />
          </View>
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>Sesi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="chatbubbles-outline" size={24} color="#9CA3AF" />
          <Text style={styles.tabLabel}>Chat AI</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="person-outline" size={24} color="#9CA3AF" />
          <Text style={styles.tabLabel}>Profil</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFC', 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
    padding: 4,
  },
  avatarMini: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerLogoText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4F46E5',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE4E6', // light red/pink
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 12,
  },
  timerText: {
    color: '#E11D48',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
  notificationBtn: {
    padding: 4,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 160, // space for floating bar + tab bar
  },
  whiteboardCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    overflow: 'hidden',
  },
  wbHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F3F4F6', // light gray top part
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  wbTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wbTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  wbToolsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  wbToolBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  wbCanvas: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // We can't easily do a dot pattern without a background image, so white is fine
    // Dot pattern approximation using border
    borderStyle: 'dashed',
    borderColor: '#F3F4F6',
    borderWidth: 1,
    margin: 10,
    borderRadius: 24,
  },
  diagramMock: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 24,
  },
  diagramCenterBadge: {
    position: 'absolute',
    backgroundColor: '#E0F2FE', // light blue
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#7DD3FC',
  },
  diagramCenterText: {
    color: '#0284C7',
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
  },
  wbCaption: {
    fontSize: 13,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
  videosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  videoBox: {
    flex: 1,
    height: 180,
    borderRadius: 32,
    justifyContent: 'flex-end', // so we can put icons or names
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    paddingBottom: 20,
  },
  videoActiveIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4F46E5', // active speaker dot
  },
  callControlsContainer: {
    position: 'absolute',
    bottom: 96, // just above the bottom tab bar (80 + 16)
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  callControlsPill: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 36,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    gap: 20,
  },
  controlBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  endCallBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E11D48',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomTabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  tabItem: {
    alignItems: 'center',
    flex: 1,
  },
  activeTabIconWrap: {
    backgroundColor: '#EBE2FF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4,
  },
  tabLabelActive: {
    color: '#4F46E5',
    fontWeight: '700',
    marginTop: 0,
  }
});
