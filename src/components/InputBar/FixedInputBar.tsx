/**
 * src/components/InputBar/FixedInputBar.tsx
 */
import React, { useState, useRef } from 'react';
import { View, TextInput, Pressable, StyleSheet, useColorScheme } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PRIMARY_BLUE = '#2563EB';

type FixedInputBarProps = { onSubmit: (text: string) => void; };

const FixedInputBar: React.FC<FixedInputBarProps> = ({ onSubmit }) => {
  const [text, setText] = useState('');
  const [inputHeight, setInputHeight] = useState(48);
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';
  const inputRef = useRef<any>(null);

  const theme = {
    background: isDark ? '#1E293B' : '#FFFFFF',
    inputBg: isDark ? '#0F172A' : '#F1F5F9',
    text: isDark ? '#F1F5F9' : '#0F172A',
    placeholder: isDark ? '#64748B' : '#94A3B8',
    border: isDark ? '#334155' : '#E2E8F0',
    resizer: isDark ? '#475569' : '#CBD5E1',
  };

  const handleContentSizeChange = (event: any) => {
    const newHeight = Math.min(Math.max(48, event.nativeEvent.contentSize.height), 140);
    setInputHeight(newHeight);
  };

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (trimmed.length === 0) return;
    onSubmit(trimmed);
    setText('');
    setInputHeight(48);
  };

  const isDisabled = text.trim().length === 0;
  const resizerHeight = Math.min(24, Math.max(12, inputHeight * 0.4));

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
      <View style={[styles.container, { backgroundColor: theme.inputBg, minHeight: inputHeight }]}>
        <TextInput
          ref={inputRef as any}
          style={[styles.textInput, { color: theme.text, height: inputHeight }]}
          placeholder="Type a message..."
          placeholderTextColor={theme.placeholder}
          value={text}
          onChangeText={setText}
          onContentSizeChange={handleContentSizeChange}
          multiline
          scrollEnabled={inputHeight >= 140}
          onSubmitEditing={handleSubmit}
          blurOnSubmit={false}
          returnKeyType="send"
          underlineColorAndroid="transparent"
        />
        <View style={styles.rightControls}>
          <View style={[styles.resizerIndicator, { backgroundColor: theme.resizer, height: resizerHeight }]} />
          <Pressable onPress={handleSubmit} disabled={isDisabled} style={[styles.sendButton, { backgroundColor: isDisabled ? theme.border : PRIMARY_BLUE }]}>
            <Icon name="arrow-upward" size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopWidth: 1, paddingHorizontal: 12, paddingVertical: 8 },
  container: { flexDirection: 'row', alignItems: 'flex-end', borderRadius: 24, paddingHorizontal: 16, paddingVertical: 6 },
  textInput: { flex: 1, fontSize: 16, lineHeight: 22, paddingVertical: 10, maxHeight: 140, fontFamily: 'System' },
  rightControls: { flexDirection: 'row', alignItems: 'center', marginLeft: 8, gap: 8 },
  resizerIndicator: { width: 3, borderRadius: 2 },
  sendButton: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
});

export default FixedInputBar;

