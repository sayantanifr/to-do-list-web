// Icons for different categories
const categoryIcons = {
    'work': '📋',
    'personal': '👤',
    'health': '🏥',
    'other': '⭕',
    'default': '🌿'
};

// Initialize
let tasks = JSON.parse(sessionStorage.getItem('tasks')) || [];
let currentCategory = 'all';

const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const tasksList = document.getElementById('tasksList');
const categoryBtns = document.querySelectorAll('.category-btn');
const progressText = document.getElementById('progressText');
const progressBar = document.getElementById('progressBar');

// Add task on button click
addBtn.addEventListener('click', addTask);

// Add task on Enter key
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Category filter
categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.dataset.category;
        renderTasks();
    });
});

function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    const task = {
        id: Date.now(),
        text: text,
        completed: false,
        category: currentCategory === 'all' ? 'other' : currentCategory,
        date: getDateString(new Date())
    };

    tasks.push(task);
    saveTasks();
    taskInput.value = '';
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

function renderTasks() {
    const filtered = currentCategory === 'all' 
        ? tasks 
        : tasks.filter(t => t.category === currentCategory);

    if (filtered.length === 0) {
        tasksList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <p>No tasks yet. Add one to get started!</p>
            </div>
        `;
    } else {
        tasksList.innerHTML = filtered.map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''}">
                <input 
                    type="checkbox" 
                    ${task.completed ? 'checked' : ''}
                    onchange="toggleTask(${task.id})"
                >
                <div class="task-content">
                    <div class="task-name">${escapeHtml(task.text)}</div>
                    <div class="task-date">${task.date}</div>
                </div>
                <div class="task-icon">${categoryIcons[task.category]}</div>
            </div>
        `).join('');
    }

    updateProgress();
}

function updateProgress() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    
    progressText.textContent = `You've completed ${completed} of ${total} tasks`;
    
    if (total === 0) {
        progressBar.style.width = '0%';
    } else {
        progressBar.style.width = ((completed / total) * 100) + '%';
    }
}

function saveTasks() {
    sessionStorage.setItem('tasks', JSON.stringify(tasks));
}

function getDateString(date) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dateStr = date.toDateString();
    const todayStr = today.toDateString();
    const tomorrowStr = tomorrow.toDateString();

    if (dateStr === todayStr) return 'Today';
    if (dateStr === tomorrowStr) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initial render
renderTasks();