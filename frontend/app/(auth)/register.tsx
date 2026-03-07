import React, { useState } from 'react';
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
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/stores/authStore';
import { THEME, SERVICE_ICONS, SERVICE_COLORS } from '../../src/theme';

const AVAILABLE_SKILLS = [
  { id: 'plumbing', name: 'Plumbing', icon: 'water' },
  { id: 'electrical', name: 'Electrical', icon: 'flash' },
  { id: 'cleaning', name: 'Cleaning', icon: 'sparkles' },
  { id: 'carpentry', name: 'Carpentry', icon: 'hammer' },
  { id: 'painting', name: 'Painting', icon: 'color-palette' },
  { id: 'appliance_repair', name: 'Appliance Repair', icon: 'construct' },
];

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { pendingPhone, register, error } = useAuthStore();

  const toggleSkill = (skillId: string) => {
    setSelectedSkills(prev => 
      prev.includes(skillId)
        ? prev.filter(s => s !== skillId)
        : [...prev, skillId]
    );
  };

  const handleRegister = async () => {
    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter your name');
      return;
    }
    
    if (selectedSkills.length === 0) {
      Alert.alert('Skills Required', 'Please select at least one skill');
      return;
    }
    
    if (!pendingPhone) {
      Alert.alert('Error', 'Phone number not found. Please restart registration.');
      router.replace('/(auth)/login');
      return;
    }
    
    setLoading(true);
    const success = await register(pendingPhone, name.trim(), selectedSkills);
    setLoading(false);
    
    if (success) {
      router.replace('/(main)');
    } else {
      Alert.alert('Error', error || 'Registration failed. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <LinearGradient
              colors={THEME.gradientPrimary as any}
              style={styles.iconContainer}
            >
              <Ionicons name="person-add" size={32} color="white" />
            </LinearGradient>
            <Text style={styles.title}>Create Your Profile</Text>
            <Text style={styles.subtitle}>
              Tell us about yourself to get started
            </Text>
          </View>

          {/* Name Input */}
          <View style={styles.section}>
            <Text style={styles.label}>Your Name</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={THEME.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor={THEME.textMuted}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoFocus
              />
            </View>
          </View>

          {/* Skills Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>Select Your Skills</Text>
            <Text style={styles.hint}>Choose services you can provide</Text>
            
            <View style={styles.skillsGrid}>
              {AVAILABLE_SKILLS.map((skill) => {
                const isSelected = selectedSkills.includes(skill.id);
                const skillColor = SERVICE_COLORS[skill.id] || THEME.primary;
                
                return (
                  <TouchableOpacity
                    key={skill.id}
                    style={[
                      styles.skillCard,
                      isSelected && { borderColor: skillColor, backgroundColor: skillColor + '10' }
                    ]}
                    onPress={() => toggleSkill(skill.id)}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.skillIcon,
                      { backgroundColor: isSelected ? skillColor + '20' : THEME.backgroundSecondary }
                    ]}>
                      <Ionicons 
                        name={skill.icon as any} 
                        size={24} 
                        color={isSelected ? skillColor : THEME.textSecondary} 
                      />
                    </View>
                    <Text style={[
                      styles.skillName,
                      isSelected && { color: skillColor, fontWeight: '600' }
                    ]}>
                      {skill.name}
                    </Text>
                    {isSelected && (
                      <View style={[styles.checkmark, { backgroundColor: skillColor }]}>
                        <Ionicons name="checkmark" size={12} color="white" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Selected Summary */}
          {selectedSkills.length > 0 && (
            <View style={styles.summaryContainer}>
              <Ionicons name="checkmark-circle" size={18} color={THEME.success} />
              <Text style={styles.summaryText}>
                {selectedSkills.length} skill{selectedSkills.length > 1 ? 's' : ''} selected
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Register Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.button,
              (!name.trim() || selectedSkills.length === 0) && styles.buttonDisabled
            ]}
            onPress={handleRegister}
            disabled={!name.trim() || selectedSkills.length === 0 || loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Text style={styles.buttonText}>Complete Registration</Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </>
            )}
          </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: THEME.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: THEME.spacing.xl,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: THEME.borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
    ...THEME.shadow.medium,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: THEME.text,
    marginBottom: THEME.spacing.xs,
  },
  subtitle: {
    fontSize: 15,
    color: THEME.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: THEME.spacing.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text,
    marginBottom: THEME.spacing.sm,
  },
  hint: {
    fontSize: 13,
    color: THEME.textMuted,
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
  },
  input: {
    flex: 1,
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.sm,
    fontSize: 16,
    color: THEME.text,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing.sm,
  },
  skillCard: {
    width: '48%',
    backgroundColor: THEME.cardBg,
    borderRadius: THEME.borderRadius.medium,
    padding: THEME.spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: THEME.cardBorder,
    position: 'relative',
  },
  skillIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
  },
  skillName: {
    fontSize: 14,
    color: THEME.textSecondary,
    textAlign: 'center',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.success + '15',
    padding: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.medium,
    gap: THEME.spacing.xs,
    marginBottom: THEME.spacing.md,
  },
  summaryText: {
    fontSize: 14,
    color: THEME.success,
    fontWeight: '500',
  },
  footer: {
    padding: THEME.spacing.md,
    backgroundColor: THEME.cardBg,
    borderTopWidth: 1,
    borderTopColor: THEME.cardBorder,
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
});
