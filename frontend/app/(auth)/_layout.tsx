import React from 'react';
import { Stack } from 'expo-router';
import { THEME } from '../../src/theme';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: THEME.background },
      }}
    >
      <Stack.Screen name="login" />
    </Stack>
  );
}
