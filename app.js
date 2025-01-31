import { db } from "./firebaseconfig.js";
import { addDoc , collection , getDocs , Timestamp  } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

const title = document.querySelector("#title");
const description = document.querySelector('#description');
const form = document.querySelector("#form");
const ol = document.querySelector("ol");

const globalarr = []

async function get() {
    const querySnapshot = await getDocs(collection(db, "todos"));
    querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
    globalarr.push(doc.data())
});
    render()
    // console.log(globalarr)
}

get()
// render()

function render(){
    globalarr.map(item => {
        ol.innerHTML += 
        `<li>Title: ${item.title} <br>
        Description: ${item.description}</li>
        <button id="editBtn">Edit ToDo</button>
        <button id="deleteBtn">Delete ToDo</button> <br>`

    })
}
const editBtn = document.querySelectorAll("#editBtn");
const deleteBtn = document.querySelectorAll("#deleteBtn");

editBtn.addEventListener('click', async event => {
    console.log('edit button')
})

form.addEventListener("submit", async event => {
    event.preventDefault()
    // console.log(title.value)
    // console.log(description.value)

    try {
        const docRef = await addDoc(collection(db, "todos"), {
          title: title.value,
          description: description.value,
          date: Timestamp.fromDate(new Date())
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
      render()
})
