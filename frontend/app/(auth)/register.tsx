import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/stores/authStore';
import { THEME } from '../../src/theme';
import {
  SKILL_CATEGORIES,
  EXPERIENCE_LEVELS,
  SERVICE_AREAS,
  SOCIAL_PLATFORMS,
} from '../../src/data/skillCategories';

const STEPS = [
  { id: 1, title: 'Skills', icon: 'construct' },
  { id: 2, title: 'Experience', icon: 'trophy' },
  { id: 3, title: 'Area', icon: 'location' },
  { id: 4, title: 'Profile', icon: 'person' },
];

export default function RegisterScreen() {
  // Step state
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Step 1: Skills
  const [name, setName] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Step 2: Experience
  const [experienceLevel, setExperienceLevel] = useState<string | null>(null);

  // Step 3: Service Area
  const [serviceArea, setServiceArea] = useState<string | null>(null);

  // Step 4: Profile
  const [bio, setBio] = useState('');
  const [socialLinks, setSocialLinks] = useState<{ [key: string]: string }>({});
  const [certifications, setCertifications] = useState<string[]>([]);
  const [newCertification, setNewCertification] = useState('');
  const [profileTab, setProfileTab] = useState<'bio' | 'social' | 'certs'>('bio');

  const { pendingPhone, register, error } = useAuthStore();

  // Category lock logic
  const toggleSkill = (skillId: string, categoryId: string) => {
    if (!selectedCategoryId || selectedCategoryId === categoryId) {
      if (selectedSkills.includes(skillId)) {
        const newSkills = selectedSkills.filter(id => id !== skillId);
        setSelectedSkills(newSkills);
        if (newSkills.length === 0) {
          setSelectedCategoryId(null);
        }
      } else {
        setSelectedSkills([...selectedSkills, skillId]);
        setSelectedCategoryId(categoryId);
      }
    } else {
      const currentCategoryName = SKILL_CATEGORIES.find(c => c.id === selectedCategoryId)?.title;
      const newCategoryName = SKILL_CATEGORIES.find(c => c.id === categoryId)?.title;
      
      Alert.alert(
        'Cannot Mix Categories',
        `You've selected skills from "${currentCategoryName}". To switch to "${newCategoryName}", first deselect all current skills.`,
        [{ text: 'Got it', style: 'default' }]
      );
    }
  };

  const addCertification = () => {
    if (newCertification.trim()) {
      setCertifications([...certifications, newCertification.trim()]);
      setNewCertification('');
    }
  };

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return name.trim().length >= 2 && selectedSkills.length > 0;
      case 2:
        return experienceLevel !== null;
      case 3:
        return serviceArea !== null;
      case 4:
        return true; // Bio is optional
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const handleComplete = async () => {
    if (!pendingPhone) {
      Alert.alert('Error', 'Phone number not found. Please restart.');
      router.replace('/(auth)/login');
      return;
    }

    setLoading(true);
    const success = await register({
      phone: pendingPhone,
      name: name.trim(),
      skills: selectedSkills,
      skill_category: selectedCategoryId || undefined,
      experience_level: experienceLevel || undefined,
      service_area: serviceArea || undefined,
      bio: bio.trim() || undefined,
      social_links: Object.keys(socialLinks).length > 0 ? socialLinks : undefined,
      certifications: certifications.length > 0 ? certifications : undefined,
    });
    setLoading(false);

    if (success) {
      router.replace('/(main)');
    } else {
      Alert.alert('Error', error || 'Registration failed. Please try again.');
    }
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        {STEPS.map((step, index) => (
          <React.Fragment key={step.id}>
            <TouchableOpacity
              style={[
                styles.progressStep,
                currentStep >= step.id && styles.progressStepActive,
                currentStep === step.id && styles.progressStepCurrent,
              ]}
              onPress={() => step.id < currentStep && setCurrentStep(step.id)}
              disabled={step.id > currentStep}
            >
              <Ionicons
                name={step.icon as any}
                size={16}
                color={currentStep >= step.id ? 'white' : THEME.textMuted}
              />
            </TouchableOpacity>
            {index < STEPS.length - 1 && (
              <View
                style={[
                  styles.progressLine,
                  currentStep > step.id && styles.progressLineActive,
                ]}
              />
            )}
          </React.Fragment>
        ))}
      </View>
      <Text style={styles.progressText}>
        Step {currentStep} of 4: {STEPS[currentStep - 1].title}
      </Text>
    </View>
  );

  const renderStep1Skills = () => (
    <View style={styles.stepContent}>
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
          />
        </View>
      </View>

      {/* Category Lock Badge */}
      {selectedCategoryId && (
        <View style={styles.lockBadge}>
          <Ionicons name="lock-closed" size={14} color={THEME.primary} />
          <Text style={styles.lockBadgeText}>
            Locked to: {SKILL_CATEGORIES.find(c => c.id === selectedCategoryId)?.title}
          </Text>
          <TouchableOpacity onPress={() => {
            setSelectedSkills([]);
            setSelectedCategoryId(null);
          }}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Skills Categories */}
      <Text style={styles.label}>Select Your Skills</Text>
      <Text style={styles.hint}>Choose skills from ONE category only</Text>

      {SKILL_CATEGORIES.map((category) => {
        const isLocked = selectedCategoryId && selectedCategoryId !== category.id;
        const isExpanded = expandedCategory === category.id;
        const selectedCount = selectedSkills.filter(s => 
          category.skills.some(cs => cs.id === s)
        ).length;

        return (
          <View
            key={category.id}
            style={[styles.categoryCard, isLocked && styles.categoryLocked]}
          >
            <TouchableOpacity
              style={styles.categoryHeader}
              onPress={() => setExpandedCategory(isExpanded ? null : category.id)}
              disabled={isLocked}
            >
              <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                <Text style={styles.categoryEmoji}>{category.emoji}</Text>
              </View>
              <View style={styles.categoryInfo}>
                <Text style={[styles.categoryTitle, isLocked && styles.textLocked]}>
                  {category.title}
                </Text>
                <Text style={styles.categorySubtitle}>{category.subtitle}</Text>
              </View>
              {selectedCount > 0 && (
                <View style={[styles.countBadge, { backgroundColor: category.color }]}>
                  <Text style={styles.countText}>{selectedCount}</Text>
                </View>
              )}
              {isLocked ? (
                <Ionicons name="lock-closed" size={20} color={THEME.textMuted} />
              ) : (
                <Ionicons
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={THEME.textSecondary}
                />
              )}
            </TouchableOpacity>

            {isExpanded && !isLocked && (
              <View style={styles.skillsGrid}>
                {category.skills.map((skill) => {
                  const isSelected = selectedSkills.includes(skill.id);
                  return (
                    <TouchableOpacity
                      key={skill.id}
                      style={[
                        styles.skillChip,
                        isSelected && { backgroundColor: category.color, borderColor: category.color }
                      ]}
                      onPress={() => toggleSkill(skill.id, category.id)}
                    >
                      <Text style={styles.skillEmoji}>{skill.emoji}</Text>
                      <Text style={[
                        styles.skillName,
                        isSelected && styles.skillNameSelected
                      ]}>
                        {skill.name}
                      </Text>
                      {isSelected && (
                        <Ionicons name="checkmark" size={14} color="white" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );

  const renderStep2Experience = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Your Experience Level</Text>
      <Text style={styles.stepDescription}>
        How long have you been providing these services?
      </Text>

      <View style={styles.optionsGrid}>
        {EXPERIENCE_LEVELS.map((level) => {
          const isSelected = experienceLevel === level.id;
          return (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.optionCard,
                isSelected && { borderColor: level.color, backgroundColor: level.color + '10' }
              ]}
              onPress={() => setExperienceLevel(level.id)}
            >
              <Text style={styles.optionEmoji}>{level.emoji}</Text>
              <Text style={[styles.optionLabel, isSelected && { color: level.color }]}>
                {level.label}
              </Text>
              <Text style={styles.optionYears}>{level.years}</Text>
              <Text style={styles.optionDesc}>{level.description}</Text>
              {isSelected && (
                <View style={[styles.checkCircle, { backgroundColor: level.color }]}>
                  <Ionicons name="checkmark" size={16} color="white" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderStep3Area = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Service Area</Text>
      <Text style={styles.stepDescription}>
        How far are you willing to travel for jobs?
      </Text>

      <View style={styles.areaOptions}>
        {SERVICE_AREAS.map((area) => {
          const isSelected = serviceArea === area.id;
          return (
            <TouchableOpacity
              key={area.id}
              style={[
                styles.areaCard,
                isSelected && styles.areaCardSelected
              ]}
              onPress={() => setServiceArea(area.id)}
            >
              <Text style={styles.areaEmoji}>{area.emoji}</Text>
              <View style={styles.areaInfo}>
                <Text style={[styles.areaLabel, isSelected && styles.areaLabelSelected]}>
                  {area.label}
                </Text>
                <Text style={styles.areaDesc}>{area.description}</Text>
              </View>
              <View style={[
                styles.radioOuter,
                isSelected && styles.radioOuterSelected
              ]}>
                {isSelected && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderStep4Profile = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Complete Your Profile</Text>
      <Text style={styles.stepDescription}>
        Add details to stand out to customers (optional)
      </Text>

      {/* Profile Tabs */}
      <View style={styles.tabContainer}>
        {(['bio', 'social', 'certs'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, profileTab === tab && styles.tabActive]}
            onPress={() => setProfileTab(tab)}
          >
            <Text style={[styles.tabText, profileTab === tab && styles.tabTextActive]}>
              {tab === 'bio' ? 'Bio' : tab === 'social' ? 'Social' : 'Certifications'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {profileTab === 'bio' && (
        <View style={styles.profileSection}>
          <Text style={styles.tipText}>
            A good bio helps customers trust you. Describe your experience and what makes you unique.
          </Text>
          <TextInput
            style={styles.bioInput}
            placeholder="Tell customers about yourself, your experience, and why they should choose you..."
            placeholderTextColor={THEME.textMuted}
            value={bio}
            onChangeText={setBio}
            multiline
            maxLength={500}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{bio.length}/500</Text>
        </View>
      )}

      {profileTab === 'social' && (
        <View style={styles.profileSection}>
          <Text style={styles.tipText}>
            Link your social profiles to showcase your work and build credibility.
          </Text>
          {SOCIAL_PLATFORMS.map((platform) => (
            <View key={platform.id} style={styles.socialRow}>
              <View style={[styles.socialIcon, { backgroundColor: platform.color + '20' }]}>
                <Ionicons name={platform.icon as any} size={20} color={platform.color} />
              </View>
              <TextInput
                style={styles.socialInput}
                placeholder={platform.placeholder}
                placeholderTextColor={THEME.textMuted}
                value={socialLinks[platform.id] || ''}
                onChangeText={(text) => setSocialLinks({ ...socialLinks, [platform.id]: text })}
                autoCapitalize="none"
              />
            </View>
          ))}
        </View>
      )}

      {profileTab === 'certs' && (
        <View style={styles.profileSection}>
          <Text style={styles.tipText}>
            Add certifications or achievements to build trust with customers.
          </Text>
          <View style={styles.addCertRow}>
            <TextInput
              style={styles.certInput}
              placeholder="e.g., Licensed Electrician, ISO Certified"
              placeholderTextColor={THEME.textMuted}
              value={newCertification}
              onChangeText={setNewCertification}
            />
            <TouchableOpacity
              style={[styles.addCertBtn, !newCertification.trim() && styles.addCertBtnDisabled]}
              onPress={addCertification}
              disabled={!newCertification.trim()}
            >
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
          {certifications.map((cert, index) => (
            <View key={index} style={styles.certItem}>
              <Ionicons name="ribbon" size={18} color={THEME.primary} />
              <Text style={styles.certText}>{cert}</Text>
              <TouchableOpacity onPress={() => removeCertification(index)}>
                <Ionicons name="close-circle" size={20} color={THEME.error} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          {currentStep > 1 && (
            <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
              <Ionicons name="arrow-back" size={24} color={THEME.text} />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>Setup Your Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        {renderProgressBar()}

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {currentStep === 1 && renderStep1Skills()}
          {currentStep === 2 && renderStep2Experience()}
          {currentStep === 3 && renderStep3Area()}
          {currentStep === 4 && renderStep4Profile()}
        </ScrollView>

        {/* Footer Button */}
        <View style={styles.footer}>
          {selectedSkills.length > 0 && currentStep === 1 && (
            <View style={styles.selectionSummary}>
              <Ionicons name="checkmark-circle" size={16} color={THEME.success} />
              <Text style={styles.summaryText}>
                {selectedSkills.length} skill{selectedSkills.length > 1 ? 's' : ''} selected
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={[styles.nextButton, !canProceed() && styles.nextButtonDisabled]}
            onPress={handleNext}
            disabled={!canProceed() || loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Text style={styles.nextButtonText}>
                  {currentStep === 4 ? 'Complete Setup' : 'Continue'}
                </Text>
                <Ionicons
                  name={currentStep === 4 ? 'checkmark-circle' : 'arrow-forward'}
                  size={20}
                  color="white"
                />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: THEME.cardBorder,
    backgroundColor: THEME.cardBg,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME.text,
  },
  progressContainer: {
    padding: THEME.spacing.md,
    backgroundColor: THEME.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: THEME.cardBorder,
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing.sm,
  },
  progressStep: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressStepActive: {
    backgroundColor: THEME.primary,
  },
  progressStepCurrent: {
    transform: [{ scale: 1.1 }],
  },
  progressLine: {
    width: 40,
    height: 3,
    backgroundColor: THEME.backgroundSecondary,
    marginHorizontal: 4,
  },
  progressLineActive: {
    backgroundColor: THEME.primary,
  },
  progressText: {
    textAlign: 'center',
    fontSize: 13,
    color: THEME.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: THEME.spacing.md,
    paddingBottom: THEME.spacing.xxl,
  },
  stepContent: {},
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
  lockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.primary + '15',
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.medium,
    marginBottom: THEME.spacing.md,
    gap: THEME.spacing.xs,
  },
  lockBadgeText: {
    flex: 1,
    fontSize: 13,
    color: THEME.primary,
    fontWeight: '500',
  },
  clearText: {
    fontSize: 13,
    color: THEME.error,
    fontWeight: '600',
  },
  categoryCard: {
    backgroundColor: THEME.cardBg,
    borderRadius: THEME.borderRadius.large,
    marginBottom: THEME.spacing.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  categoryLocked: {
    opacity: 0.5,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.spacing.md,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryEmoji: {
    fontSize: 22,
  },
  categoryInfo: {
    flex: 1,
    marginLeft: THEME.spacing.sm,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.text,
  },
  categorySubtitle: {
    fontSize: 12,
    color: THEME.textMuted,
  },
  textLocked: {
    color: THEME.textMuted,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: THEME.spacing.sm,
  },
  countText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: THEME.spacing.sm,
    paddingTop: 0,
    gap: THEME.spacing.xs,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.backgroundSecondary,
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.borderRadius.full,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    gap: 4,
  },
  skillEmoji: {
    fontSize: 14,
  },
  skillName: {
    fontSize: 13,
    color: THEME.textSecondary,
  },
  skillNameSelected: {
    color: 'white',
    fontWeight: '500',
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: THEME.text,
    marginBottom: THEME.spacing.xs,
  },
  stepDescription: {
    fontSize: 14,
    color: THEME.textSecondary,
    marginBottom: THEME.spacing.lg,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing.sm,
  },
  optionCard: {
    width: '48%',
    backgroundColor: THEME.cardBg,
    borderRadius: THEME.borderRadius.large,
    padding: THEME.spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: THEME.cardBorder,
    position: 'relative',
  },
  optionEmoji: {
    fontSize: 32,
    marginBottom: THEME.spacing.xs,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text,
  },
  optionYears: {
    fontSize: 13,
    color: THEME.textSecondary,
    marginTop: 2,
  },
  optionDesc: {
    fontSize: 11,
    color: THEME.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
  checkCircle: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  areaOptions: {
    gap: THEME.spacing.sm,
  },
  areaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.cardBg,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.large,
    borderWidth: 2,
    borderColor: THEME.cardBorder,
  },
  areaCardSelected: {
    borderColor: THEME.primary,
    backgroundColor: THEME.primary + '08',
  },
  areaEmoji: {
    fontSize: 28,
    marginRight: THEME.spacing.md,
  },
  areaInfo: {
    flex: 1,
  },
  areaLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text,
  },
  areaLabelSelected: {
    color: THEME.primary,
  },
  areaDesc: {
    fontSize: 13,
    color: THEME.textMuted,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: THEME.cardBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: THEME.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: THEME.primary,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: THEME.backgroundSecondary,
    borderRadius: THEME.borderRadius.medium,
    padding: 4,
    marginBottom: THEME.spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.small,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: THEME.cardBg,
  },
  tabText: {
    fontSize: 13,
    color: THEME.textSecondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: THEME.primary,
    fontWeight: '600',
  },
  profileSection: {},
  tipText: {
    fontSize: 13,
    color: THEME.textSecondary,
    backgroundColor: THEME.backgroundSecondary,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.medium,
    marginBottom: THEME.spacing.md,
    lineHeight: 18,
  },
  bioInput: {
    backgroundColor: THEME.cardBg,
    borderRadius: THEME.borderRadius.medium,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    padding: THEME.spacing.md,
    fontSize: 15,
    color: THEME.text,
    minHeight: 150,
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: THEME.textMuted,
    marginTop: THEME.spacing.xs,
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
    gap: THEME.spacing.sm,
  },
  socialIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialInput: {
    flex: 1,
    backgroundColor: THEME.cardBg,
    borderRadius: THEME.borderRadius.medium,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    fontSize: 14,
    color: THEME.text,
  },
  addCertRow: {
    flexDirection: 'row',
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.md,
  },
  certInput: {
    flex: 1,
    backgroundColor: THEME.cardBg,
    borderRadius: THEME.borderRadius.medium,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    fontSize: 14,
    color: THEME.text,
  },
  addCertBtn: {
    width: 48,
    height: 48,
    borderRadius: THEME.borderRadius.medium,
    backgroundColor: THEME.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCertBtnDisabled: {
    backgroundColor: THEME.textMuted,
  },
  certItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.cardBg,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.medium,
    marginBottom: THEME.spacing.sm,
    gap: THEME.spacing.sm,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  certText: {
    flex: 1,
    fontSize: 14,
    color: THEME.text,
  },
  footer: {
    padding: THEME.spacing.md,
    backgroundColor: THEME.cardBg,
    borderTopWidth: 1,
    borderTopColor: THEME.cardBorder,
  },
  selectionSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing.sm,
    gap: THEME.spacing.xs,
  },
  summaryText: {
    fontSize: 13,
    color: THEME.success,
    fontWeight: '500',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.primary,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.borderRadius.medium,
    gap: THEME.spacing.sm,
  },
  nextButtonDisabled: {
    backgroundColor: THEME.textMuted,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
});
