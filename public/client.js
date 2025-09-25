// FRONT-END (CLIENT) JAVASCRIPT HERE

let appdata = []

const submit = async function( event ) {
  event.preventDefault()
  
  const task = document.querySelector( "#task" )
  const president = document.querySelector("#president")
  const vicePresident = document.querySelector("#vicePresident")
  const treasurer = document.querySelector("#treasurer")
  const secretary = document.querySelector("#secretary")

  const presForm = document.getElementById("presidentTasks");
  const viceForm = document.getElementById("vicePresidentTasks");
  const treForm = document.getElementById("treasurerTasks");
  const secForm = document.getElementById("secretaryTasks");
  json = { 
    "assignee": {
      "president": president.checked,
      "vice president": vicePresident.checked,
      "treasurer": treasurer.checked,
      "secretary": secretary.checked
    },
    "task": task.value,
    "complete": false,
    "partnerTask": false
  }
  
  body = JSON.stringify( json )

  appdata.push(json)

  const response = await fetch( "/submit", {
    method:"POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body 
  })

  if (!response.ok) {
    if (response.status === 401) {
      window.location.href = '/auth.html';
      return;
    }
  }

  const text = await response.text()

  await fetchData()

  task.value = ""
  president.checked = false
  vicePresident.checked = false
  treasurer.checked = false
  secretary.checked = false
}


function createFormElements() {
  const presForm = document.getElementById("presidentTasks");
  const viceForm = document.getElementById("vicePresidentTasks");
  const treForm = document.getElementById("treasurerTasks");
  const secForm = document.getElementById("secretaryTasks");

  presForm.innerHTML = "";
  viceForm.innerHTML = "";
  treForm.innerHTML = "";
  secForm.innerHTML = "";

  appdata.forEach((item, idx) => {
    for (const role in item.assignee) {
      if(item.assignee[role]) {
        
        const taskCard = document.createElement("div");
        taskCard.className = "card mb-2";
        
        const cardBody = document.createElement("div");
        cardBody.className = "card-body p-2";
        
        const taskRow = document.createElement("div");
        taskRow.className = "d-flex align-items-center justify-content-between";
        
        const taskInfo = document.createElement("div");
        taskInfo.className = "d-flex align-items-center";
        
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "form-check-input me-2";
        checkbox.checked = item.complete;
        checkbox.onchange = async function(e) {
          e.preventDefault();
          await updateTaskCompletion(item._id, checkbox.checked);
        };
        
        const taskText = document.createElement("span");
        taskText.className = checkbox.checked ? "text-decoration-line-through text-muted" : "";
        taskText.textContent = item.task;
        
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "btn btn-outline-danger btn-sm";
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.onclick = async function(e) {
          e.preventDefault();
          await deleteTask(item._id);
        };
        
        taskInfo.appendChild(checkbox);
        taskInfo.appendChild(taskText);
        taskRow.appendChild(taskInfo);
        taskRow.appendChild(deleteBtn);
        cardBody.appendChild(taskRow);
        taskCard.appendChild(cardBody);

        if (role === "president") {
          presForm.appendChild(taskCard);
        } else if (role === "vice president") {
          viceForm.appendChild(taskCard);
        } else if (role === "treasurer") {
          treForm.appendChild(taskCard);
        } else if (role === "secretary") {
          secForm.appendChild(taskCard);
        }
      }
    }
  });
}

async function deleteTask(taskId) {
  const response = await fetch(`/delete/${taskId}`, {
    method: "DELETE"
  });
  
  if (response.ok) {
    await fetchData();
  }
}

async function updateTaskCompletion(taskId, complete) {
  const response = await fetch(`/update/${taskId}`, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ complete: complete })
  });
  if (response.ok) {
    await fetchData();
  }
}

async function fetchData() {
  const response = await fetch('/data');
  
  if (!response.ok) {
    if (response.status === 401) {
      window.location.href = '/auth.html';
      return;
    }
  }
  
  appdata = await response.json();
  createFormElements();
}

async function fetchCurrentData() {
  const response = await fetch('/data');
  const currentData = await response.json();
  return currentData;
}

async function checkAuthStatus() {
  try {
    const response = await fetch('/auth/status');
    const data = await response.json();
    
    if (!data.authenticated) {
      window.location.href = '/auth.html';
      return false;
    }
    
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (welcomeMessage) {
      welcomeMessage.textContent = `Welcome, ${data.username}!`;
    }
    return true;
  } catch (error) {
    window.location.href = '/auth.html';
    return false;
  }
}

async function logout() {
  try {
    const response = await fetch('/logout', {
      method: 'POST'
    });
    
    if (response.ok) {
      window.location.href = '/auth.html';
    }
  } catch (error) {
  }
}
window.onload = async function() {
  const authenticated = await checkAuthStatus();
  if (!authenticated) {
    return;
  }
  
  const submitButton = document.querySelector('.btn-success');
  submitButton.onclick = submit;
  
  const logoutBtn = document.getElementById('logoutBtn');
  logoutBtn.onclick = logout;

  fetchData();
}