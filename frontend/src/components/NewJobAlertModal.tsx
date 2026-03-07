import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, Vibration } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { THEME, SERVICE_ICONS, SERVICE_COLORS } from '../theme';
import { Job } from '../stores/serviceStore';

interface NewJobAlertModalProps {
  visible: boolean;
  job: Job | null;
  onAccept: () => void;
  onDismiss: () => void;
}

export const NewJobAlertModal: React.FC<NewJobAlertModalProps> = ({
  visible,
  job,
  onAccept,
  onDismiss,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible && job) {
      // Trigger haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Vibration.vibrate([0, 200, 100, 200]);

      // Animate in
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Pulse animation
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();

      // Auto dismiss after 30 seconds
      const timeout = setTimeout(() => {
        onDismiss();
      }, 30000);

      return () => {
        pulse.stop();
        clearTimeout(timeout);
      };
    } else {
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
    }
  }, [visible, job]);

  if (!job) return null;

  const serviceColor = SERVICE_COLORS[job.service_type] || SERVICE_COLORS.other;
  const serviceIcon = SERVICE_ICONS[job.service_type] || SERVICE_ICONS.other;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <LinearGradient
            colors={[serviceColor, serviceColor + 'DD']}
            style={styles.header}
          >
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NEW JOB</Text>
            </View>
            <Animated.View
              style={[
                styles.iconWrapper,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <Ionicons name={serviceIcon as any} size={48} color="white" />
            </Animated.View>
            <Text style={styles.serviceType}>
              {job.service_type.charAt(0).toUpperCase() + job.service_type.slice(1)}
            </Text>
          </LinearGradient>

          <View style={styles.content}>
            <View style={styles.paySection}>
              <Text style={styles.payLabel}>Estimated Pay</Text>
              <Text style={styles.payAmount}>${job.estimated_pay.toFixed(0)}</Text>
            </View>

            <Text style={styles.description} numberOfLines={2}>
              {job.description}
            </Text>

            <View style={styles.detailsRow}>
              <View style={styles.detail}>
                <Ionicons name="location" size={18} color={THEME.textSecondary} />
                <Text style={styles.detailText}>{job.distance_km} km away</Text>
              </View>
              <View style={styles.detail}>
                <Ionicons name="time" size={18} color={THEME.textSecondary} />
                <Text style={styles.detailText}>~{job.estimated_duration} min</Text>
              </View>
            </View>

            <View style={styles.customerInfo}>
              <Ionicons name="person-circle" size={20} color={THEME.textSecondary} />
              <Text style={styles.customerName}>{job.customer.name}</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.dismissButton}
              onPress={onDismiss}
              activeOpacity={0.7}
            >
              <Text style={styles.dismissButtonText}>Later</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.acceptButton, { backgroundColor: serviceColor }]}
              onPress={onAccept}
              activeOpacity={0.7}
            >
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text style={styles.acceptButtonText}>Accept Job</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.lg,
  },
  modalContainer: {
    backgroundColor: THEME.cardBg,
    borderRadius: THEME.borderRadius.xl,
    width: '100%',
    maxWidth: 360,
    overflow: 'hidden',
    ...THEME.shadow.large,
  },
  header: {
    padding: THEME.spacing.lg,
    alignItems: 'center',
  },
  newBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.borderRadius.full,
    marginBottom: THEME.spacing.sm,
  },
  newBadgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
  },
  serviceType: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
  content: {
    padding: THEME.spacing.lg,
    gap: THEME.spacing.md,
  },
  paySection: {
    alignItems: 'center',
  },
  payLabel: {
    fontSize: 12,
    color: THEME.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  payAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: THEME.primary,
  },
  description: {
    fontSize: 15,
    color: THEME.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: THEME.spacing.lg,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: THEME.textSecondary,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  customerName: {
    fontSize: 14,
    color: THEME.textSecondary,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    padding: THEME.spacing.md,
    gap: THEME.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: THEME.cardBorder,
  },
  dismissButton: {
    flex: 1,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.borderRadius.medium,
    backgroundColor: THEME.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.textSecondary,
  },
  acceptButton: {
    flex: 2,
    flexDirection: 'row',
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
});
