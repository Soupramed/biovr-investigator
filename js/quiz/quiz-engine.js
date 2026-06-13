/* ============================================================
   BioVR-Investigator — Quiz Engine
   Interactive quiz with timer, scoring, and animated feedback
   ============================================================ */

import { questions, getShuffledQuestions, getGrade } from './quiz-data.js';
import { initNavigation } from '/js/main.js';

/* ── State ── */
const state = {
  activeQuestions: [], // Shuffled questions for the current session
  currentIndex: 0,
  answers: [], // Will be initialized when quiz starts
  answered: [], // Will be initialized when quiz starts
  timerInterval: null,
  timeLeft: 30,
  quizStarted: false,
  quizFinished: false,
};

const TIMER_DURATION = 30; // seconds per question
const STORAGE_KEY = 'biovr-quiz-best-score';
const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

/* ── DOM References ── */
const $startScreen    = document.getElementById('quiz-start-screen');
const $startBtn       = document.getElementById('quiz-start-btn');
const $progressWrap   = document.getElementById('quiz-progress-wrapper');
const $progressFill   = document.getElementById('quiz-progress-fill');
const $currentNum     = document.getElementById('quiz-current-num');
const $totalNum       = document.getElementById('quiz-total-num');
const $timerWrap      = document.getElementById('quiz-timer-wrapper');
const $timerFill      = document.getElementById('quiz-timer-fill');
const $timerSeconds   = document.getElementById('quiz-timer-seconds');
const $questionCard   = document.getElementById('quiz-question-card');
const $resultsOverlay = document.getElementById('quiz-results-overlay');
const $resultsCard    = document.getElementById('quiz-results-card');
const $bestScoreVal   = document.getElementById('quiz-best-score-value');

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  loadBestScore();
  $totalNum.textContent = questions.length;
  $startBtn.addEventListener('click', startQuiz);
});

/* ══════════════════════════════════════════════════════════════
   QUIZ FLOW
   ══════════════════════════════════════════════════════════════ */

/** Start the quiz */
function startQuiz() {
  state.quizStarted = true;
  state.quizFinished = false;
  state.activeQuestions = getShuffledQuestions();
  state.answers = new Array(state.activeQuestions.length).fill(null);
  state.answered = new Array(state.activeQuestions.length).fill(false);
  state.currentIndex = 0;

  // Hide start screen, show quiz UI
  $startScreen.style.display = 'none';
  $progressWrap.style.display = 'block';
  $timerWrap.style.display = 'block';
  $questionCard.style.display = 'block';

  renderQuestion();
}

