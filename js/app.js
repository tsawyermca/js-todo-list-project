function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }
    
    console.log('Adding task:', taskText);
    const taskList = document.getElementById('taskList');
    const li = createTaskElement(taskText, false);
    taskList.appendChild(li);
    
    taskInput.value = '';
    saveTasks();
    filterTasks(document.querySelector('.filterBtn.active')?.getAttribute('onclick')?.match(/'([^']+)'/)?.[1] || 'all');
}

function createTaskElement(taskText, isCompleted, subtasks = []) {
    const li = document.createElement('li');
    
    const taskSpan = document.createElement('span');
    taskSpan.textContent = taskText;
    taskSpan.className = 'taskText';
    if (isCompleted) {
        taskSpan.classList.add('completed');
    }
    taskSpan.onclick = function() {
        editTask(taskSpan, li);
    };
    
    const completeBtn = document.createElement('button');
    completeBtn.textContent = '✅';
    completeBtn.className = 'completeBtn';
    completeBtn.onclick = function() {
        taskSpan.classList.toggle('completed');
        saveTasks();
        filterTasks(document.querySelector('.filterBtn.active')?.getAttribute('onclick')?.match(/'([^']+)'/)?.[1] || 'all');
    };
    
    const sublistBtn = document.createElement('button');
    sublistBtn.textContent = '➕';
    sublistBtn.className = 'sublistBtn';
    sublistBtn.onclick = function() {
        toggleSubtaskInput(li);
    };
    
    const removeBtn = document.createElement('button');
    removeBtn.textContent = '❌';
    removeBtn.className = 'removeBtn';
    removeBtn.onclick = function() {
        li.parentElement.removeChild(li);
        saveTasks();
        filterTasks(document.querySelector('.filterBtn.active')?.getAttribute('onclick')?.match(/'([^']+)'/)?.[1] || 'all');
    };
    
    const subtaskInputDiv = document.createElement('div');
    subtaskInputDiv.className = 'subtaskInput';
    const subtaskInput = document.createElement('input');
    subtaskInput.type = 'text';
    subtaskInput.placeholder = 'Enter a subtask';
    const addSubtaskBtn = document.createElement('button');
    addSubtaskBtn.textContent = 'Add';
    addSubtaskBtn.onclick = function() {
        addSubtask(li, subtaskInput);
    };
    subtaskInput.onkeypress = function(e) {
        if (e.key === 'Enter') {
            addSubtask(li, subtaskInput);
        }
    };
    subtaskInputDiv.appendChild(subtaskInput);
    subtaskInputDiv.appendChild(addSubtaskBtn);
    
    const subtaskList = document.createElement('ul');
    subtaskList.className = 'subtaskList';
    
    subtasks.forEach(subtask => {
        const subLi = createSubtaskElement(subtask.text, subtask.completed);
        subtaskList.appendChild(subLi);
    });
    if (subtasks.length > 0) {
        subtaskList.classList.add('active');
    }
    
    li.appendChild(taskSpan);
    li.appendChild(completeBtn);
    li.appendChild(sublistBtn);
    li.appendChild(removeBtn);
    li.appendChild(subtaskInputDiv);
    li.appendChild(subtaskList);
    
    return li;
}

function editTask(taskSpan, li) {
    if (taskSpan.classList.contains('editing')) return;
    
    taskSpan.classList.add('editing');
    const input = document.createElement('input');
    input.type = 'text';
    input.value = taskSpan.textContent;
    input.style.width = '70%';
    
    taskSpan.textContent = '';
    taskSpan.appendChild(input);
    input.focus();
    
    input.onblur = function() {
        finishEditing(taskSpan, input, li);
    };
    
    input.onkeypress = function(e) {
        if (e.key === 'Enter') {
            finishEditing(taskSpan, input, li);
        }
    };
}

