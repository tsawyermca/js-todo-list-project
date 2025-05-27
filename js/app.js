function addTask(){
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();

    if(taskText === ''){
        alert("Please Enter a Task");
        return;
    }

    const taskList = document.getElementById('taskList');
    const li = document.createElement('li');

    const taskSpan = document.createElement('span');
    taskSpan.textContent = taskText;
    taskSpan.className = 'task-text';

    const completeBtn = document.createElement('button');
    completeBtn.textContent = '✅';
    completeBtn.className = 'complete-btn';
    completeBtn.onclick = function(){
        taskSpan.classList.toggle('completed');
        saveTasks();
    }

    const removeBtn = document.createElement('button');
    removeBtn.textContent = '❌';
    removeBtn.className = 'remove-btn';
    removeBtn.onclick = function(){
        taskList.removeChild(li);
        saveTasks();
    }

    li.appendChild(taskSpan);
    li.appendChild(completeBtn);
    li.appendChild(removeBtn);
    taskList.appendChild(li);

    taskInput.value = '';
    saveTasks();
}

document.getElementById('taskInput').addEventListener('keypress', function(e){
    if (e.key === 'Enter'){
        addTask();
    }
});

function saveTasks(){
    const taskList = document.getElementById('taskList');
    const tasks = [];
    taskList.querySelectorAll('li').forEach(li => {
        const taskText = li.querySelector('.task-text').textContent;
        const isCompleted = li.querySelector('.task-text').classList.contains('completed');
        tasks.push({text: taskText, completed: isCompleted});
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks(){
    const taskList = document.getElementById('taskList');
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach(task => {
        const li = document.createElement('li');
        const taskSpan = document.createElement('span');
        taskSpan.textContent = task.text;
        taskSpan.className = 'task-text';
        if(task.completed){
            taskSpan.classList.add('completed');
        }

        const completeBtn = document.createElement('button');
        completeBtn.textContent = '✅';
        completeBtn.className = 'complete-btn';
        completeBtn.onclick = function(){
            taskSpan.classList.toggle('completed');
            saveTasks();
        }

        const removeBtn = document.createElement('button');
        removeBtn.textContent = '❌';
        removeBtn.className = 'remove-btn';
        removeBtn.onclick = function(){
            taskList.removeChild(li);
            saveTasks();
        }

        li.appendChild(taskSpan);
        li.appendChild(completeBtn);
        li.appendChild(removeBtn);
        taskList.appendChild(li);
    })
}

document.addEventListener('DOMContentLoaded', loadTasks);