/** Render current question */
function renderQuestion(direction = 'right') {
  const q = state.activeQuestions[state.currentIndex];
  const idx = state.currentIndex;
  const isAnswered = state.answered[idx];
  const selectedAnswer = state.answers[idx];

  // Update progress
  updateProgress();

  // Determine animation class
  const animClass = direction === 'left' ? 'quiz-card--enter-left' : '';

  // Build question card HTML
  const categoryClass = q.category.startsWith('C4') ? 'quiz-question__category--c4' : 'quiz-question__category--c5';

  let optionsHTML = q.options.map((opt, i) => {
    let classes = 'quiz-option';
    if (isAnswered) {
      classes += ' quiz-option--disabled';
      if (i === q.correctAnswer) classes += ' quiz-option--correct';
      if (i === selectedAnswer && selectedAnswer !== q.correctAnswer) classes += ' quiz-option--wrong';
    } else if (selectedAnswer === i) {
      classes += ' quiz-option--selected';
    }

    return `
      <button class="${classes}" data-index="${i}" type="button"
              ${isAnswered ? 'disabled' : ''} aria-label="Pilihan ${OPTION_LETTERS[i]}">
        <span class="quiz-option__letter">${OPTION_LETTERS[i]}</span>
        <span class="quiz-option__text">${opt}</span>
      </button>
    `;
  }).join('');

  // Explanation (shown after answering)
  const explanationHTML = isAnswered ? `
    <div class="quiz-explanation quiz-explanation--visible">
      <div class="quiz-explanation__title">
        💡 Pembahasan
      </div>
      <p class="quiz-explanation__text">${q.explanation}</p>
    </div>
  ` : '';

  // Hint button
  const hintHTML = !isAnswered && q.hint ? `
    <button class="quiz-hint" id="quiz-hint-btn" type="button" aria-expanded="false">
      <span>💡</span> Tampilkan Petunjuk
    </button>
    <div class="quiz-hint__text" id="quiz-hint-text">${q.hint}</div>
  ` : '';

  // Navigation buttons
  const isFirst = idx === 0;
  const isLast = idx === state.activeQuestions.length - 1;

  let navHTML = `<div class="quiz-nav-buttons">`;
  if (!isFirst) {
    navHTML += `<button class="quiz-btn quiz-btn--prev" id="quiz-btn-prev" type="button">← Sebelumnya</button>`;
  } else {
    navHTML += `<div class="quiz-nav-buttons__spacer"></div>`;
  }

  if (isLast) {
    navHTML += `<button class="quiz-btn quiz-btn--submit" id="quiz-btn-submit" type="button">📊 Lihat Hasil</button>`;
  } else {
    navHTML += `<button class="quiz-btn quiz-btn--next" id="quiz-btn-next" type="button">Selanjutnya →</button>`;
  }
  navHTML += `</div>`;

  // Assemble card
  $questionCard.innerHTML = `
    <article class="quiz-card ${animClass}" id="quiz-card-inner" role="region"
             aria-label="Soal nomor ${idx + 1}">
      <div class="quiz-question__header">
        <span class="quiz-question__number">${idx + 1}</span>
        <span class="quiz-question__category ${categoryClass}">${q.category}</span>
      </div>
      <p class="quiz-question__text">${q.question}</p>
      ${hintHTML}
      <div class="quiz-options" role="radiogroup" aria-label="Pilihan jawaban">
        ${optionsHTML}
      </div>
      ${explanationHTML}
      ${navHTML}
    </article>
  `;

  // Attach event listeners
  attachQuestionListeners();

  // Start/restart timer only if not yet answered
  if (!isAnswered) {
    startTimer();
  } else {
    stopTimer();
    // Show timer at 0 or paused state
    $timerFill.style.width = '0%';
    $timerFill.className = 'quiz-timer__fill quiz-timer__fill--danger';
    $timerSeconds.textContent = '✓';
    $timerSeconds.className = 'quiz-timer__seconds';
  }
}

/** Attach listeners to dynamic elements in the question card */
function attachQuestionListeners() {
  const idx = state.currentIndex;

  // Option click
  if (!state.answered[idx]) {
    document.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const optionIndex = parseInt(btn.dataset.index, 10);
        selectAnswer(optionIndex);
      });
    });
  }

  // Hint toggle
  const hintBtn = document.getElementById('quiz-hint-btn');
  const hintText = document.getElementById('quiz-hint-text');
  if (hintBtn && hintText) {
    hintBtn.addEventListener('click', () => {
      const isVisible = hintText.classList.contains('quiz-hint__text--visible');
      hintText.classList.toggle('quiz-hint__text--visible');
      hintBtn.setAttribute('aria-expanded', !isVisible);
      hintBtn.innerHTML = isVisible
        ? '<span>💡</span> Tampilkan Petunjuk'
        : '<span>💡</span> Sembunyikan Petunjuk';
    });
  }

  // Nav buttons
  const prevBtn = document.getElementById('quiz-btn-prev');
  const nextBtn = document.getElementById('quiz-btn-next');
  const submitBtn = document.getElementById('quiz-btn-submit');

  if (prevBtn) prevBtn.addEventListener('click', goToPrevious);
  if (nextBtn) nextBtn.addEventListener('click', goToNext);
  if (submitBtn) submitBtn.addEventListener('click', finishQuiz);
}

/* ══════════════════════════════════════════════════════════════
   ANSWER LOGIC
   ══════════════════════════════════════════════════════════════ */

/** Select an answer for the current question */
function selectAnswer(optionIndex) {
  const idx = state.currentIndex;
  if (state.answered[idx]) return;

  state.answers[idx] = optionIndex;
  state.answered[idx] = true;

  stopTimer();

  // Re-render to show feedback
  renderQuestionFeedback();
}

