/**
 * Shared utility for centralized, bidirectional grade selection and backfill bounding.
 * Guarantees that:
 * 1. Early grades (e.g. Grade 1) never leak higher-grade content (maxGrade <= targetGrade).
 * 2. Higher grades (e.g. Grade 5+) never leak lower elementary content (minGrade >= targetGrade - drop).
 */

/**
 * Computes strictly clamped [minGrade, maxGrade] selection bounds for question filtering.
 *
 * @param {number|string} targetGrade - The student's current target grade (clamped 1 to 8).
 * @param {'exact'|'immediate'|'extended'|number} tier - The selection tier:
 *   - 'exact' (0): Strictly the target grade [targetGrade, targetGrade]
 *   - 'immediate' (1): Immediate prior grade window [max(1, targetGrade - 1), targetGrade]
 *   - 'extended' (2): Maximum 2-grade bounded window [max(1, targetGrade - 2), targetGrade]
 * @returns {{ minGrade: number, maxGrade: number, isWithinBounds: (grade: number|string) => boolean }}
 */
export function getGradeSelectionBounds(targetGrade, tier = 'immediate') {
  const targetG = Math.min(Math.max(Number(targetGrade) || 1, 1), 8)

  let minGrade = targetG
  let maxGrade = targetG

  if (tier === 'exact' || tier === 0) {
    minGrade = targetG
    maxGrade = targetG
  } else if (tier === 'immediate' || tier === 1) {
    minGrade = Math.max(1, targetG - 1)
    maxGrade = targetG
  } else if (tier === 'extended' || tier === 2 || tier === 'fallback') {
    minGrade = Math.max(1, targetG - 2)
    maxGrade = targetG
  }

  return {
    minGrade,
    maxGrade,
    isWithinBounds: (grade) => {
      const g = Number(grade)
      return Number.isFinite(g) && g >= minGrade && g <= maxGrade
    },
  }
}

/**
 * Shared SQL condition ensuring only questions with valid explanation and distractor diagnostics are queried.
 */
export const DIAGNOSTICS_SQL_CONDITION = "q.explanation IS NOT NULL AND TRIM(q.explanation) != '' AND q.distractor_diagnostics IS NOT NULL AND TRIM(q.distractor_diagnostics) != ''"

/**
 * Shared validation utility checking if a question object has valid explanation and distractor diagnostics.
 * @param {Object} q - Question candidate object
 * @returns {boolean}
 */
export function hasDiagnostics(q) {
  if (!q) return false
  const hasExpl = Boolean(q.explanation && String(q.explanation).trim() !== '')
  const hasDiag = Boolean(
    q.distractor_diagnostics &&
    (typeof q.distractor_diagnostics === 'object' || String(q.distractor_diagnostics).trim() !== '')
  )
  return hasExpl && hasDiag
}
