// Get elements from the page
const addTaskBtn = document.getElementById("add-task-btn");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

// Function to add a new task
function addTask() {
  const taskText = taskInput.value.trim();

  if (taskText === "") {
    alert("Please enter a task.");
    return;
  }

  // Create a new list item
  const li = document.createElement("li");
  li.textContent = taskText;
  li.setAttribute("draggable", "true");


  // Toggle 'completed' class on click
  li.addEventListener("click", function () {
    li.classList.toggle("completed");
    saveTasks();
  });

  // Create delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "delete-btn";

  // Add event to delete task
  deleteBtn.addEventListener("click", function (event) {
    event.stopPropagation();  // Prevent toggling completed state
    li.remove();
    saveTasks();
  });

  // Add button to the list item
  li.appendChild(deleteBtn);

  // Add list item to the task list
  taskList.appendChild(li);

  // Clear the input box
  taskInput.value = "";

  // Save the tasks to localStorage
  saveTasks();
}

// Add click event to the "Add Task" button
addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

function saveTasks() {
  const tasks = [];

  // Loop through all list items and save text + completed status
  taskList.querySelectorAll("li").forEach(li => {
    tasks.push({
      text: li.firstChild.textContent, // task text (before the delete button)
      completed: li.classList.contains("completed")
    });
  });

  // Save to localStorage as JSON string
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks"));

  if (!tasks) return;

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.textContent = task.text;
    li.setAttribute("draggable", "true");


    if (task.completed) {
      li.classList.add("completed");
    }

    li.addEventListener("click", function () {
      li.classList.toggle("completed");
      saveTasks();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";

    deleteBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      li.remove();
      saveTasks();
    });

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

// Run the loadTasks function when page loads
loadTasks();

let draggedItem = null;

taskList.addEventListener("dragstart", function (e) {
  if (e.target.tagName === "LI") {
    draggedItem = e.target;
    setTimeout(() => {
      e.target.style.display = "none";
    }, 0);
  }
});

taskList.addEventListener("dragend", function (e) {
  if (draggedItem) {
    setTimeout(() => {
      draggedItem.style.display = "flex";
      draggedItem = null;
    }, 0);
  }
});

taskList.addEventListener("dragover", function (e) {
  e.preventDefault();
  const afterElement = getDragAfterElement(taskList, e.clientY);
  const currentDragging = draggedItem;
  if (afterElement == null) {
    taskList.appendChild(currentDragging);
  } else {
    taskList.insertBefore(currentDragging, afterElement);
  }
  saveTasks(); // Save the new order
});
function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll("li:not(.dragging)")];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;

    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}
