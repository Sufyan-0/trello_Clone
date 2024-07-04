const main = document.querySelector("#main");
const addCardBtn = document.querySelector("#addCard");

const addTask = (event) => {
  event.preventDefault();

  const currentForm = event.target;
  const value = currentForm.elements[0].value;
  const parent = currentForm.parentElement;
  const ticket = createTicket(value);

  if (!value) return;

  parent.insertBefore(ticket, currentForm);

  const h3Value = parent.children[0].innerText;

  if (!Array.isArray(savedTasks[h3Value])) {
    savedTasks[h3Value] = [];
  }

  savedTasks[h3Value].push(value);

  localStorage.setItem("savedTasks", JSON.stringify(savedTasks));

  currentForm.reset();
};

const myCreateCard = (cardTitle) => {
  const myDiv = document.createElement("div");
  const myH3 = document.createElement("h3");
  const myForm = document.createElement("form");
  const myInput = document.createElement("input");

  const h3Text = document.createTextNode(cardTitle);

  myDiv.setAttribute("class", "column");
  myInput.setAttribute("type", "text");
  myInput.setAttribute("placeholder", "add task");

  myH3.appendChild(h3Text);
  myForm.appendChild(myInput);
  myDiv.appendChild(myH3);
  myDiv.appendChild(myForm);

  myForm.addEventListener("submit", addTask);

  // Add event listeners for drag over and drop on the card
  myDiv.addEventListener("dragover", handleDragOver);
  myDiv.addEventListener("drop", handleDrop);

  return myDiv;
};

const createTicket = (value) => {
  const ticket = document.createElement("p");
  const elementText = document.createTextNode(value);

  ticket.setAttribute("draggable", "true");
  ticket.appendChild(elementText);

  // Add event listeners for drag and drop
  ticket.addEventListener("dragstart", handleDragStart);
  ticket.addEventListener("dragend", handleDragEnd);

  return ticket;
};

let draggedElement = null;

const handleDragStart = (event) => {
  draggedElement = event.target;
  event.target.style.opacity = 0.5;
  console.log('Drag started:', event.target.innerText);
};

const handleDragEnd = (event) => {
  event.target.style.opacity = "";
  console.log('Drag ended');
};

const handleDragOver = (event) => {
  event.preventDefault();
  console.log('Drag over:', event.target);
};

const handleDrop = (event) => {
  event.preventDefault();
  console.log('Drop:', event.target);
  const target = event.target.closest(".column");

  if (target && draggedElement) {
    target.insertBefore(draggedElement, target.querySelector("form"));
    updateLocalStorage();
  }
};

const updateLocalStorage = () => {
  savedTasks = {};

  document.querySelectorAll(".column").forEach((column) => {
    const title = column.querySelector("h3").innerText;
    const tasks = Array.from(column.querySelectorAll("p")).map((task) => task.innerText);

    savedTasks[title] = tasks;
  });

  localStorage.setItem("savedTasks", JSON.stringify(savedTasks));
};

let savedTasks = JSON.parse(localStorage.getItem("savedTasks"));

if (!savedTasks) {
  savedTasks = {};
}

for (const title in savedTasks) {
  const card = myCreateCard(title);

  const arrayOfTasks = savedTasks[title];

  for (let i = 0; i < arrayOfTasks.length; i++) {
    const p = createTicket(arrayOfTasks[i]);

    card.insertBefore(p, card.lastElementChild);
  }

  main.insertBefore(card, addCardBtn);
}

addCardBtn.addEventListener("click", () => {
  const cardTitle = prompt("Enter card name?");

  if (cardTitle) {
    const yourDiv = myCreateCard(cardTitle);
    main.insertBefore(yourDiv, addCardBtn);
  }
});

// Add event listeners for drag over and drop
main.addEventListener("dragover", handleDragOver);
main.addEventListener("drop", handleDrop);
