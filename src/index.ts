
type task = {
  id: number;
  content: string;
  state: boolean;
};

const storedPendingTasks: string = localStorage.getItem("pendingTasks") || "[]";
let pendingTasks: task[] = JSON.parse(storedPendingTasks);
let newId: number;

const storedDoneTasks: string = localStorage.getItem("doneTasks") || "[]";
let doneTasks: task[] = JSON.parse(storedDoneTasks);

function addTask(event: Event, inputElement: HTMLInputElement): void {
  

  if (pendingTasks.length > 0) {
    newId = pendingTasks[pendingTasks.length - 1].id + 1;
  } else {
    newId = 0;
  }

  const newTask: task = {
    id: newId,
    content: inputElement.value,
    state: false,
  };

  pendingTasks.push(newTask);
  localStorage.setItem("pendingTasks", JSON.stringify(pendingTasks));
  taskCreator();
  inputElement.value = "";
}

function taskCreator(): void {
  const pendingTasksDiv: HTMLDivElement | null =
    document.querySelector("#pending-tasks");
  const doneTasksDiv: HTMLDivElement | null =
    document.querySelector("#done-tasks");

  if (pendingTasksDiv && doneTasksDiv) {
   
    pendingTasksDiv.innerHTML = "";
    doneTasksDiv.innerHTML = "";

   
    pendingTasks.forEach((task) => {
      const taskDiv = document.createElement("div");
      taskDiv.innerHTML = `
          <div id="${task.id}" class="task">${task.content} 
          <button  class="done"  id="done-${task.id}" onclick="doneTaskFunction(${task.id})">Done</button>
          <button class="update"  id="done-${task.id}" onclick="updateTaskFunction(${task.id})">Update</button>
          <button  class="delete"  id="done-${task.id}" onclick="deleteTaskFunction('pendingTasks',${task.id})">Delete</button>
          </div>
        
        `;
      pendingTasksDiv.appendChild(taskDiv);
    });

   
    doneTasks.forEach((task) => {
      const taskDiv = document.createElement("div");
      taskDiv.innerHTML = `
        <div id="${task.id}" class="task" >${task.content} 
        <button  class="delete"  id="done-${task.id}" onclick="deleteTaskFunction('doneTasks',${task.id})">Delete</button>
        </div>
       
      `;
      doneTasksDiv.appendChild(taskDiv);
    });
  }
}

function doneTaskFunction(taskId: number): void {
  const taskIndex = pendingTasks.findIndex((task) => task.id === taskId);
  if (taskIndex !== -1) {
    const updatingTask: task = pendingTasks[taskIndex];
    if (doneTasks.length > 0) {
      newId = doneTasks[doneTasks.length - 1].id + 1;
    } else {
      newId = 0;
    }
    updatingTask.id = newId;
    updatingTask.state = true;
    doneTasks.push(updatingTask);
    pendingTasks.splice(taskIndex, 1);
    localStorage.setItem("pendingTasks", JSON.stringify(pendingTasks));
    localStorage.setItem("doneTasks", JSON.stringify(doneTasks));

    taskCreator();
  }
}

function deleteTaskFunction(taskName: string, taskId: number): void {
  let modArray: task[] = [];

  if (taskName === "pendingTasks") {
    modArray = pendingTasks;
  
  } else if (taskName === "doneTasks") {
    modArray = doneTasks;
   
  }
  const taskIndex = modArray.findIndex((task) => task.id === taskId);
  if (taskIndex !== -1) {
    modArray.splice(taskIndex, 1);
    localStorage.setItem(taskName, JSON.stringify(modArray));
  }
  taskCreator();
}

function updateTaskFunction(taskId: number) {
  const inputElement: HTMLInputElement | null = document.querySelector("input");

  if (inputElement) {
    const taskIndex = pendingTasks.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
      inputElement.value = pendingTasks[taskIndex].content;
      inputElement.focus();
      deleteTaskFunction("pendingTasks", taskId);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const inputElement: HTMLInputElement | null = document.querySelector("input");
  const addTaskButton: HTMLButtonElement | null =
    document.querySelector("#add-button");
  const pendingTasksDiv: HTMLDivElement | null =
    document.querySelector("#pending-tasks");

  if (addTaskButton && inputElement && pendingTasksDiv) {
    addTaskButton.addEventListener("click", (event:MouseEvent)=>addTask(event, inputElement));

    taskCreator();
  }
});
