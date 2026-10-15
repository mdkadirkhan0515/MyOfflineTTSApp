/**
 * src/navigation/AppNavigator.tsx
 * Root Navigation - Drawer + Stack
 */
import React from 'react';
import { Pressable, useColorScheme } from 'react-native';
import { createDrawerNavigator, DrawerContentComponentProps } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import HomeScreen from '../screens/HomeScreen';
import SessionDrawer from '../components/Drawer/SessionDrawer';
import { useActiveSession } from '../hooks/useActiveSession';
import { getAllSessions } from '../db/queries/index';
import { deleteSession } from '../db/queries/sessionQueries';

const PRIMARY_BLUE = '#2563EB';
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { activeSessionId, switchSession, createNewSession, clearActiveSession } = useActiveSession();
  const [sessions, setSessions] = React.useState<any[]>([]);

  React.useEffect(() => {
    try {
      const all = getAllSessions();
      setSessions(all);
    } catch {}
  }, [activeSessionId]);

  const handleSelect = (id: string) => {
    switchSession(id);
    props.navigation.closeDrawer();
  };

  const handleDelete = (id: string) => {
    try {
      deleteSession(id);
      const all = getAllSessions();
      setSessions(all);
      if (id === activeSessionId) clearActiveSession();
    } catch {}
  };

  const handleNewChat = () => {
    createNewSession();
    props.navigation.closeDrawer();
  };

  return (
    <SessionDrawer
      sessions={sessions}
      activeSessionId={activeSessionId}
      onSelectSession={handleSelect}
      onDeleteSession={handleDelete}
      onNewChat={handleNewChat}
    />
  );
};

const DrawerNavigator = () => {
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';
  const theme = { background: isDark ? '#0F172A' : '#FFFFFF', text: isDark ? '#F1F5F9' : '#0F172A', icon: isDark ? '#F1F5F9' : '#0F172A' };

  return (
    <Drawer.Navigator
      drawerContent={(p) => <CustomDrawerContent {...p} />}
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: theme.background, elevation: 0, shadowOpacity: 0 },
        headerTintColor: theme.text,
        headerTitleStyle: { fontSize: 16, fontWeight: '600' },
        headerTitleAlign: 'center',
        headerLeft: () => (
          <Pressable onPress={() => navigation.toggleDrawer()} style={{ paddingHorizontal: 16 }}>
            <Icon name="menu" size={24} color={theme.icon} />
          </Pressable>
        ),
        headerRight: () => (
          <Pressable onPress={() => navigation.navigate('HomeDrawer', { newChat: true } as never)} style={{ paddingHorizontal: 16 }}>
            <Icon name="edit" size={22} color={theme.icon} />
          </Pressable>
        ),
        drawerStyle: { backgroundColor: theme.background, width: 300 },
        drawerType: 'front',
        overlayColor: 'rgba(0,0,0,0.3)',
      })}
    >
      <Drawer.Screen name="HomeDrawer" component={HomeScreen} options={{ title: 'TTS Cards' }} />
    </Drawer.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={DrawerNavigator} />
    </Stack.Navigator>
  );
};

export default AppNavigator;