/** Re-render current question with correct/wrong feedback (no full re-render) */
function renderQuestionFeedback() {
  const q = state.activeQuestions[state.currentIndex];
  const selected = state.answers[state.currentIndex];

  document.querySelectorAll('.quiz-option').forEach(btn => {
    const i = parseInt(btn.dataset.index, 10);
    btn.classList.add('quiz-option--disabled');
    btn.disabled = true;

    if (i === q.correctAnswer) {
      btn.classList.add('quiz-option--correct');
    }
    if (i === selected && selected !== q.correctAnswer) {
      btn.classList.add('quiz-option--wrong');
    }
  });

  // Show explanation
  const optionsContainer = document.querySelector('.quiz-options');
  if (optionsContainer) {
    const explanationDiv = document.createElement('div');
    explanationDiv.className = 'quiz-explanation quiz-explanation--visible';
    explanationDiv.innerHTML = `
      <div class="quiz-explanation__title">💡 Pembahasan</div>
      <p class="quiz-explanation__text">${q.explanation}</p>
    `;
    optionsContainer.insertAdjacentElement('afterend', explanationDiv);
  }

  // Remove hint
  const hintBtn = document.getElementById('quiz-hint-btn');
  const hintText = document.getElementById('quiz-hint-text');
  if (hintBtn) hintBtn.remove();
  if (hintText) hintText.remove();

  // Update timer display
  $timerFill.style.width = '0%';
  $timerSeconds.textContent = '✓';
  $timerSeconds.className = 'quiz-timer__seconds';
}

/* ══════════════════════════════════════════════════════════════
   TIMER
   ══════════════════════════════════════════════════════════════ */

function startTimer() {
  stopTimer();
  state.timeLeft = TIMER_DURATION;
  updateTimerDisplay();

  state.timerInterval = setInterval(() => {
    state.timeLeft--;
    updateTimerDisplay();

    if (state.timeLeft <= 0) {
      handleTimeout();
    }
  }, 1000);
}

function stopTimer() {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
}

function updateTimerDisplay() {
  const t = state.timeLeft;
  const pct = (t / TIMER_DURATION) * 100;

  $timerFill.style.width = pct + '%';
  $timerSeconds.textContent = t + 's';

  // Color transitions
  $timerFill.classList.remove('quiz-timer__fill--warning', 'quiz-timer__fill--danger');
  $timerSeconds.classList.remove('quiz-timer__seconds--warning', 'quiz-timer__seconds--danger');

  if (t <= 5) {
    $timerFill.classList.add('quiz-timer__fill--danger');
    $timerSeconds.classList.add('quiz-timer__seconds--danger');
  } else if (t <= 10) {
    $timerFill.classList.add('quiz-timer__fill--warning');
    $timerSeconds.classList.add('quiz-timer__seconds--warning');
  }
}

function handleTimeout() {
  stopTimer();
  const idx = state.currentIndex;

  if (!state.answered[idx]) {
    // Mark as unanswered (null) but lock it
    state.answered[idx] = true;
    renderQuestionFeedback();

    // Auto-advance after 2 seconds
    setTimeout(() => {
      if (state.currentIndex < state.activeQuestions.length - 1) {
        goToNext();
      } else {
        finishQuiz();
      }
    }, 2000);
  }
}

/* ══════════════════════════════════════════════════════════════
   NAVIGATION
   ══════════════════════════════════════════════════════════════ */

function goToNext() {
  if (state.currentIndex < state.activeQuestions.length - 1) {
    // Exit animation
    const card = document.getElementById('quiz-card-inner');
    if (card) {
      card.classList.add('quiz-card--exit');
      setTimeout(() => {
        state.currentIndex++;
        renderQuestion('right');
      }, 280);
    } else {
      state.currentIndex++;
      renderQuestion('right');
    }
  }
}

function goToPrevious() {
  if (state.currentIndex > 0) {
    const card = document.getElementById('quiz-card-inner');
    if (card) {
      card.style.animation = 'card-exit-left 0.3s ease reverse forwards';
      setTimeout(() => {
        state.currentIndex--;
        renderQuestion('left');
      }, 280);
    } else {
      state.currentIndex--;
      renderQuestion('left');
    }
  }
}

function updateProgress() {
  const idx = state.currentIndex;
  const total = state.activeQuestions.length;
  const pct = ((idx + 1) / total) * 100;

  $currentNum.textContent = idx + 1;
  $progressFill.style.width = pct + '%';

  const bar = $progressFill.parentElement;
  if (bar) {
    bar.setAttribute('aria-valuenow', Math.round(pct));
  }
}