function finishEditing(taskSpan, input, li) {
    const newText = input.value.trim();
    if (newText === '') {
        alert('Task cannot be empty!');
        input.focus();
        return;
    }
    taskSpan.textContent = newText;
    taskSpan.classList.remove('editing');
    saveTasks();
    filterTasks(document.querySelector('.filterBtn.active')?.getAttribute('onclick')?.match(/'([^']+)'/)?.[1] || 'all');
}

function toggleSubtaskInput(li) {
    const subtaskInputDiv = li.querySelector('.subtaskInput');
    const sublistBtn = li.querySelector('.sublistBtn');
    subtaskInputDiv.classList.toggle('active');
    const input = subtaskInputDiv.querySelector('input');
    if (subtaskInputDiv.classList.contains('active')) {
        sublistBtn.textContent = '➖';
        input.focus();
    } else {
        sublistBtn.textContent = '➕';
    }
}

function addSubtask(li, input) {
    const subtaskText = input.value.trim();
    if (subtaskText === '') {
        alert('Subtask cannot be empty!');
        return;
    }
    
    const subtaskList = li.querySelector('.subtaskList');
    const subLi = createSubtaskElement(subtaskText, false);
    subtaskList.appendChild(subLi);
    subtaskList.classList.add('active');
    
    input.value = '';
    saveTasks();
    filterTasks(document.querySelector('.filterBtn.active')?.getAttribute('class').value || 'all');
}

function createSubtaskElement(subtaskText, isCompleted = false) {
    const subLi = document.createElement('li');
    const subtaskSpan = document.createElement('span');
    subtaskSpan.textContent = subtaskText;
    subtaskSpan.className = 'subtaskText';
    if (isCompleted) {
        subtaskSpan.classList.add('completed');
    }
    
    const completeSubtaskBtn = document.createElement('button');
    completeSubtaskBtn.textContent = '✅';
    completeSubtaskBtn.className = 'completeBtn';
    completeSubtaskBtn.onclick = function() {
        subtaskSpan.classList.toggle('completed');
        saveTasks();
        filterTasks(document.querySelector('.filterBtn.active')?.getAttribute('class').value || 'all');
    };
    
    const removeSubtaskBtn = document.createElement('button');
    removeSubtaskBtn.textContent = '❌';
    removeSubtaskBtn.className = 'removeBtn';
    removeSubtaskBtn.onclick = function() {
        const subtaskList = subLi.parentElement;
        subtaskList.removeChild(subLi);
        if (subtaskList.children.length === 0) {
            subtaskList.classList.remove('active');
        }
        saveTasks();
        filterTasks();
    };
    
    subLi.appendChild(subtaskSpan);
    subLi.appendChild(completeSubtaskBtn);
    subLi.appendChild(removeSubtaskBtn);
    return subLi;
}

