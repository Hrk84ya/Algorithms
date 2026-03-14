/**
 * Progress Tracker — reads/writes student progress to localStorage.
 *
 * localStorage key: "algo-learn-progress"
 * Format: { visitedAlgorithms: string[], completedExercises: string[] }
 *
 * Returns ProgressData with Sets for efficient lookup.
 * Graceful degradation: if localStorage is unavailable (private browsing,
 * quota exceeded), an in-memory fallback is used for the session.
 *
 * @typedef {Object} ProgressData
 * @property {Set<string>} visitedAlgorithms - Set of algorithm IDs
 * @property {Set<string>} completedExercises - Set of exercise IDs
 */

const STORAGE_KEY = 'algo-learn-progress';

/** Module-level in-memory fallback when localStorage is unavailable. */
let fallbackStore = null;

/**
 * Check whether localStorage is available and functional.
 * @returns {boolean}
 */
function isLocalStorageAvailable() {
  try {
    const testKey = '__progress_test__';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Read raw JSON string from storage (localStorage or fallback).
 * @returns {string|null}
 */
function readRaw() {
  if (isLocalStorageAvailable()) {
    return localStorage.getItem(STORAGE_KEY);
  }
  return fallbackStore;
}

/**
 * Write raw JSON string to storage (localStorage or fallback).
 * @param {string} json
 */
function writeRaw(json) {
  if (isLocalStorageAvailable()) {
    localStorage.setItem(STORAGE_KEY, json);
  } else {
    fallbackStore = json;
  }
}

/**
 * Remove the progress key from storage entirely.
 */
function removeRaw() {
  if (isLocalStorageAvailable()) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    fallbackStore = null;
  }
}

/**
 * Loads progress from storage. Returns ProgressData with Sets.
 * If storage is empty or data is corrupt, returns empty sets.
 * @returns {ProgressData}
 */
export function loadProgress() {
  try {
    const raw = readRaw();
    if (!raw) {
      return { visitedAlgorithms: new Set(), completedExercises: new Set() };
    }
    const parsed = JSON.parse(raw);
    return {
      visitedAlgorithms: new Set(Array.isArray(parsed.visitedAlgorithms) ? parsed.visitedAlgorithms : []),
      completedExercises: new Set(Array.isArray(parsed.completedExercises) ? parsed.completedExercises : []),
    };
  } catch {
    return { visitedAlgorithms: new Set(), completedExercises: new Set() };
  }
}

/**
 * Serializes ProgressData (with Sets) to JSON-friendly format and saves.
 * @param {ProgressData} progress
 */
function saveProgress(progress) {
  const data = {
    visitedAlgorithms: [...progress.visitedAlgorithms],
    completedExercises: [...progress.completedExercises],
  };
  writeRaw(JSON.stringify(data));
}

/**
 * Marks an algorithm as visited.
 * @param {string} algorithmId
 */
export function markVisited(algorithmId) {
  const progress = loadProgress();
  progress.visitedAlgorithms.add(algorithmId);
  saveProgress(progress);
}

/**
 * Marks an exercise as completed.
 * @param {string} exerciseId
 */
export function markExerciseCompleted(exerciseId) {
  const progress = loadProgress();
  progress.completedExercises.add(exerciseId);
  saveProgress(progress);
}

/**
 * Clears all progress data by removing the storage key entirely.
 */
export function resetProgress() {
  removeRaw();
}

/**
 * Computes progress stats for a given category.
 *
 * @param {import('../../js/state.js').AppState} state - App state with algorithms array
 * @param {string} category - Category to filter by
 * @param {ProgressData} progress - Current progress data
 * @returns {{ visited: number, total: number, exercisesCompleted: number, exercisesTotal: number }}
 */
export function getProgressForCategory(state, category, progress) {
  const algos = state.algorithms.filter(a => a.category === category);
  const total = algos.length;
  const visited = algos.filter(a => progress.visitedAlgorithms.has(a.id)).length;

  let exercisesTotal = 0;
  let exercisesCompleted = 0;

  for (const algo of algos) {
    const exercises = Array.isArray(algo.exercises) ? algo.exercises : [];
    exercisesTotal += exercises.length;
    exercisesCompleted += exercises.filter(ex => progress.completedExercises.has(ex.id)).length;
  }

  return { visited, total, exercisesCompleted, exercisesTotal };
}
