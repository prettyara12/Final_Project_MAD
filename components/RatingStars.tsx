import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RatingStarsProps {
  rating: number;
  maxStars?: number;
  size?: number;
  activeColor?: string;
  inactiveColor?: string;
  showText?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxStars = 5,
  size = 14,
  activeColor = '#FBBF24',
  inactiveColor = '#E5E7EB',
  showText = true
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.starsRow}>
        {[...Array(maxStars)].map((_, i) => (
          <Ionicons 
            key={i} 
            name={i < rating ? "star" : "star-outline"} 
            size={size} 
            color={i < rating ? activeColor : inactiveColor} 
            style={styles.starIcon}
          />
        ))}
      </View>
      {showText && (
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginRight: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 4,
  }
});
