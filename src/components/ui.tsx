import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View, ViewProps } from 'react-native';
import { colors, shadows } from '../theme';

type CardProps = ViewProps & { padded?: boolean };

export const Screen = ({ children, style, ...props }: ViewProps) => (
  <View style={[styles.screen, style]} {...props}>{children}</View>
);

export const Card = ({ children, style, padded = true, ...props }: CardProps) => (
  <View style={[styles.card, padded && styles.cardPadded, style]} {...props}>{children}</View>
);

export const Title = ({ children }: { children: React.ReactNode }) => <Text style={styles.title}>{children}</Text>;
export const Subtitle = ({ children }: { children: React.ReactNode }) => <Text style={styles.subtitle}>{children}</Text>;

export const Field = (props: TextInputProps) => <TextInput placeholderTextColor={colors.muted} style={styles.input} {...props} />;

export const PrimaryButton = ({ label, onPress, tone = 'primary' }: { label: string; onPress: () => void; tone?: 'primary' | 'danger' | 'ghost' }) => (
  <Pressable onPress={onPress} style={[styles.button, tone === 'danger' && styles.dangerButton, tone === 'ghost' && styles.ghostButton]}>
    <Text style={[styles.buttonText, tone === 'ghost' && styles.ghostText]}>{label}</Text>
  </Pressable>
);

export const Pill = ({ label, active, onPress }: { label: string; active?: boolean; onPress: () => void }) => (
  <Pressable onPress={onPress} style={[styles.pill, active && styles.pillActive]}>
    <Text style={[styles.pillText, active && styles.pillTextActive]}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, padding: 16 },
  card: { backgroundColor: colors.card, borderRadius: 22, borderWidth: 1, borderColor: colors.border, ...shadows.card },
  cardPadded: { padding: 16 },
  title: { color: colors.text, fontSize: 28, fontWeight: '900', letterSpacing: -0.5 },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 20, marginTop: 4 },
  input: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 14, color: colors.text, paddingHorizontal: 14, paddingVertical: 12, marginTop: 10 },
  button: { backgroundColor: colors.primary, borderRadius: 16, paddingVertical: 13, alignItems: 'center', marginTop: 12 },
  dangerButton: { backgroundColor: colors.danger },
  ghostButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border },
  buttonText: { color: '#042014', fontWeight: '900' },
  ghostText: { color: colors.text },
  pill: { borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8, marginRight: 8, marginBottom: 8, backgroundColor: colors.surface },
  pillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  pillText: { color: colors.muted, fontWeight: '700' },
  pillTextActive: { color: '#042014' },
});
