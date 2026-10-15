/**
 * src/components/Drawer/SessionDrawer.tsx
 * Navigation Drawer - Chronological Index & Date Filters
 * UX: Date Filters (Today, Yesterday, 8 Oct), Auto Naming (9 Oct_i, ii, iii), Delete per session
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  useColorScheme,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PRIMARY_BLUE = '#2563EB';

type Session = {
  id: string;
  date_label: string; // Today, Yesterday, 8 Oct, 9 Oct
  session_name: string; // 9 Oct_i, 9 Oct_ii, 9 Oct_iii
  created_at: number;
};

type SessionDrawerProps = {
  sessions: Session[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onNewChat: () => void;
};

const DATE_FILTERS = ['All', 'Today', 'Yesterday', '8 Oct', '9 Oct', '10 Oct'];

const SessionDrawer: React.FC<SessionDrawerProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  onNewChat,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';

  const theme = {
    background: isDark ? '#0F172A' : '#FFFFFF',
    filterBg: isDark ? '#1E293B' : '#F1F5F9',
    filterActiveBg: PRIMARY_BLUE,
    filterText: isDark ? '#94A3B8' : '#64748B',
    filterActiveText: '#FFFFFF',
    itemBg: isDark ? '#1E293B' : '#F8FAFC',
    itemActiveBg: isDark ? '#1E3A5F' : '#DBEAFE',
    text: isDark ? '#F1F5F9' : '#0F172A',
    border: isDark ? '#334155' : '#E2E8F0',
    icon: isDark ? '#64748B' : '#94A3B8',
  };

  // Filter sessions by date_label
  const filteredSessions = useMemo(() => {
    if (selectedFilter === 'All') return sessions;
    return sessions.filter((s) => s.date_label === selectedFilter);
  }, [sessions, selectedFilter]);

  // Group by date_label for chronological display
  const grouped = useMemo(() => {
    const groups: Record<string, Session[]> = {};
    filteredSessions.forEach((s) => {
      if (!groups[s.date_label]) groups[s.date_label] = [];
      groups[s.date_label].push(s);
    });
    // Sort each group by created_at DESC -> _i, _ii, _iii chronological
    Object.keys(groups).forEach((key) => {
      groups[key].sort((a, b) => a.created_at - b.created_at);
    });
    return groups;
  }, [filteredSessions]);

  const renderSessionItem = (session: Session) => {
    const isActive = session.id === activeSessionId;
    return (
      <View
        key={session.id}
        style={[
          styles.sessionItem,
          {
            backgroundColor: isActive ? theme.itemActiveBg : theme.itemBg,
            borderColor: isActive ? PRIMARY_BLUE : theme.border,
          },
        ]}
      >
        <Pressable onPress={() => onSelectSession(session.id)} style={styles.sessionContent}>
          <Text
            style={[styles.sessionName, { color: isActive ? PRIMARY_BLUE : theme.text }]}
            numberOfLines={1}
          >
            {session.session_name}
          </Text>
          <Text style={[styles.sessionMeta, { color: theme.icon }]}>{session.date_label}</Text>
        </Pressable>

        {/* Right Side Delete Icon */}
        <Pressable onPress={() => onDeleteSession(session.id)} style={styles.deleteButton} hitSlop={8}>
          <Icon name="delete-outline" size={18} color={theme.icon} />
        </Pressable>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header: Writing / New Chat Icon (Top-Right action handled by navigation header, this is drawer content) */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Chat History</Text>
        <Pressable onPress={onNewChat} style={[styles.newChatButton, { backgroundColor: PRIMARY_BLUE }]}>
          <Icon name="edit" size={18} color="#FFFFFF" />
          <Text style={styles.newChatText}>New</Text>
        </Pressable>
      </View>

      {/* Date Filters Bar: Today, Yesterday, 8 Oct */}
      <View style={styles.filterWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
          {DATE_FILTERS.map((filter) => {
            const isSelected = selectedFilter === filter;
            return (
              <Pressable
                key={filter}
                onPress={() => setSelectedFilter(filter)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isSelected ? theme.filterActiveBg : theme.filterBg,
                    borderColor: isSelected ? PRIMARY_BLUE : theme.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    { color: isSelected ? theme.filterActiveText : theme.filterText },
                  ]}
                >
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Session List - Chronological: 9 Oct_i, 9 Oct_ii, 9 Oct_iii */}
      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        {Object.keys(grouped).length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.icon }]}>No sessions found</Text>
          </View>
        ) : (
          Object.keys(grouped)
            .sort((a, b) => {
              // Keep Today, Yesterday on top
              if (a === 'Today') return -1;
              if (b === 'Today') return 1;
              if (a === 'Yesterday') return -1;
              if (b === 'Yesterday') return 1;
              return b.localeCompare(a);
            })
            .map((dateLabel) => (
              <View key={dateLabel} style={styles.groupContainer}>
                <Text style={[styles.groupLabel, { color: theme.icon }]}>{dateLabel}</Text>
                {grouped[dateLabel].map(renderSessionItem)}
              </View>
            ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  newChatText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  filterWrapper: {
    marginBottom: 12,
  },
  filterContainer: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  groupContainer: {
    marginBottom: 16,
  },
  groupLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  sessionContent: {
    flex: 1,
  },
  sessionName: {
    fontSize: 14,
    fontWeight: '500',
  },
  sessionMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  deleteButton: {
    padding: 6,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
});

export default SessionDrawer;

