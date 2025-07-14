const addNote = document.querySelector("#add-note");
const formContainer = document.querySelector(".form-container");
const closeBtn = document.querySelector(".closeForm");


const stack = document.querySelector(".stack");
const upBtn = document.querySelector("#upBtn")
const downBtn = document.querySelector("#downBtn")

const form = document.querySelector("form");

const imageUrlInput = document.querySelector("#image-url")
const fullNameInput = document.querySelector("#full-name")
const homeTownInput = document.querySelector("#home-town")
const purposeInput = document.querySelector("#purpose")

const catergoryInput = document.querySelectorAll("input[name='category']")

addNote.addEventListener("click", (e)=>{
    formContainer.style.display = "initial"
})

closeBtn.addEventListener("click", (e)=>{
    formContainer.style.display = "none"
})


const saveTask = (obj)=>{
    const savedTask = JSON.parse(localStorage.getItem('tasks')) || [];
    if(savedTask){
        savedTask.push(obj)
        localStorage.setItem('tasks', JSON.stringify(savedTask))
    }
}

form.addEventListener("submit",(e)=>{
    e.preventDefault()
    const imageUrl = imageUrlInput.value.trim()
    const fullName = fullNameInput.value.trim()
    const homeTown = homeTownInput.value.trim()
    const purpose = purposeInput.value.trim()

    let selected;
    catergoryInput.forEach((cat)=>{
        if(cat.checked){
            selected = cat.value;
        }
    })

    if(!imageUrl || !fullName || !homeTown || !purpose || !selected){
        return alert("please fill all the fields!")
    }

    saveTask({
        imageUrl,
        fullName,
        homeTown,
        purpose,
        selected
    })

    form.reset()
    formContainer.style.display = "none"
    showCards()
    // console.log(imageUrl, fullName, homeTown, purpose, selected);
    
})

function showCards() {
  stack.innerHTML = "";
  const allTasks = JSON.parse(localStorage.getItem("tasks")) || [];

  if(allTasks.length === 0){
    stack.innerHTML = "No taks"
    return;
  }

  allTasks.forEach(({ fullName, homeTown, purpose, imageUrl }) => {
    stack.innerHTML += `
      <div class="card">
        <img src="${imageUrl}" alt="profile" class="avatar" />
        <h2>${fullName}</h2>
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
showCards()

function updateCard(){
    const cards = document.querySelector(".stack.card")
    for(let i =0 ; i < 3; i++){
        let card = cards[i];
        if(card){
            card.style.zIndex = 3 - i;
            card.style.transform = `translateY${i * 10}px scale(${1-i * 0.02})`
            card.style.opacity = `${1- i * 0.02}`
        }
    }
}

upBtn.addEventListener("click",(e)=>{
    const lastChild = stack.lastElementChild;
    if(lastChild){
        stack.insertBefore(lastChild, stack.firstElementChild)
        updateCard()
    }
})


downBtn.addEventListener("click",(e)=>{
    const firstChild = stack.firstElementChild;
    if(firstChild){
        stack.appendChild(firstChild)
        updateCard()
    }
})




