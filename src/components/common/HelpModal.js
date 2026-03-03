import { View, Pressable, Modal, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from './Text';
import { COLORS, SPACING, RADIUS, FONT_SIZE, FONT_FAMILY, SHADOW } from '../../theme/theme';

/**
 * Help content per screen, bilingual.
 * Each screen has an array of sections with icon, title, and text.
 */
const HELP_CONTENT = {
  programs: {
    en: {
      screenTitle: 'Programs',
      sections: [
        {
          icon: 'layers',
          title: 'What are programs?',
          text: 'Programs are collections of workouts. Create one for each training split (e.g. Push/Pull/Legs, Upper/Lower).',
        },
        {
          icon: 'check-circle',
          title: 'Select a program',
          text: 'Tap the radio button on the left to select a program. Its workouts will appear in the Workouts tab.',
        },
        {
          icon: 'chevron-down',
          title: 'Preview workouts',
          text: 'Tap the chevron on the right to expand a program and see all its workouts at a glance.',
        },
        {
          icon: 'edit-2',
          title: 'Edit mode',
          text: 'Tap the pencil button at the bottom to add, delete, or rename programs. You can also add notes and set training frequency.',
        },
      ],
    },
    fr: {
      screenTitle: 'Programmes',
      sections: [
        {
          icon: 'layers',
          title: "Qu'est-ce qu'un programme ?",
          text: "Un programme regroupe vos séances. Créez-en un pour chaque split (ex. Push/Pull/Legs, Haut/Bas).",
        },
        {
          icon: 'check-circle',
          title: 'Sélectionner un programme',
          text: "Appuyez sur le bouton radio à gauche pour sélectionner un programme. Ses séances apparaîtront dans l'onglet Séances.",
        },
        {
          icon: 'chevron-down',
          title: 'Aperçu des séances',
          text: "Appuyez sur le chevron à droite pour déplier un programme et voir toutes ses séances.",
        },
        {
          icon: 'edit-2',
          title: 'Mode édition',
          text: "Appuyez sur le crayon en bas pour ajouter, supprimer ou renommer vos programmes. Vous pouvez aussi ajouter des notes et définir la fréquence.",
        },
      ],
    },
  },
  workouts: {
    en: {
      screenTitle: 'Workouts',
      sections: [
        {
          icon: 'zap',
          title: 'Start a session',
          text: 'Tap any workout card to open it and start filling in your sets.',
        },
        {
          icon: 'chevron-down',
          title: 'Preview exercises',
          text: 'Tap the chevron to expand a card and see all exercises inside.',
        },
        {
          icon: 'clock',
          title: 'Time badges',
          text: 'The badge on each card shows when you last completed that workout — green for recent, orange for a while ago, red for overdue.',
        },
        {
          icon: 'edit-2',
          title: 'Edit mode',
          text: 'Use the pencil button to add new workouts or delete existing ones.',
        },
      ],
    },
    fr: {
      screenTitle: 'Séances',
      sections: [
        {
          icon: 'zap',
          title: 'Lancer une séance',
          text: "Appuyez sur une carte pour l'ouvrir et commencer à remplir vos séries.",
        },
        {
          icon: 'chevron-down',
          title: 'Aperçu des exercices',
          text: "Appuyez sur le chevron pour voir tous les exercices d'une séance.",
        },
        {
          icon: 'clock',
          title: 'Badges de temps',
          text: "Le badge indique quand vous avez fait cette séance — vert si récent, orange si ça fait un moment, rouge si en retard.",
        },
        {
          icon: 'edit-2',
          title: 'Mode édition',
          text: "Utilisez le crayon pour ajouter ou supprimer des séances.",
        },
      ],
    },
  },
  workout: {
    en: {
      screenTitle: 'Inside a Workout',
      sections: [
        {
          icon: 'grid',
          title: 'Fill in your sets',
          text: 'Tap any cell to enter weight, reps, or RIR. A completed set turns green.',
        },
        {
          icon: 'chevrons-right',
          title: 'Previous / Current / Next',
          text: 'Use the view selector to see your last session, fill in the current one, or plan your next.',
        },
        {
          icon: 'clock',
          title: 'Rest timer',
          text: 'Each exercise has a rest timer. Tap the timer icon at the bottom of an exercise to start the countdown.',
        },
        {
          icon: 'target',
          title: 'Rep range',
          text: 'The target rep range is shown at the bottom of each exercise. Edit it in edit mode.',
        },
        {
          icon: 'repeat',
          title: 'Units',
          text: 'Toggle between kg and lbs with the unit switch at the bottom of each exercise.',
        },
        {
          icon: 'edit-2',
          title: 'Edit mode',
          text: 'Tap the pencil to add/remove exercises and sets, rename exercises, and adjust rest timers.',
        },
      ],
    },
    fr: {
      screenTitle: "Dans une séance",
      sections: [
        {
          icon: 'grid',
          title: 'Remplir vos séries',
          text: "Appuyez sur une cellule pour entrer le poids, les reps ou le RIR. Une série complétée passe en vert.",
        },
        {
          icon: 'chevrons-right',
          title: 'Précédent / Actuel / Suivant',
          text: "Utilisez le sélecteur de vue pour voir la dernière séance, remplir l'actuelle, ou planifier la suivante.",
        },
        {
          icon: 'clock',
          title: 'Timer de repos',
          text: "Chaque exercice a un timer de repos. Appuyez sur l'icône timer en bas d'un exercice pour lancer le décompte.",
        },
        {
          icon: 'target',
          title: 'Fourchette de reps',
          text: "La fourchette cible est affichée en bas de chaque exercice. Modifiez-la en mode édition.",
        },
        {
          icon: 'repeat',
          title: 'Unités',
          text: "Basculez entre kg et lbs avec le bouton en bas de chaque exercice.",
        },
        {
          icon: 'edit-2',
          title: 'Mode édition',
          text: "Appuyez sur le crayon pour ajouter/supprimer des exercices et séries, renommer, et ajuster les timers.",
        },
      ],
    },
  },
  graphs: {
    en: {
      screenTitle: 'Graphs',
      sections: [
        {
          icon: 'trending-up',
          title: 'Tonnage progression',
          text: 'Each card shows the total tonnage (weight × reps) trend for a workout over time.',
        },
        {
          icon: 'arrow-up',
          title: 'Percentage badge',
          text: 'The green/red badge shows your overall progression between your first and most recent session.',
        },
        {
          icon: 'bar-chart-2',
          title: 'Detailed breakdown',
          text: 'Tap a card to see the tonnage breakdown per exercise, with session-by-session trends.',
        },
      ],
    },
    fr: {
      screenTitle: 'Graphiques',
      sections: [
        {
          icon: 'trending-up',
          title: 'Progression du tonnage',
          text: "Chaque carte montre l'évolution du tonnage total (poids × reps) par séance.",
        },
        {
          icon: 'arrow-up',
          title: 'Badge de progression',
          text: "Le badge vert/rouge montre votre progression globale entre votre première et votre dernière séance.",
        },
        {
          icon: 'bar-chart-2',
          title: 'Détail par exercice',
          text: "Appuyez sur une carte pour voir le tonnage détaillé par exercice, avec les tendances séance par séance.",
        },
      ],
    },
  },
  graphDetail: {
    en: {
      screenTitle: 'Graph Detail',
      sections: [
        {
          icon: 'trending-up',
          title: 'Overall trend',
          text: 'The top chart shows your total tonnage progression across all exercises for this workout.',
        },
        {
          icon: 'list',
          title: 'Per-exercise breakdown',
          text: 'Each exercise has its own mini chart showing how your tonnage evolved session by session.',
        },
        {
          icon: 'arrow-up',
          title: 'Session-by-session badges',
          text: 'The percentage badges here compare each session to the previous one, so you can track your progress over time.',
        },
      ],
    },
    fr: {
      screenTitle: 'Détail du graphique',
      sections: [
        {
          icon: 'trending-up',
          title: 'Tendance globale',
          text: "Le graphique principal montre l'évolution de votre tonnage total pour cette séance.",
        },
        {
          icon: 'list',
          title: 'Détail par exercice',
          text: "Chaque exercice a son propre mini graphique montrant l'évolution du tonnage séance par séance.",
        },
        {
          icon: 'arrow-up',
          title: 'Badges séance par séance',
          text: "Les badges ici comparent chaque séance à la précédente, pour suivre votre progression dans le temps.",
        },
      ],
    },
  },
};

/**
 * HelpModal — contextual help bottom sheet.
 *
 * @param {boolean} visible    - Whether the modal is shown.
 * @param {Function} onClose   - Close callback.
 * @param {string} screen      - Current screen key: 'programs' | 'workouts' | 'workout' | 'graphs'
 * @param {string} lang        - Language: 'en' | 'fr'
 * @param {Function} onToggleLang - Toggle language callback.
 */
export default function HelpModal({ visible, onClose, screen = 'programs', lang = 'en', onToggleLang }) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const content = HELP_CONTENT[screen];
  if (!content) return null;

  const t = content[lang] || content.en;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={[styles.sheet, { maxHeight: height * 0.75, paddingBottom: Math.max(insets.bottom, SPACING.lg) }]} onPress={() => {}}>
          {/* Handle bar */}
          <View style={styles.handleBar} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.screenTitle}>{t.screenTitle}</Text>
            <View style={styles.headerRight}>
              <Pressable style={styles.langPill} onPress={onToggleLang}>
                <Text style={styles.langText}>{lang === 'en' ? 'FR' : 'EN'}</Text>
              </Pressable>
              <Pressable style={styles.closeBtn} onPress={onClose}>
                <Feather name="x" size={20} color={COLORS.textSecondary} />
              </Pressable>
            </View>
          </View>

          {/* Sections */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {t.sections.map((section, index) => (
              <View key={index} style={styles.section}>
                <View style={styles.iconCircle}>
                  <Feather name={section.icon} size={18} color={COLORS.textPrimary} />
                </View>
                <View style={styles.sectionBody}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  <Text style={styles.sectionText}>{section.text}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Done button */}
          <Pressable
            style={({ pressed }) => [styles.doneBtn, pressed && styles.doneBtnPressed]}
            onPress={onClose}
          >
            <Text style={styles.doneBtnText}>{lang === 'fr' ? 'Compris !' : 'Got it!'}</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingHorizontal: SPACING.lg,
  },
  handleBar: {
    width: 36,
    height: 4,
    backgroundColor: COLORS.lightGray,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: SPACING.smd,
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  screenTitle: {
    fontSize: FONT_SIZE.xl,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: SPACING.sm,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  langPill: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.smd,
    backgroundColor: COLORS.lightGray,
    borderRadius: RADIUS.sm,
  },
  langText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textSecondary,
  },
  closeBtn: {
    padding: SPACING.xs,
  },
  scrollView: {
    flexGrow: 1,
    flexShrink: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.md,
  },
  section: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.smd,
    marginTop: 2,
  },
  sectionBody: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xxs,
  },
  sectionText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  doneBtn: {
    backgroundColor: COLORS.textPrimary,
    paddingVertical: SPACING.smd,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  doneBtnPressed: {
    opacity: 0.85,
  },
  doneBtnText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.white,
  },
});