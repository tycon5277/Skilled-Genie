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
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../../src/stores/authStore';
import { THEME } from '../../src/theme';
import {
  SKILL_CATEGORIES,
  EXPERIENCE_LEVELS,
  SOCIAL_PLATFORMS,
} from '../../src/data/skillCategories';

const STEPS = [
  { id: 1, title: 'Details', icon: 'person' },
  { id: 2, title: 'Skills', icon: 'construct' },
  { id: 3, title: 'Experience', icon: 'trophy' },
  { id: 4, title: 'Profile', icon: 'sparkles' },
];

const GENDER_OPTIONS = [
  { id: 'male', label: 'Male', icon: 'male' },
  { id: 'female', label: 'Female', icon: 'female' },
  { id: 'other', label: 'Other', icon: 'person' },
];

export default function RegisterScreen() {
  // Step state
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Step 1: Personal Details
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<string | null>(null);
  const [aadhaarCard, setAadhaarCard] = useState('');
  const [panCard, setPanCard] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Step 2: Skills
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Step 3: Experience
  const [experienceLevel, setExperienceLevel] = useState<string | null>(null);

  // Step 4: Profile
  const [bio, setBio] = useState('');
  const [socialLinks, setSocialLinks] = useState<{ [key: string]: string }>({});
  const [certifications, setCertifications] = useState<string[]>([]);
  const [newCertification, setNewCertification] = useState('');

  const { pendingPhone, register, error } = useAuthStore();

  // Image picker
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photos to upload a profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setProfileImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

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
        return name.trim().length >= 2;
      case 2:
        return selectedSkills.length > 0;
      case 3:
        return experienceLevel !== null;
      case 4:
        return true;
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

  // Step 1: Personal Details
  const renderStep1Details = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Personal Details</Text>
      <Text style={styles.stepDescription}>
        Tell us about yourself. Only name is required.
      </Text>

      {/* Profile Picture */}
      <View style={styles.profilePicSection}>
        <TouchableOpacity style={styles.profilePicContainer} onPress={pickImage}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profilePic} />
          ) : (
            <View style={styles.profilePicPlaceholder}>
              <Ionicons name="camera" size={32} color={THEME.textMuted} />
              <Text style={styles.profilePicText}>Add Photo</Text>
            </View>
          )}
          <View style={styles.profilePicBadge}>
            <Ionicons name="add" size={16} color="white" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Name Input - Required */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>
          Full Name <Text style={styles.required}>*</Text>
        </Text>
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

      {/* Date of Birth */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Date of Birth</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="calendar-outline" size={20} color={THEME.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="DD/MM/YYYY"
            placeholderTextColor={THEME.textMuted}
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            keyboardType="numeric"
            maxLength={10}
          />
        </View>
      </View>

      {/* Gender */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Gender</Text>
        <View style={styles.genderRow}>
          {GENDER_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.genderOption,
                gender === option.id && styles.genderOptionSelected,
              ]}
              onPress={() => setGender(option.id)}
            >
              <Ionicons
                name={option.icon as any}
                size={18}
                color={gender === option.id ? 'white' : THEME.textSecondary}
              />
              <Text
                style={[
                  styles.genderText,
                  gender === option.id && styles.genderTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Aadhaar Card */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Aadhaar Card Number</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="card-outline" size={20} color={THEME.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="XXXX XXXX XXXX"
            placeholderTextColor={THEME.textMuted}
            value={aadhaarCard}
            onChangeText={setAadhaarCard}
            keyboardType="numeric"
            maxLength={14}
          />
        </View>
      </View>

      {/* PAN Card */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>PAN Card Number</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="document-outline" size={20} color={THEME.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="ABCDE1234F"
            placeholderTextColor={THEME.textMuted}
            value={panCard}
            onChangeText={(text) => setPanCard(text.toUpperCase())}
            autoCapitalize="characters"
            maxLength={10}
          />
        </View>
      </View>
    </View>
  );

  // Step 2: Skills Selection
  const renderStep2Skills = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Select Your Skills</Text>
      <Text style={styles.stepDescription}>
        Choose skills from ONE category only
      </Text>

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

  // Step 3: Experience
  const renderStep3Experience = () => (
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

  // Step 4: Profile - Redesigned
  const renderStep4Profile = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Complete Your Profile</Text>
      <Text style={styles.stepDescription}>
        Stand out to customers with a great profile
      </Text>

      {/* Bio Section */}
      <View style={styles.profileCard}>
        <LinearGradient
          colors={[THEME.primary + '15', THEME.primaryLight + '10']}
          style={styles.profileCardHeader}
        >
          <View style={styles.profileCardIcon}>
            <Ionicons name="document-text" size={24} color={THEME.primary} />
          </View>
          <View style={styles.profileCardHeaderText}>
            <Text style={styles.profileCardTitle}>About You</Text>
            <Text style={styles.profileCardSubtitle}>Tell your story</Text>
          </View>
        </LinearGradient>
        <View style={styles.profileCardContent}>
          <TextInput
            style={styles.bioInput}
            placeholder="I'm a professional with X years of experience. I specialize in... My customers love me because..."
            placeholderTextColor={THEME.textMuted}
            value={bio}
            onChangeText={setBio}
            multiline
            maxLength={500}
            textAlignVertical="top"
          />
          <View style={styles.bioFooter}>
            <View style={styles.bioTip}>
              <Ionicons name="bulb" size={14} color={THEME.warning} />
              <Text style={styles.bioTipText}>A good bio increases bookings by 40%</Text>
            </View>
            <Text style={styles.charCount}>{bio.length}/500</Text>
          </View>
        </View>
      </View>

      {/* Social Links Section */}
      <View style={styles.profileCard}>
        <LinearGradient
          colors={[THEME.secondary + '15', THEME.secondaryLight + '10']}
          style={styles.profileCardHeader}
        >
          <View style={[styles.profileCardIcon, { backgroundColor: THEME.secondary + '20' }]}>
            <Ionicons name="share-social" size={24} color={THEME.secondary} />
          </View>
          <View style={styles.profileCardHeaderText}>
            <Text style={styles.profileCardTitle}>Social Links</Text>
            <Text style={styles.profileCardSubtitle}>Showcase your work</Text>
          </View>
        </LinearGradient>
        <View style={styles.profileCardContent}>
          {SOCIAL_PLATFORMS.map((platform) => (
            <View key={platform.id} style={styles.socialInputRow}>
              <View style={[styles.socialIconSmall, { backgroundColor: platform.color + '15' }]}>
                <Ionicons name={platform.icon as any} size={18} color={platform.color} />
              </View>
              <TextInput
                style={styles.socialInputField}
                placeholder={platform.placeholder}
                placeholderTextColor={THEME.textMuted}
                value={socialLinks[platform.id] || ''}
                onChangeText={(text) => setSocialLinks({ ...socialLinks, [platform.id]: text })}
                autoCapitalize="none"
              />
            </View>
          ))}
        </View>
      </View>

      {/* Certifications Section */}
      <View style={styles.profileCard}>
        <LinearGradient
          colors={[THEME.success + '15', THEME.accentLight + '10']}
          style={styles.profileCardHeader}
        >
          <View style={[styles.profileCardIcon, { backgroundColor: THEME.success + '20' }]}>
            <Ionicons name="ribbon" size={24} color={THEME.success} />
          </View>
          <View style={styles.profileCardHeaderText}>
            <Text style={styles.profileCardTitle}>Certifications</Text>
            <Text style={styles.profileCardSubtitle}>Build trust & credibility</Text>
          </View>
        </LinearGradient>
        <View style={styles.profileCardContent}>
          <View style={styles.certInputRow}>
            <TextInput
              style={styles.certInputField}
              placeholder="e.g., Licensed Electrician, ISO Certified"
              placeholderTextColor={THEME.textMuted}
              value={newCertification}
              onChangeText={setNewCertification}
              onSubmitEditing={addCertification}
            />
            <TouchableOpacity
              style={[styles.certAddBtn, !newCertification.trim() && styles.certAddBtnDisabled]}
              onPress={addCertification}
              disabled={!newCertification.trim()}
            >
              <Ionicons name="add" size={22} color="white" />
            </TouchableOpacity>
          </View>
          
          {certifications.length > 0 && (
            <View style={styles.certsList}>
              {certifications.map((cert, index) => (
                <View key={index} style={styles.certTag}>
                  <Ionicons name="checkmark-circle" size={16} color={THEME.success} />
                  <Text style={styles.certTagText}>{cert}</Text>
                  <TouchableOpacity 
                    onPress={() => removeCertification(index)}
                    style={styles.certRemoveBtn}
                  >
                    <Ionicons name="close" size={16} color={THEME.textMuted} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
          
          {certifications.length === 0 && (
            <View style={styles.emptyCerts}>
              <Ionicons name="medal-outline" size={32} color={THEME.textMuted} />
              <Text style={styles.emptyCertsText}>Add certifications to stand out</Text>
            </View>
          )}
        </View>
      </View>
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
          {currentStep === 1 && renderStep1Details()}
          {currentStep === 2 && renderStep2Skills()}
          {currentStep === 3 && renderStep3Experience()}
          {currentStep === 4 && renderStep4Profile()}
        </ScrollView>

        {/* Footer Button */}
        <View style={styles.footer}>
          {selectedSkills.length > 0 && currentStep === 2 && (
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
    width: 32,
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
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: THEME.text,
    marginBottom: THEME.spacing.xs,
  },
  stepDescription: {
    fontSize: 14,
    color: THEME.textSecondary,
    marginBottom: THEME.spacing.lg,
  },

  // Step 1: Personal Details
  profilePicSection: {
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
  },
  profilePicContainer: {
    position: 'relative',
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profilePicPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: THEME.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: THEME.cardBorder,
    borderStyle: 'dashed',
  },
  profilePicText: {
    fontSize: 11,
    color: THEME.textMuted,
    marginTop: 4,
  },
  profilePicBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: THEME.background,
  },
  inputGroup: {
    marginBottom: THEME.spacing.md,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.text,
    marginBottom: THEME.spacing.xs,
  },
  required: {
    color: THEME.error,
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
  genderRow: {
    flexDirection: 'row',
    gap: THEME.spacing.sm,
  },
  genderOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.cardBg,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.medium,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    gap: 6,
  },
  genderOptionSelected: {
    backgroundColor: THEME.primary,
    borderColor: THEME.primary,
  },
  genderText: {
    fontSize: 14,
    color: THEME.textSecondary,
  },
  genderTextSelected: {
    color: 'white',
    fontWeight: '600',
  },

  // Step 2: Skills
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

  // Step 3: Experience
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

  // Step 4: Profile - Redesigned
  profileCard: {
    backgroundColor: THEME.cardBg,
    borderRadius: THEME.borderRadius.xl,
    marginBottom: THEME.spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  profileCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.spacing.md,
    gap: THEME.spacing.sm,
  },
  profileCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: THEME.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCardHeaderText: {
    flex: 1,
  },
  profileCardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: THEME.text,
  },
  profileCardSubtitle: {
    fontSize: 13,
    color: THEME.textSecondary,
  },
  profileCardContent: {
    padding: THEME.spacing.md,
    paddingTop: 0,
  },
  bioInput: {
    backgroundColor: THEME.backgroundSecondary,
    borderRadius: THEME.borderRadius.medium,
    padding: THEME.spacing.md,
    fontSize: 15,
    color: THEME.text,
    minHeight: 120,
    lineHeight: 22,
  },
  bioFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: THEME.spacing.sm,
  },
  bioTip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bioTipText: {
    fontSize: 11,
    color: THEME.textMuted,
  },
  charCount: {
    fontSize: 12,
    color: THEME.textMuted,
  },
  socialInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
    gap: THEME.spacing.sm,
  },
  socialIconSmall: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialInputField: {
    flex: 1,
    backgroundColor: THEME.backgroundSecondary,
    borderRadius: THEME.borderRadius.medium,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    fontSize: 14,
    color: THEME.text,
  },
  certInputRow: {
    flexDirection: 'row',
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.md,
  },
  certInputField: {
    flex: 1,
    backgroundColor: THEME.backgroundSecondary,
    borderRadius: THEME.borderRadius.medium,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    fontSize: 14,
    color: THEME.text,
  },
  certAddBtn: {
    width: 44,
    height: 44,
    borderRadius: THEME.borderRadius.medium,
    backgroundColor: THEME.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  certAddBtnDisabled: {
    backgroundColor: THEME.textMuted,
  },
  certsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing.sm,
  },
  certTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.success + '12',
    paddingVertical: THEME.spacing.xs,
    paddingLeft: THEME.spacing.sm,
    paddingRight: THEME.spacing.xs,
    borderRadius: THEME.borderRadius.full,
    gap: 6,
  },
  certTagText: {
    fontSize: 13,
    color: THEME.text,
    fontWeight: '500',
  },
  certRemoveBtn: {
    padding: 4,
  },
  emptyCerts: {
    alignItems: 'center',
    padding: THEME.spacing.lg,
  },
  emptyCertsText: {
    fontSize: 13,
    color: THEME.textMuted,
    marginTop: THEME.spacing.xs,
  },

  // Footer
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