/* ══════════════════════════════════════════════════════════════
   RESULTS
   ══════════════════════════════════════════════════════════════ */

function finishQuiz() {
  stopTimer();
  state.quizFinished = true;

  // Hide quiz UI
  $progressWrap.style.display = 'none';
  $timerWrap.style.display = 'none';
  $questionCard.style.display = 'none';

  // Calculate score
  let correct = 0;
  let wrong = 0;
  let unanswered = 0;

  state.activeQuestions.forEach((q, i) => {
    if (state.answers[i] === null) {
      unanswered++;
    } else if (state.answers[i] === q.correctAnswer) {
      correct++;
    } else {
      wrong++;
    }
  });

  const total = state.activeQuestions.length;
  const percentage = Math.round((correct / total) * 100);
  const gradeInfo = getGrade(percentage);

  // Save best score
  saveBestScore(percentage);

  // Build results
  renderResults(correct, wrong, unanswered, percentage, gradeInfo);
}

function renderResults(correct, wrong, unanswered, percentage, gradeInfo) {
  const total = state.activeQuestions.length;
  const bestScore = getBestScore();
  const gradeClass = 'grade-' + gradeInfo.grade.toLowerCase();

  // Emoji based on grade
  const emojis = { A: '🎉', B: '👏', C: '💪', D: '📚' };
  const emoji = emojis[gradeInfo.grade] || '📝';

  // SVG ring parameters
  const radius = 65;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  $resultsCard.innerHTML = `
    <div class="quiz-results__header">
      <span class="quiz-results__emoji">${emoji}</span>
      <h2 class="quiz-results__title">Kuis Selesai!</h2>
      <p class="quiz-results__subtitle">Berikut hasil evaluasimu tentang Sistem Peredaran Darah</p>
    </div>

    <!-- Score Ring -->
    <div class="quiz-results__score-ring">
      <svg viewBox="0 0 150 150">
        <circle class="ring-bg" cx="75" cy="75" r="${radius}" />
        <circle class="ring-fill" cx="75" cy="75" r="${radius}"
                stroke="${gradeInfo.color}"
                stroke-dasharray="${circumference}"
                stroke-dashoffset="${circumference}"
                id="results-ring-fill" />
      </svg>
      <div class="quiz-results__score-value">
        <span class="quiz-results__score-number" id="results-score-number"
              style="color: ${gradeInfo.color}">0%</span>
        <span class="quiz-results__score-label">${correct}/${total} Benar</span>
      </div>
    </div>

    <!-- Grade -->
    <div class="quiz-results__grade ${gradeClass}">
      <span class="quiz-results__grade-letter">${gradeInfo.grade}</span>
      <span class="quiz-results__grade-label">${gradeInfo.label}</span>
    </div>

    <!-- Stats -->
    <div class="quiz-results__stats">
      <div class="quiz-results__stat">
        <span class="quiz-results__stat-value stat-correct">${correct}</span>
        <span class="quiz-results__stat-label">Benar</span>
      </div>
      <div class="quiz-results__stat">
        <span class="quiz-results__stat-value stat-wrong">${wrong}</span>
        <span class="quiz-results__stat-label">Salah</span>
      </div>
      <div class="quiz-results__stat">
        <span class="quiz-results__stat-value stat-unanswered">${unanswered}</span>
        <span class="quiz-results__stat-label">Tidak Dijawab</span>
      </div>
    </div>

    <!-- Best score -->
    <div class="quiz-results__best-score">
      🏆 Skor Terbaik: <strong>${bestScore}%</strong>
    </div>

    <!-- Actions -->
    <div class="quiz-results__actions">
      <button class="quiz-btn quiz-btn--next" id="results-btn-retry" type="button">🔄 Ulangi Kuis</button>
      <button class="quiz-btn quiz-btn--prev" id="results-btn-explore" type="button">🔬 Eksplorasi 3D</button>
      <button class="quiz-btn quiz-btn--prev" id="results-btn-home" type="button">🏠 Kembali</button>
    </div>

    <!-- Review -->
    <div class="quiz-review">
      <button class="quiz-review__toggle" id="results-review-toggle" type="button">
        📋 Lihat Pembahasan Lengkap
        <span id="review-toggle-icon">▼</span>
      </button>
      <div class="quiz-review__list" id="results-review-list">
        ${renderReviewItems()}
      </div>
    </div>
  `;

  // Show modal
  $resultsOverlay.classList.add('quiz-results-overlay--visible');

  // Animate score ring after a short delay
  requestAnimationFrame(() => {
    setTimeout(() => {
      const ringFill = document.getElementById('results-ring-fill');
      if (ringFill) {
        ringFill.style.strokeDashoffset = offset;
      }
      animateScoreCounter(percentage, gradeInfo.color);
    }, 300);
  });

  // Attach result button listeners
  document.getElementById('results-btn-retry')?.addEventListener('click', retryQuiz);
  document.getElementById('results-btn-explore')?.addEventListener('click', () => {
    window.location.href = '/explore.html';
  });
  document.getElementById('results-btn-home')?.addEventListener('click', () => {
    window.location.href = '/index.html';
  });
  document.getElementById('results-review-toggle')?.addEventListener('click', toggleReview);
}

