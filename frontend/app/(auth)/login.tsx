import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/stores/authStore';
import { THEME } from '../../src/theme';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  
  const otpInputRef = useRef<TextInput>(null);
  const { sendOTP, verifyOTP, error } = useAuthStore();

  const handleSendOTP = async () => {
    if (phone.length < 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number');
      return;
    }
    
    setLoading(true);
    const success = await sendOTP(phone);
    setLoading(false);
    
    if (success) {
      setStep('otp');
      setTimeout(() => otpInputRef.current?.focus(), 100);
    } else {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter the 6-digit OTP');
      return;
    }
    
    setLoading(true);
    const success = await verifyOTP(phone, otp);
    setLoading(false);
    
    if (success) {
      router.replace('/(main)');
    } else {
      Alert.alert('Error', error || 'Invalid OTP. Please try again.');
    }
  };

  const handleBack = () => {
    setStep('phone');
    setOtp('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={THEME.gradientPrimary as any}
            style={styles.logoContainer}
          >
            <Ionicons name="construct" size={48} color="white" />
          </LinearGradient>
          <Text style={styles.title}>Skilled Genie</Text>
          <Text style={styles.subtitle}>Service Partner App</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {step === 'phone' ? (
            <>
              <Text style={styles.label}>Enter your phone number</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={20} color={THEME.textMuted} />
                <TextInput
                  style={styles.input}
                  placeholder="Phone number"
                  placeholderTextColor={THEME.textMuted}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  maxLength={15}
                  autoFocus
                />
              </View>
              <Text style={styles.hint}>Use 7777777777 or 1111111111 for testing</Text>
              
              <TouchableOpacity
                style={[styles.button, phone.length < 10 && styles.buttonDisabled]}
                onPress={handleSendOTP}
                disabled={phone.length < 10 || loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Send OTP</Text>
                    <Ionicons name="arrow-forward" size={20} color="white" />
                  </>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Ionicons name="arrow-back" size={24} color={THEME.text} />
              </TouchableOpacity>
              
              <Text style={styles.label}>Enter OTP</Text>
              <Text style={styles.phoneDisplay}>Sent to {phone}</Text>
              
              <View style={styles.inputContainer}>
                <Ionicons name="keypad-outline" size={20} color={THEME.textMuted} />
                <TextInput
                  ref={otpInputRef}
                  style={styles.input}
                  placeholder="6-digit OTP"
                  placeholderTextColor={THEME.textMuted}
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </View>
              <Text style={styles.hint}>Use 123456 for testing</Text>
              
              <TouchableOpacity
                style={[styles.button, otp.length !== 6 && styles.buttonDisabled]}
                onPress={handleVerifyOTP}
                disabled={otp.length !== 6 || loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Verify & Login</Text>
                    <Ionicons name="checkmark-circle" size={20} color="white" />
                  </>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our Terms of Service
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  keyboardView: {
    flex: 1,
    padding: THEME.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginTop: THEME.spacing.xxl,
    marginBottom: THEME.spacing.xl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: THEME.borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
    ...THEME.shadow.large,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: THEME.text,
    marginBottom: THEME.spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: THEME.textSecondary,
  },
  form: {
    flex: 1,
  },
  backButton: {
    marginBottom: THEME.spacing.md,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME.text,
    marginBottom: THEME.spacing.sm,
  },
  phoneDisplay: {
    fontSize: 14,
    color: THEME.textSecondary,
    marginBottom: THEME.spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.cardBg,
    borderRadius: THEME.borderRadius.medium,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    paddingHorizontal: THEME.spacing.md,
    marginBottom: THEME.spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.sm,
    fontSize: 18,
    color: THEME.text,
  },
  hint: {
    fontSize: 12,
    color: THEME.textMuted,
    marginBottom: THEME.spacing.lg,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.primary,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.borderRadius.medium,
    gap: THEME.spacing.sm,
    ...THEME.shadow.medium,
  },
  buttonDisabled: {
    backgroundColor: THEME.textMuted,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: THEME.spacing.lg,
  },
  footerText: {
    fontSize: 12,
    color: THEME.textMuted,
    textAlign: 'center',
  },
});
