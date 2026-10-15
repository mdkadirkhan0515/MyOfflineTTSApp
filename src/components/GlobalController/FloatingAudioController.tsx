/**
 * src/components/GlobalController/FloatingAudioController.tsx
 * Top Floating Circular Audio Controller
 * UX: Appears on TTS Start, Play/Pause Toggle, Auto-Dismiss on Finish
 */

import React from 'react';
import { View, Pressable, StyleSheet, useColorScheme, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PRIMARY_BLUE = '#2563EB';

type FloatingAudioControllerProps = {
  visible: boolean;
  isPlaying: boolean;
  onToggle: () => void; // Play/Pause toggle
};

const FloatingAudioController: React.FC<FloatingAudioControllerProps> = ({
  visible,
  isPlaying,
  onToggle,
}) => {
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';

  if (!visible) return null;

  const theme = {
    background: isDark ? '#1E293B' : '#FFFFFF',
    border: isDark ? '#334155' : '#E2E8F0',
    shadow: isDark ? '#000000' : '#64748B',
  };

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <Pressable
        onPress={onToggle}
        style={[
          styles.circle,
          {
            backgroundColor: theme.background,
            borderColor: theme.border,
            shadowColor: theme.shadow,
          },
        ]}
      >
        {/* Play/Pause State Management */}
        <Icon
          name={isPlaying ? 'pause' : 'play-arrow'}
          size={28}
          color={PRIMARY_BLUE}
          style={isPlaying ? styles.pauseIcon : styles.playIcon}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
    // Top floating position - safe area handled by parent SafeAreaView
  },
  circle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow for floating effect
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  playIcon: {
    marginLeft: 3, // Optical center for triangle
  },
  pauseIcon: {
    marginLeft: 0,
  },
});

export default FloatingAudioController;

