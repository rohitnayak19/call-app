const addNote = document.querySelector("#add-note");
const formContainer = document.querySelector(".form-container");
const closeBtn = document.querySelector(".closeForm");
const stack = document.querySelector(".stack");
const upBtn = document.querySelector("#upBtn");
const downBtn = document.querySelector("#downBtn");
const form = document.querySelector("form");

const imageUrlInput = document.querySelector("#image-url");
const fullNameInput = document.querySelector("#full-name");
const homeTownInput = document.querySelector("#home-town");
const purposeInput = document.querySelector("#purpose");
const catergoryInput = document.querySelectorAll("input[name='category']");

let lastDeletedNote = null;
let undoTimer = null;

addNote.addEventListener("click", () => {
  formContainer.style.display = "initial";
});

closeBtn.addEventListener("click", () => {
  formContainer.style.display = "none";
  form.removeAttribute("data-edit-index");
  form.reset();
});

// Save Task (for adding only)
const saveTask = (obj) => {
  const savedTask = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTask.push(obj);
  localStorage.setItem("tasks", JSON.stringify(savedTask));
};

// Form submit
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const imageUrl = imageUrlInput.value.trim();
  const fullName = fullNameInput.value.trim();
  const homeTown = homeTownInput.value.trim();
  const purpose = purposeInput.value.trim();

   const date = new Date().toDateString();
  console.log(date)

  let selected;
  catergoryInput.forEach((cat) => {
    if (cat.checked) {
      selected = cat.value;
    }
  });

  if (!imageUrl || !fullName || !homeTown || !purpose || !selected) {
    return alert("Please fill all the fields!");
  }

  const taskObj = { imageUrl, fullName, homeTown, purpose, selected, date};
  const editIndex = form.getAttribute("data-edit-index");
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  if (editIndex !== null) {
    tasks[editIndex] = taskObj;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    form.removeAttribute("data-edit-index");
  } else {
    saveTask(taskObj);
  }

  form.reset();
  formContainer.style.display = "none";
  showCards();
  attachEditEvents();
  attachDeleteEvents();
});

// Show cards
function showCards() {
  stack.innerHTML = "";
  const allTasks = JSON.parse(localStorage.getItem("tasks")) || [];

  if (allTasks.length === 0) {
    stack.innerHTML = "No tasks";
    return;
  }

  allTasks.forEach(({ fullName, homeTown, purpose, imageUrl, date }, index) => {
    stack.innerHTML += `
      <div class="card" data-index="${index}">
        <div class="card-top">
          <img src="${imageUrl}" alt="profile" class="avatar" />
          <div>
          <span>${index + 1}</span>
            <i class="ri-edit-box-line edit" data-index="${index}"></i>
            <i class="ri-delete-bin-line delete" data-index="${index}"></i>
          </div>
        </div>
        <h2 class="fullName">${fullName}</h2>
        <span class="date">${date}</span>
        <div class="info">
          <span>Home town</span>
          <span>${homeTown}</span>
        </div>
        <div class="info">
          <span>Purpose</span>
          <span>${purpose}</span>
        </div>
        <div class="buttons">
          <button class="call"><i class="ri-phone-line"></i> Call</button>
          <button class="msg">Message</button>
        </div>
      </div>
    `;
  });
}

// Edit buttons
function attachEditEvents() {
  const editBtns = document.querySelectorAll(".edit");
  editBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      const task = tasks[index];

      imageUrlInput.value = task.imageUrl;
      fullNameInput.value = task.fullName;
      homeTownInput.value = task.homeTown;
      purposeInput.value = task.purpose;

      catergoryInput.forEach((cat) => {
        cat.checked = cat.value === task.selected;
      });

      formContainer.style.display = "initial";
      form.setAttribute("data-edit-index", index);
    });
  });
}

// Delete buttons
function attachDeleteEvents() {
  const deleteBtns = document.querySelectorAll(".delete");
  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

      lastDeletedNote = {...tasks[index], index:index};
      tasks.splice(index, 1); // remove task
      localStorage.setItem("tasks", JSON.stringify(tasks));


      showCards();
      attachEditEvents();
      attachDeleteEvents();
      showToast()
    });
  });
}

function showToast(){
  const undoToast= document.querySelector(".undo-toast");
  const undoBtn = document.querySelector(".undo-btn");
  undoToast.style.display = "block";

  undoToast.classList.add("show")

  if(undoTimer) clearTimeout(undoTimer);

  undoTimer = setTimeout(() => {
    undoToast.classList.remove("show")
    clearTimeout(undoTimer)
    lastDeletedNote = null;
  }, 5000);

  undoBtn.addEventListener("click", (e)=>{
    if(lastDeletedNote){
      const alltasks = JSON.parse(localStorage.getItem("tasks"));

      alltasks.splice(lastDeletedNote.index, 0, {
      imageUrl: lastDeletedNote.imageUrl,
      fullName: lastDeletedNote.fullName,
      homeTown: lastDeletedNote.homeTown,
      purpose: lastDeletedNote.purpose,
      selected: lastDeletedNote.selected,
    })
    
    localStorage.setItem("tasks",JSON.stringify(alltasks))
    }
    lastDeletedNote=null;
    showCards()
    attachEditEvents()
    attachDeleteEvents()
    updateCard()

    undoToast.classList.remove("show")
    clearTimeout(undoTimer)
  })
}

 function updateCard() {
  const cards = document.querySelectorAll(".stack .card");
  cards.forEach((card, i) => {
    if (i < 3) {
      card.style.zIndex = 3 - i; // top card gets highest z-index
      card.style.transform = `translateY(${i * 10}px) scale(${1 - i * 0.02})`;
      card.style.opacity = `${1 - i * 0.02}`;
      card.style.pointerEvents = "auto";
    } else {
      // Hide remaining cards
      card.style.zIndex = 0;
      card.style.opacity = "0";
      card.style.pointerEvents = "none";
      card.style.transform = `translateY(0) scale(0.9)`;
    }
  });
}

updateCard()
upBtn.addEventListener("click", () => {
  const lastChild = stack.lastElementChild;
  if (lastChild) {
    stack.insertBefore(lastChild, stack.firstElementChild);
    updateCard();
  }
});

downBtn.addEventListener("click", () => {
  const firstChild = stack.firstElementChild;
  if (firstChild) {
    stack.appendChild(firstChild)
    updateCard()
  }
});
// Initialize
showCards();
attachEditEvents();
attachDeleteEvents();