function renderReviewItems() {
  return state.activeQuestions.map((q, i) => {
    const userAnswer = state.answers[i];
    let statusClass = 'quiz-review__item--unanswered';
    let userAnswerText = 'Tidak dijawab';

    if (userAnswer !== null) {
      if (userAnswer === q.correctAnswer) {
        statusClass = 'quiz-review__item--correct';
      } else {
        statusClass = 'quiz-review__item--wrong';
      }
      userAnswerText = `${OPTION_LETTERS[userAnswer]}. ${q.options[userAnswer]}`;
    }

    const correctText = `${OPTION_LETTERS[q.correctAnswer]}. ${q.options[q.correctAnswer]}`;

    return `
      <div class="quiz-review__item ${statusClass}">
        <p class="quiz-review__item-question"><strong>${i + 1}.</strong> ${q.question}</p>
        <p class="quiz-review__item-answer">
          Jawabanmu: <span style="color: ${userAnswer === q.correctAnswer ? 'var(--color-green)' : 'var(--color-red)'}">${userAnswerText}</span>
        </p>
        <p class="quiz-review__item-answer">
          Jawaban benar: <span style="color: var(--color-green)">${correctText}</span>
        </p>
        <p class="quiz-review__item-explanation">${q.explanation}</p>
      </div>
    `;
  }).join('');
}

function toggleReview() {
  const list = document.getElementById('results-review-list');
  const icon = document.getElementById('review-toggle-icon');
  if (!list) return;

  const isVisible = list.classList.contains('quiz-review__list--visible');
  list.classList.toggle('quiz-review__list--visible');
  if (icon) icon.textContent = isVisible ? '▼' : '▲';
}

function animateScoreCounter(target) {
  const el = document.getElementById('results-score-number');
  if (!el) return;

  const duration = 1500;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(target * eased);
    el.textContent = current + '%';

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

function retryQuiz() {
  $resultsOverlay.classList.remove('quiz-results-overlay--visible');
  state.activeQuestions = getShuffledQuestions();
  state.answers = new Array(state.activeQuestions.length).fill(null);
  state.answered = new Array(state.activeQuestions.length).fill(false);
  state.currentIndex = 0;
  state.quizFinished = false;

  $progressWrap.style.display = 'block';
  $timerWrap.style.display = 'block';
  $questionCard.style.display = 'block';

  renderQuestion();
}

/* ══════════════════════════════════════════════════════════════
   LOCAL STORAGE
   ══════════════════════════════════════════════════════════════ */

function getBestScore() {
  try {
    return parseInt(localStorage.getItem(STORAGE_KEY), 10) || 0;
  } catch {
    return 0;
  }
}

function saveBestScore(newScore) {
  const current = getBestScore();
  if (newScore > current) {
    try {
      localStorage.setItem(STORAGE_KEY, newScore);
    } catch {
      // Storage might be unavailable
    }
  }
  loadBestScore();
}

function loadBestScore() {
  const best = getBestScore();
  if ($bestScoreVal) {
    $bestScoreVal.textContent = best > 0 ? best + '%' : '—';
  }
}
