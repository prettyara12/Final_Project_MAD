import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SubjectCardProps {
  title: string;
  desc: string;
  progress: number;
  badge: string;
  actionText: string;
  themeColor: string;
  icon: string;
  onPressMainAction?: () => void;
  onPressMore?: () => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({
  title,
  desc,
  progress,
  badge,
  actionText,
  themeColor,
  icon,
  onPressMainAction,
  onPressMore
}) => {
  return (
    <View style={styles.subjectCard}>
       <View style={styles.subHeaderRow}>
         <View style={[styles.subIconBox, { backgroundColor: themeColor + '15' }]}>
            <Ionicons name={icon as any} size={20} color={themeColor} />
         </View>
         <View style={styles.badgeBox}>
           <Text style={[styles.badgeText, { color: themeColor }]}>{badge}</Text>
         </View>
       </View>

       <Text style={styles.subTitle}>{title}</Text>
       <Text style={styles.subDesc}>{desc}</Text>

       <View style={styles.progressRow}>
         <Text style={styles.progressLabel}>Kemajuan</Text>
         <Text style={styles.progressLabel}>{progress}%</Text>
       </View>
       <View style={styles.progressBarBg}>
         <View style={[styles.progressBarFill, { width: `${progress}%`, backgroundColor: themeColor }]} />
       </View>

       <View style={styles.actionsRow}>
         <TouchableOpacity 
           style={[styles.mainActionBtn, { backgroundColor: themeColor }]}
           onPress={onPressMainAction}
         >
           <Text style={styles.mainActionText}>{actionText}</Text>
         </TouchableOpacity>
         <TouchableOpacity style={styles.moreActionBtn} onPress={onPressMore}>
           <Ionicons name="ellipsis-horizontal" size={20} color="#6B7280" />
         </TouchableOpacity>
       </View>
    </View>
  );
};

const styles = StyleSheet.create({
  subjectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  subHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  subIconBox: {
    width: 44,
    height: 44,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeBox: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  subDesc: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 20,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginBottom: 20,
  },
  progressBarFill: {
    height: 8,
    borderRadius: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mainActionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
  },
  mainActionText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  moreActionBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
