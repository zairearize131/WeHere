/**
 * Pulse Habit Tracker - Main Application Logic
 */

// --- State Management ---
let habits = JSON.parse(localStorage.getItem('pulse_habits')) || [
  { id: '1', title: 'Daily Workout', color: 'indigo', streak: 3, completedDates: [getTodayString()] },
  { id: '2', title: 'Read 20 Pages', color: 'emerald', streak: 5, completedDates: [getTodayString()] },
  { id: '3', title: 'Practice Guitar', color: 'amber', streak: 0, completedDates: [] }
];

let selectedColor = 'indigo';
let activeView = 'dashboard';
let timeMode = 'daily';

// Color Mapping
const colorMap = {
  indigo: { bg: 'bg-indigo-500', text: 'text-indigo-400', border: 'border-indigo-500/30', lightBg: 'bg-indigo-500/10' },
  emerald: { bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/30', lightBg: 'bg-emerald-500/10' },
  amber: { bg: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500/30', lightBg: 'bg-amber-500/10' },
  rose: { bg: 'bg-rose-500', text: 'text-rose-400', border: 'border-rose-500/30', lightBg: 'bg-rose-500/10' },
  sky: { bg: 'bg-sky-500', text: 'text-sky-400', border: 'border-sky-500/30', lightBg: 'bg-sky-500/10' }
};

// --- DOM Elements ---
const navDashboard = document.getElementById('nav-dashboard');
const navAnalytics = document.getElementById('nav-analytics');
const viewDashboard = document.getElementById('view-dashboard');
const viewAnalytics = document.getElementById('view-analytics');

const habitsList = document.getElementById('habits-list');
const progressBarFill = document.getElementById('progress-bar-fill');
const progressText = document.getElementById('progress-text');
const progressPercent = document.getElementById('progress-percent');

const modal = document.getElementById('modal-habit');
const formHabit = document.getElementById('form-habit');
const btnOpenModal = document.getElementById('btn-open-modal');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnCancelModal = document.getElementById('btn-cancel-modal');
const habitIdInput = document.getElementById('habit-id');
const habitTitleInput = document.getElementById('habit-title');
const colorButtons = document.querySelectorAll('#color-selector button');
const themeToggle = document.getElementById('theme-toggle');

// --- Helper Functions ---
function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

function saveState() {
  localStorage.setItem('pulse_habits', JSON.stringify(habits));
  render();
}

// --- Render Engine ---
function render() {
  renderDashboard();
  renderAnalytics();
  if (window.lucide) {
    lucide.createIcons();
  }
}

function renderDashboard() {
  const today = getTodayString();
  let completedCount = 0;

  habitsList.innerHTML = '';

  if (habits.length === 0) {
    habitsList.innerHTML = `
      <div class="text-center py-12 bg-slate-800/30 border border-dashed border-slate-700/60 rounded-2xl">
        <p class="text-slate-400 text-sm mb-3">No habits created yet.</p>
        <button onclick="openModal()" class="text-xs text-indigo-400 font-semibold hover:underline">Create your first habit</button>
      </div>
    `;
  }

  habits.forEach(habit => {
    const isCompleted = habit.completedDates.includes(today);
    if (isCompleted) completedCount++;

    const colorScheme = colorMap[habit.color] || colorMap.indigo;

    const habitEl = document.createElement('div');
    habitEl.className = `habit-card bg-slate-800/60 border ${isCompleted ? colorScheme.border : 'border-slate-700/60'} rounded-2xl p-4 flex items-center justify-between shadow-md`;
    
    habitEl.innerHTML = `
      <div class="flex items-center space-x-4">
        <button onclick="toggleHabit('${habit.id}')" class="w-8 h-8 rounded-xl border flex items-center justify-center transition-all duration-200 ${
          isCompleted 
            ? `${colorScheme.bg} border-transparent text-white animate-check` 
            : 'border-slate-600 bg-slate-900/50 hover:border-slate-500 text-transparent'
        }">
          <i data-lucide="check" class="w-5 h-5 stroke-[3]"></i>
        </button>

        <div>
          <div class="flex items-center space-x-2">
            <span class="font-bold text-sm ${isCompleted ? 'line-through text-slate-400' : 'text-white'}">${habit.title}</span>
            <span class="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full ${colorScheme.lightBg} ${colorScheme.text}">
              ${habit.color}
            </span>
          </div>
          <div class="flex items-center space-x-1 text-xs text-amber-400 font-semibold mt-1">
            <i data-lucide="flame" class="w-3.5 h-3.5 fill-amber-400"></i>
            <span>${habit.streak} day streak</span>
          </div>
        </div>
      </div>

      <div class="flex items-center space-x-1">
        <button onclick="openModal('${habit.id}')" class="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50 transition-colors">
          <i data-lucide="pencil" class="w-4 h-4"></i>
        </button>
        <button onclick="deleteHabit('${habit.id}')" class="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-700/50 transition-colors">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </div>
    `;

    habitsList.appendChild(habitEl);
  });

  // Update Progress Bar
  const total = habits.length;
  const percentage = total === 0 ? 0 : Math.round((completedCount / total) * 100);
  
  progressBarFill.style.width = `${percentage}%`;
  progressText.textContent = `${completedCount} of ${total} Completed`;
  progressPercent.textContent = `${percentage}%`;
}

function renderAnalytics() {
  // Total completions calculation
  const totalCompletions = habits.reduce((acc, curr) => acc + curr.completedDates.length, 0);
  document.getElementById('stat-total-completed').textContent = totalCompletions;

  // Best streak calculation
  const bestStreak = habits.reduce((max, curr) => curr.streak > max ? curr.streak : max, 0);
  document.getElementById('stat-best-streak').textContent = `${bestStreak} Days`;

  // Render Heatmap Grid (30 days)
  const analyticsGrid = document.getElementById('analytics-grid');
  analyticsGrid.innerHTML = '';

  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Count completions for this day
    const completionsOnDay = habits.filter(h => h.completedDates.includes(dateStr)).length;

    let bgClass = 'bg-slate-900 border-slate-800';
    if (completionsOnDay === 1) bgClass = 'bg-indigo-900/60 border-indigo-700/50';
    if (completionsOnDay === 2) bgClass = 'bg-indigo-700 border-indigo-500';
    if (completionsOnDay >= 3) bgClass = 'bg-indigo-500 border-indigo-300';

    const dayBox = document.createElement('div');
    dayBox.className = `h-10 rounded-lg border ${bgClass} flex flex-col items-center justify-center text-[10px] font-semibold text-slate-400 transition-all hover:scale-105`;
    dayBox.title = `${dateStr}: ${completionsOnDay} completed`;
    dayBox.innerHTML = `<span>${date.getDate()}</span>`;
    
    analyticsGrid.appendChild(dayBox);
  }
}

// --- Habit Operations ---
function toggleHabit(id) {
  const today = getTodayString();
  habits = habits.map(habit => {
    if (habit.id === id) {
      const isCompleted = habit.completedDates.includes(today);
      let updatedDates = [...habit.completedDates];

      if (isCompleted) {
        updatedDates = updatedDates.filter(d => d !== today);
        habit.streak = Math.max(0, habit.streak - 1);
      } else {
        updatedDates.push(today);
        habit.streak += 1;
      }

      return { ...habit, completedDates: updatedDates };
    }
    return habit;
  });

  saveState();
}

function deleteHabit(id) {
  if (confirm('Are you sure you want to delete this habit?')) {
    habits = habits.filter(h => h.id !== id);
    saveState();
  }
}

// --- Modal Handlers ---
function openModal(id = null) {
  if (id) {
    const habit = habits.find(h => h.id === id);
    if (habit) {
      document.getElementById('modal-title').textContent = 'Edit Habit';
      habitIdInput.value = habit.id;
      habitTitleInput.value = habit.title;
      selectColor(habit.color);
    }
  } else {
    document.getElementById('modal-title').textContent = 'Add New Habit';
    habitIdInput.value = '';
    habitTitleInput.value = '';
    selectColor('indigo');
  }
  modal.classList.remove('hidden');
}

function closeModal() {
  modal.classList.add('hidden');
}

function selectColor(color) {
  selectedColor = color;
  colorButtons.forEach(btn => {
    if (btn.dataset.color === color) {
      btn.classList.add('ring-2', 'ring-indigo-400', 'ring-offset-2', 'ring-offset-slate-900');
    } else {
      btn.classList.remove('ring-2', 'ring-indigo-400', 'ring-offset-2', 'ring-offset-slate-900');
    }
  });
}

// --- Event Listeners ---
btnOpenModal.addEventListener('click', () => openModal());
btnCloseModal.addEventListener('click', closeModal);
btnCancelModal.addEventListener('click', closeModal);

colorButtons.forEach(btn => {
  btn.addEventListener('click', (e) => selectColor(e.target.dataset.color));
});

formHabit.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = habitIdInput.value;
  const title = habitTitleInput.value.trim();

  if (!title) return;

  if (id) {
    // Edit existing
    habits = habits.map(h => h.id === id ? { ...h, title, color: selectedColor } : h);
  } else {
    // Create new
    const newHabit = {
      id: Date.now().toString(),
      title,
      color: selectedColor,
      streak: 0,
      completedDates: []
    };
    habits.push(newHabit);
  }

  saveState();
  closeModal();
});

// View Navigation
navDashboard.addEventListener('click', () => {
  activeView = 'dashboard';
  viewDashboard.classList.remove('hidden');
  viewAnalytics.classList.add('hidden');
  navDashboard.className = 'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 bg-indigo-600 text-white shadow-sm';
  navAnalytics.className = 'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 text-slate-400 hover:text-white';
});

navAnalytics.addEventListener('click', () => {
  activeView = 'analytics';
  viewAnalytics.classList.remove('hidden');
  viewDashboard.classList.add('hidden');
  navAnalytics.className = 'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 bg-indigo-600 text-white shadow-sm';
  navDashboard.className = 'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 text-slate-400 hover:text-white';
});

// Theme Toggle
themeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
});

// Initial Render
document.addEventListener('DOMContentLoaded', render);
