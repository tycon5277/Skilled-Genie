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
    const result = await verifyOTP(phone, otp);
    setLoading(false);
    
    if (result === 'login') {
      router.replace('/(main)');
    } else if (result === 'register') {
      router.replace('/(auth)/register');
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
        {/* iOS-style Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="construct" size={44} color="#007AFF" />
          </View>
          <Text style={styles.title}>Skilled Genie</Text>
          <Text style={styles.subtitle}>Service Partner App</Text>
        </View>

        {/* iOS-style Form */}
        <View style={styles.form}>
          {step === 'phone' ? (
            <>
              <Text style={styles.sectionHeader}>SIGN IN</Text>
              <View style={styles.card}>
                <View style={styles.inputRow}>
                  <Ionicons name="call" size={20} color="#007AFF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    placeholderTextColor="#8E8E93"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    maxLength={15}
                    autoFocus
                  />
                </View>
              </View>
              
              <TouchableOpacity
                style={[styles.button, phone.length < 10 && styles.buttonDisabled]}
                onPress={handleSendOTP}
                disabled={phone.length < 10 || loading}
                activeOpacity={0.7}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>Continue</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Ionicons name="chevron-back" size={28} color="#007AFF" />
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>
              
              <Text style={styles.sectionHeader}>VERIFICATION</Text>
              <Text style={styles.verifySubtext}>
                Enter the 6-digit code sent to {phone}
              </Text>
              
              <View style={styles.card}>
                <View style={styles.inputRow}>
                  <Ionicons name="keypad" size={20} color="#007AFF" style={styles.inputIcon} />
                  <TextInput
                    ref={otpInputRef}
                    style={styles.input}
                    placeholder="000000"
                    placeholderTextColor="#8E8E93"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                </View>
              </View>
              
              <Text style={styles.hint}>Use 123456 for testing</Text>
              
              <TouchableOpacity
                style={[styles.button, otp.length !== 6 && styles.buttonDisabled]}
                onPress={handleVerifyOTP}
                disabled={otp.length !== 6 || loading}
                activeOpacity={0.7}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>Verify</Text>
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
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#007AFF15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: THEME.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: THEME.textMuted,
    marginTop: 4,
  },
  form: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '500',
    color: THEME.textMuted,
    marginBottom: 8,
    marginLeft: 16,
    letterSpacing: 0.5,
  },
  verifySubtext: {
    fontSize: 15,
    color: THEME.textSecondary,
    marginBottom: 20,
    marginLeft: 16,
  },
  card: {
    backgroundColor: THEME.cardBg,
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    minHeight: 50,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: THEME.text,
    paddingVertical: 14,
  },
  hint: {
    fontSize: 13,
    color: THEME.textMuted,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#8E8E93',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: 'white',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: -8,
  },
  backText: {
    fontSize: 17,
    color: '#007AFF',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 40,
  },
  footerText: {
    fontSize: 13,
    color: THEME.textMuted,
    textAlign: 'center',
  },
});
