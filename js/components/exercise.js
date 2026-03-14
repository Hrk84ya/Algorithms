/**
 * Exercise Panel — renders interactive exercises per algorithm.
 *
 * Supports three exercise types: multiple-choice, predict-output, fill-blank.
 * Provides immediate correct/incorrect feedback, hints on wrong answers,
 * session attempt tracking, and marks exercises completed via progress tracker.
 * All form controls have ARIA labels for accessibility.
 */

import { markExerciseCompleted } from './progress.js';

/**
 * Session-level attempt counters. Reset when renderExercises is called.
 * @type {{ correct: number, incorrect: number }}
 */
let sessionAttempts = { correct: 0, incorrect: 0 };

/**
 * Returns the current session attempt counts.
 * @returns {{ correct: number, incorrect: number }}
 */
export function getSessionAttempts() {
  return { ...sessionAttempts };
}

/**
 * Renders all exercises for an algorithm into the given container.
 * @param {HTMLElement} container
 * @param {Array<Object>} exercises - Exercise definitions from manifest
 * @param {(exerciseId: string) => void} [onComplete] - Callback when exercise is completed
 */
export function renderExercises(container, exercises, onComplete) {
  container.innerHTML = '';
  sessionAttempts = { correct: 0, incorrect: 0 };

  if (!Array.isArray(exercises) || exercises.length === 0) {
    const msg = document.createElement('p');
    msg.className = 'no-results';
    msg.textContent = 'No exercises available.';
    container.appendChild(msg);
    return;
  }

  const attemptDisplay = document.createElement('div');
  attemptDisplay.className = 'exercise-attempts';
  attemptDisplay.setAttribute('aria-live', 'polite');
  attemptDisplay.setAttribute('aria-label', 'Session attempt counts');
  updateAttemptDisplay(attemptDisplay);
  container.appendChild(attemptDisplay);

  exercises.forEach((exercise) => {
    const card = renderExerciseCard(exercise, attemptDisplay, onComplete);
    container.appendChild(card);
  });
}

/**
 * Updates the attempt counter display.
 * @param {HTMLElement} el
 */
function updateAttemptDisplay(el) {
  el.textContent = `Correct: ${sessionAttempts.correct} | Incorrect: ${sessionAttempts.incorrect}`;
}

/**
 * Renders a single exercise card.
 * @param {Object} exercise
 * @param {HTMLElement} attemptDisplay
 * @param {(exerciseId: string) => void} [onComplete]
 * @returns {HTMLElement}
 */
function renderExerciseCard(exercise, attemptDisplay, onComplete) {
  const card = document.createElement('div');
  card.className = 'exercise-card';
  card.setAttribute('data-exercise-id', exercise.id);

  const question = document.createElement('p');
  question.className = 'exercise-question';
  question.textContent = exercise.question;
  card.appendChild(question);

  const form = document.createElement('form');
  form.className = 'exercise-form';
  form.setAttribute('aria-label', `Exercise: ${exercise.question}`);

  const feedbackEl = document.createElement('div');
  feedbackEl.className = 'exercise-feedback';
  feedbackEl.setAttribute('aria-live', 'assertive');
  feedbackEl.setAttribute('role', 'status');

  let answered = false;

  if (exercise.type === 'multiple-choice') {
    renderMultipleChoice(form, exercise);
  } else {
    renderTextInput(form, exercise);
  }

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'exercise-submit';
  submitBtn.textContent = 'Submit';
  submitBtn.setAttribute('aria-label', 'Submit answer');
  form.appendChild(submitBtn);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (answered) return;

    const userAnswer = getAnswer(form, exercise);
    if (userAnswer === null || userAnswer.trim() === '') return;

    const isCorrect = checkAnswer(userAnswer, exercise.answer);
    answered = true;
    submitBtn.disabled = true;
    disableInputs(form);

    if (isCorrect) {
      sessionAttempts.correct++;
      feedbackEl.innerHTML = '';
      const msg = document.createElement('span');
      msg.className = 'feedback-correct';
      msg.textContent = 'Correct!';
      feedbackEl.appendChild(msg);
      markExerciseCompleted(exercise.id);
      if (typeof onComplete === 'function') onComplete(exercise.id);
    } else {
      sessionAttempts.incorrect++;
      feedbackEl.innerHTML = '';
      const msg = document.createElement('span');
      msg.className = 'feedback-incorrect';
      msg.textContent = 'Incorrect.';
      feedbackEl.appendChild(msg);
      if (exercise.hint) {
        const hint = document.createElement('p');
        hint.className = 'exercise-hint';
        hint.textContent = `Hint: ${exercise.hint}`;
        feedbackEl.appendChild(hint);
      }
    }

    updateAttemptDisplay(attemptDisplay);
  });

  card.appendChild(form);
  card.appendChild(feedbackEl);
  return card;
}

/**
 * Renders multiple-choice radio options.
 */
function renderMultipleChoice(form, exercise) {
  const fieldset = document.createElement('fieldset');
  const legend = document.createElement('legend');
  legend.className = 'sr-only';
  legend.textContent = 'Choose an answer';
  fieldset.appendChild(legend);

  (exercise.options || []).forEach((option, i) => {
    const label = document.createElement('label');
    label.className = 'exercise-option';

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = `exercise-${exercise.id}`;
    radio.value = option;
    radio.setAttribute('aria-label', option);

    label.appendChild(radio);
    label.appendChild(document.createTextNode(` ${option}`));
    fieldset.appendChild(label);
  });

  form.appendChild(fieldset);
}

/**
 * Renders a text input for predict-output and fill-blank types.
 */
function renderTextInput(form, exercise) {
  const label = document.createElement('label');
  label.className = 'exercise-input-label';

  const labelText = exercise.type === 'fill-blank' ? 'Your answer:' : 'Your prediction:';
  label.textContent = labelText;

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'exercise-input';
  input.name = `exercise-${exercise.id}`;
  input.setAttribute('aria-label', labelText);
  input.placeholder = exercise.type === 'fill-blank' ? 'Fill in the blank…' : 'Enter your answer…';

  label.appendChild(input);
  form.appendChild(label);
}

/**
 * Extracts the user's answer from the form.
 */
function getAnswer(form, exercise) {
  if (exercise.type === 'multiple-choice') {
    const selected = form.querySelector(`input[name="exercise-${exercise.id}"]:checked`);
    return selected ? selected.value : null;
  }
  const input = form.querySelector(`input[name="exercise-${exercise.id}"]`);
  return input ? input.value : null;
}

/**
 * Compares user answer to expected answer (case-insensitive, trimmed).
 */
function checkAnswer(userAnswer, expected) {
  return userAnswer.trim().toLowerCase() === expected.trim().toLowerCase();
}

/**
 * Disables all inputs in a form after submission.
 */
function disableInputs(form) {
  form.querySelectorAll('input').forEach((input) => { input.disabled = true; });
}
