const STORAGE_KEY = "todo-card-state";

/* =========================
   INITIAL STATE
========================= */

let todoState = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
  title: "Finish Frontend Challenge",
  completed: false
};

/* =========================
   ELEMENTS
========================= */

const card = document.querySelector('[data-testid="test-todo-card"]');
const checkbox = document.querySelector('[data-testid="test-todo-complete-toggle"]');
let titleEl = document.querySelector('[data-testid="test-todo-title"]');
const status = document.querySelector('[data-testid="test-todo-status"]');
const editBtn = document.querySelector('[data-testid="test-todo-edit-button"]');
const deleteBtn = document.querySelector('[data-testid="test-todo-delete-button"]');
const timeEl = document.querySelector('[data-testid="test-todo-time-remaining"]');

/* =========================
   SAVE TO STORAGE
========================= */

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todoState));
}

/* =========================
   RENDER FUNCTION
========================= */

function renderTitle() {
  const newTitle = document.createElement("h2");
  newTitle.textContent = todoState.title;
  newTitle.setAttribute("data-testid", "test-todo-title");

  const old = document.querySelector('[data-testid="test-todo-title"], input[data-testid="test-todo-edit-input"]');
  if (old) old.replaceWith(newTitle);

  titleEl = newTitle;
}

/* =========================
   APPLY INITIAL STATE
========================= */

function applyState() {
  renderTitle();

  checkbox.checked = todoState.completed;

  if (todoState.completed) {
    titleEl.style.textDecoration = "line-through";
    status.textContent = "Done";
  } else {
    titleEl.style.textDecoration = "none";
    status.textContent = "Pending";
  }
}

applyState();

/* =========================
   COMPLETE TOGGLE
========================= */

checkbox.addEventListener("change", () => {
  todoState.completed = checkbox.checked;

  if (todoState.completed) {
    titleEl.style.textDecoration = "line-through";
    status.textContent = "Done";
  } else {
    titleEl.style.textDecoration = "none";
    status.textContent = "Pending";
  }

  saveState();
});

/* =========================
   EDIT
========================= */

let isEditing = false;

editBtn.addEventListener("click", () => {
  if (!isEditing) {
    const input = document.createElement("input");
    input.value = todoState.title;
    input.setAttribute("data-testid", "test-todo-edit-input");

    titleEl.replaceWith(input);
    editBtn.textContent = "Save";
    isEditing = true;

  } else {
    const input = document.querySelector('[data-testid="test-todo-edit-input"]');

    todoState.title = input.value; // 🔥 SAVE TO STATE

    saveState();
    renderTitle();

    editBtn.textContent = "Edit";
    isEditing = false;
  }
});

/* =========================
   DELETE + UNDO
========================= */

let deletedBackup = null;
let undoTimer = null;

deleteBtn.addEventListener("click", () => {
  deletedBackup = { ...todoState };

  card.classList.add("fade-out");

  setTimeout(() => {
    card.remove();
    showUndoToast();
  }, 400);
});

function showUndoToast() {
  const toast = document.createElement("div");
  toast.className = "undo-toast";
  toast.innerHTML = `Task deleted <button>Undo</button>`;

  document.body.appendChild(toast);

  const undoBtn = toast.querySelector("button");

  undoBtn.addEventListener("click", () => {
    todoState = { ...deletedBackup };

    saveState();

    document.body.appendChild(card);
    card.classList.remove("fade-out");
    card.classList.add("fade-in");

    applyState();

    toast.remove();
  });

  undoTimer = setTimeout(() => {
    toast.remove();
    deletedBackup = null;
  }, 5000);
}

/* =========================
   TIME LOGIC (UNCHANGED)
========================= */

const dueDate = new Date("2026-04-14T18:00:00Z");

function updateTime() {
  const now = new Date();
  const diff = dueDate - now;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (diff < 0) {
    const overdueHours = Math.abs(hours);
    timeEl.textContent = `Overdue by ${overdueHours} hour${overdueHours !== 1 ? "s" : ""}`;
  } 
  else if (diff < 1000 * 60) {
    timeEl.textContent = "Due now!";
  } 
  else if (hours < 24) {
    timeEl.textContent = `Due in ${hours} hour${hours !== 1 ? "s" : ""}`;
  } 
  else if (days === 1) {
    timeEl.textContent = "Due tomorrow";
  } 
  else {
    timeEl.textContent = `Due in ${days} days`;
  }
}

updateTime();
setInterval(updateTime, 60000);