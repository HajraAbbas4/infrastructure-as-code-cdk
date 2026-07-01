// To-Do List Application with Local Storage

class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.storageKey = 'todos';
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        // Add task button
        document.getElementById('addBtn').addEventListener('click', () => this.addTodo());

        // Enter key in input
        document.getElementById('todoInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
        });

        // Clear completed button
        document.getElementById('clearBtn').addEventListener('click', () => this.clearCompleted());
    }

    addTodo() {
        const input = document.getElementById('todoInput');
        const text = input.value.trim();

        if (text === '') {
            alert('Please enter a task!');
            return;
        }

        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.todos.unshift(todo);
        this.saveToStorage();
        this.render();
        input.value = '';
        input.focus();
    }

    deleteTodo(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.todos = this.todos.filter(todo => todo.id !== id);
            this.saveToStorage();
            this.render();
        }
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveToStorage();
            this.render();
        }
    }

    clearCompleted() {
        const completedCount = this.todos.filter(t => t.completed).length;
        
        if (completedCount === 0) {
            alert('No completed tasks to clear!');
            return;
        }

        if (confirm(`Delete ${completedCount} completed task(s)?`)) {
            this.todos = this.todos.filter(t => !t.completed);
            this.saveToStorage();
            this.render();
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        this.render();
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(t => !t.completed);
            case 'completed':
                return this.todos.filter(t => t.completed);
            default:
                return this.todos;
        }
    }

    saveToStorage() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.todos));
    }

    loadFromStorage() {
        const stored = localStorage.getItem(this.storageKey);
        this.todos = stored ? JSON.parse(stored) : [];
    }

    updateStats() {
        const activeTodos = this.todos.filter(t => !t.completed).length;
        const taskText = activeTodos === 1 ? 'task' : 'tasks';
        document.getElementById('taskCount').textContent = `${activeTodos} active ${taskText}`;

        const clearBtn = document.getElementById('clearBtn');
        const completedCount = this.todos.filter(t => t.completed).length;
        clearBtn.disabled = completedCount === 0;
    }

    render() {
        const todoList = document.getElementById('todoList');
        const filteredTodos = this.getFilteredTodos();

        todoList.innerHTML = '';

        if (filteredTodos.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <div class="empty-state-emoji">✨</div>
                <div class="empty-state-text">
                    ${this.currentFilter === 'completed' ? 'No completed tasks yet!' :
                      this.currentFilter === 'active' ? 'No active tasks!' :
                      'No tasks yet! Add one to get started.'}
                </div>
            `;
            todoList.appendChild(emptyState);
        } else {
            filteredTodos.forEach(todo => {
                const li = document.createElement('li');
                li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
                li.innerHTML = `
                    <input 
                        type="checkbox" 
                        class="checkbox" 
                        ${todo.completed ? 'checked' : ''}
                        onchange="app.toggleTodo(${todo.id})"
                    >
                    <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                    <button class="delete-btn" onclick="app.deleteTodo(${todo.id})">Delete</button>
                `;
                todoList.appendChild(li);
            });
        }

        this.updateStats();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new TodoApp();
});
