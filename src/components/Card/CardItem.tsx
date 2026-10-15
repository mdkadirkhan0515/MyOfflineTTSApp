/**
 * src/components/Card/CardItem.tsx
 * Dynamic Card - Seamless Background, Copy & Sound Controls
 * UX: Top-Left Delete, Bottom-Right Copy + Sound, Karaoke Highlight
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet, useColorScheme } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PRIMARY_BLUE = '#2563EB';
const YELLOW_GLOW = '#FEF08A';

type CardItemProps = {
  id: string;
  content: string;
  isPlaying: boolean;
  isCurrentCard: boolean;
  highlightedCharIndex: number; // For karaoke yellow glow
  onDelete: (id: string) => void;
  onCopy: (content: string) => void;
  onSoundPress: (id: string, content: string) => void;
};

const CardItem: React.FC<CardItemProps> = ({
  id,
  content,
  isPlaying,
  isCurrentCard,
  highlightedCharIndex,
  onDelete,
  onCopy,
  onSoundPress,
}) => {
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';

  // Seamless background matching system theme
  const theme = {
    cardBg: isDark ? '#1E293B' : '#F8FAFC',
    text: isDark ? '#F1F5F9' : '#0F172A',
    border: isDark ? '#334155' : '#E2E8F0',
    icon: isDark ? '#94A3B8' : '#64748B',
  };

  // Split content for karaoke highlight (yellow glow)
  const renderContent = () => {
    if (!isCurrentCard || !isPlaying || highlightedCharIndex === 0) {
      return <Text style={[styles.contentText, { color: theme.text }]}>{content}</Text>;
    }

    const before = content.substring(0, highlightedCharIndex);
    const activeChar = content.substring(highlightedCharIndex, highlightedCharIndex + 1);
    const after = content.substring(highlightedCharIndex + 1);

    return (
      <Text style={[styles.contentText, { color: theme.text }]}>
        <Text>{before}</Text>
        <Text style={styles.highlightedText}>{activeChar}</Text>
        <Text>{after}</Text>
      </Text>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.cardBg,
          borderColor: isCurrentCard && isPlaying ? PRIMARY_BLUE : theme.border,
        },
      ]}
    >
      {/* Top Row: Delete Icon (Top-Left) */}
      <View style={styles.topRow}>
        <Pressable onPress={() => onDelete(id)} style={styles.iconButton} hitSlop={10}>
          <Icon name="delete-outline" size={20} color={theme.icon} />
        </Pressable>
      </View>

      {/* Content Body: Dynamic Height */}
      <View style={styles.contentBody}>{renderContent()}</View>

      {/* Bottom Row: Copy + Sound (Bottom-Right) */}
      <View style={styles.bottomRow}>
        <Pressable onPress={() => onCopy(content)} style={styles.iconButton} hitSlop={10}>
          <Icon name="content-copy" size={20} color={theme.icon} />
        </Pressable>

        <Pressable
          onPress={() => onSoundPress(id, content)}
          style={[styles.iconButton, styles.soundButton]}
          hitSlop={10}
        >
          <Icon
            name={isCurrentCard && isPlaying ? 'stop' : 'volume-up'}
            size={22}
            color={isCurrentCard && isPlaying ? PRIMARY_BLUE : theme.icon}
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginVertical: 8,
    // Dynamic height - no fixed height
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 8,
  },
  contentBody: {
    minHeight: 20,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    // English Only font
    fontFamily: 'System',
  },
  highlightedText: {
    backgroundColor: YELLOW_GLOW,
    color: '#000000',
    borderRadius: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 12,
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
  soundButton: {
    marginLeft: 8,
  },
});

export default CardItem;

