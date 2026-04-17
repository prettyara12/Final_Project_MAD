import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RatingStars } from './RatingStars';

interface TutorCardProps {
  id?: string;
  name: string;
  subject: string;
  rating?: number;
  reviews?: number;
  availability?: string;
  isAIRecommended?: boolean;
  onPress?: () => void;
  horizontal?: boolean;
}

export const TutorCard: React.FC<TutorCardProps> = ({
  name,
  subject,
  rating = 4.8,
  reviews = 100,
  availability,
  isAIRecommended = false,
  onPress,
  horizontal = false
}) => {
  return (
    <TouchableOpacity 
      style={[styles.card, horizontal ? styles.cardHorizontal : styles.cardVertical]} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        {/* Placeholder for tutor image */}
        <View style={styles.mockImage}>
           <Ionicons name="person" size={horizontal ? 32 : 48} color="#FFF" />
        </View>
        {isAIRecommended && (
          <View style={styles.aiBadge}>
            <Ionicons name="sparkles" size={10} color="#9333EA" />
            <Text style={styles.aiBadgeText}>Cocok (AI)</Text>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <Text style={styles.subject} numberOfLines={1}>{subject}</Text>
        
        <View style={styles.ratingRow}>
          <RatingStars rating={rating} showText={false} />
          <Text style={styles.reviewText}>({reviews})</Text>
        </View>

        {availability && (
          <View style={styles.availRow}>
            <Ionicons name="time-outline" size={12} color="#10B981" />
            <Text style={styles.availText}>{availability}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHorizontal: {
    width: 200,
    marginRight: 16,
  },
  cardVertical: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
    padding: 12,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  mockImage: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#1E293B', // dark slate
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiBadge: {
    position: 'absolute',
    bottom: -10,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  aiBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#9333EA',
    marginLeft: 2,
  },
  infoContainer: {
    flex: 1,
    marginTop: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 2,
  },
  subject: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  reviewText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  availRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#10B981', // green
    marginLeft: 4,
  }
});
