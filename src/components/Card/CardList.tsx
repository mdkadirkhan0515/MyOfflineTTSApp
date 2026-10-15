/**
 * src/components/Card/CardList.tsx
 * Card List - Final Connected Version
 * Uses useCards + useTTS + useActiveSession - Dynamic Height, Seamless
 */

import React, { useCallback } from 'react';
import { FlatList, View, StyleSheet, Clipboard, Alert } from 'react-native';
import CardItem from './CardItem';
import { useCards } from '../../hooks/useCards';
import { useTTS } from '../../hooks/useTTS';
import { Card } from '../../types/card.types';

type Props = {
  sessionId: string | null;
};

const CardList: React.FC<Props> = ({ sessionId }) => {
  const { cards, removeCard } = useCards(sessionId);
  const { currentCardId, charIndex, status, speakCard, stop } = useTTS();

  const isPlaying = status === 'playing';

  const handleDelete = useCallback(
    (id: string) => {
      if (currentCardId === id) {
        stop();
      }
      removeCard(id);
    },
    [removeCard, currentCardId, stop]
  );

  const handleCopy = useCallback((content: string) => {
    Clipboard.setString(content);
    // Toast can be added here
  }, []);

  const handleSoundPress = useCallback(
    (id: string, content: string) => {
      const card = cards.find((c) => c.id === id);
      if (!card) return;

      if (currentCardId === id && isPlaying) {
        stop();
      } else {
        speakCard(card as Card);
      }
    },
    [cards, currentCardId, isPlaying, speakCard, stop]
  );

  const renderItem = useCallback(
    ({ item }: { item: Card }) => {
      const isCurrentCard = item.id === currentCardId;
      return (
        <CardItem
          id={item.id}
          content={item.content}
          isPlaying={isCurrentCard && isPlaying}
          isCurrentCard={isCurrentCard}
          highlightedCharIndex={isCurrentCard ? charIndex : 0}
          onDelete={handleDelete}
          onCopy={handleCopy}
          onSoundPress={handleSoundPress}
        />
      );
    },
    [currentCardId, charIndex, isPlaying, handleDelete, handleCopy, handleSoundPress]
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        // Dynamic height support - no getItemLayout
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: 120, // Space for InputBar + GlobalController
  },
});

export default CardList;