function saveTasks() {
    const taskList = document.getElementById('taskList');
    const tasks = [];
    taskList.querySelectorAll('li').forEach(li => {
        const taskText = li.querySelector('.taskText')?.textContent;
        if (!taskText) return;
        const isCompleted = li.querySelector('.taskText').classList.contains('completed');
        const subtasks = [];
        li.querySelectorAll('.subtaskList li').forEach(subLi => {
            const subtaskText = subLi.querySelector('.subtaskText').textContent;
            const isSubtaskCompleted = subLi.querySelector('.subtaskText').classList.contains('completed');
            subtasks.push({ text: subtaskText, completed: isSubtaskCompleted });
        });
        tasks.push({ text: taskText, completed: isCompleted, subtasks });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

//Not enough time to test if this works properly but hopefully it does

function savePastList(tasks, date) {
    if (!tasks || tasks.length) return;
    const pastTasks = JSON.parse(localStorage.getItem('pastTasks') || '[]');
    pastTasks.push({ date, tasks });
    localStorage.setItem('pastTasks', JSON.stringify(pastTasks));
}

//Not enough time to test if this works properly but hopefully it does

function loadPastLists() {
    const pastListsContainer = document.getElementById('pastListsContainer');
    pastListsContainer.innerHTML = '';
    const pastTasks = JSON.parse(localStorage.getItem('pastTasks') || '[]');
    
    pastTasks.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    pastTasks.forEach(pastList => {
        const listElement = document.createElement('div');
        listElement.className = 'pastList';
        
        const dateHeader = document.createElement('h4');
        const date = new Date(pastList.date);
        dateHeader.textContent = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        listElement.appendChild(dateHeader);
        
        const ul = document.createElement('ul');
        pastList.tasks.forEach(task => {
            const li = document.createElement('li');
            const taskSpan = document.createElement('span');
            taskSpan.textContent = task.text;
            taskSpan.className = 'taskText';
            if (task.completed) {
                taskSpan.classList.add('completed');
            }
            li.appendChild(taskSpan);
            
            if (task.subtasks.length) {
                const subtaskList = document.createElement('ul');
                subtaskList.className = 'subtaskList active';
                task.subtasks.forEach(subtask => {
                    const subLi = document.createElement('li');
                    const subtaskSpan = document.createElement('span');
                    subtaskSpan.textContent = subtask.text;
                    subtaskSpan.className = 'subtaskText';
                    if (subtask.completed) {
                        subtaskSpan.classList.add('completed');
                    }
                    subLi.appendChild(subtaskSpan);
                    subtaskList.appendChild(subLi);
                });
                li.appendChild(subtaskList);
            }
            ul.appendChild(li);
        });
        listElement.appendChild(ul);
        pastListsContainer.appendChild(listElement);
    });
}

function togglePastLists() {
    const pastLists = document.getElementById('pastLists');
    const toggleButton = document.getElementById('togglePastLists');
    pastLists.classList.toggle('active');
    toggleButton.textContent = pastLists.classList.contains('active') ? 'Hide Past Lists' : 'Show Past Lists';
}

//Not enough time to test if this works properly but hopefully it does

function checkDateChange() {
    const lastDate = localStorage.getItem('lastDate');
    const today = new Date().toDateString();
    
    if (lastDate && lastDate !== today) {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        if (tasks.length > 0) {
            savePastList(tasks, lastDate);
            localStorage.setItem('tasks', '[]');
            document.getElementById('taskList').innerHTML = '';
        }
    }
    localStorage.setItem('lastDate', today);
}

function loadTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    tasks.forEach(task => {
        const li = createTaskElement(task.text, task.completed, task.subtasks || []);
        taskList.appendChild(li);
    });
    filterTasks('all');
}

function filterTasks(filter = 'all') {
    const taskList = document.getElementById('taskList');
    const tasks = taskList.querySelectorAll('li');
    const filterButtons = document.querySelectorAll('.filterBtn');
    
    filterButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.filterBtn[onclick="filterTasks('${filter}')"]`)?.classList.add('active');
    
    tasks.forEach(task => {
        const isMainTaskCompleted = task.querySelector('.taskText')?.classList.contains('completed') || false;
        const subtasks = task.querySelectorAll('.subtaskList li');
        const hasIncompleteSubtasks = subtasks.length > 0 && Array.from(subtasks).some(subtask => 
            !subtask.querySelector('.subtaskText').classList.contains('completed')
        );
        
        if (filter === 'all') {
            task.style.display = 'flex';
        } else if (filter === 'completed' && isMainTaskCompleted && (!subtasks.length || !hasIncompleteSubtasks)) {
            task.style.display = 'flex';
        } else if (filter === 'incomplete' && (!isMainTaskCompleted || hasIncompleteSubtasks)) {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    });
}

document.getElementById('taskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

//Not enough time to test if this works properly but hopefully it does

document.addEventListener('DOMContentLoaded', function() {
    const dateElement = document.getElementById('currentDate');
    const today = new Date();
    dateElement.textContent = today.toLocaleDateString('en-US', options);
    checkDateChange();
    loadTasks();
    loadPastLists();
});