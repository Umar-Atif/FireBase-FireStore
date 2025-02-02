import { db } from "./firebaseconfig.js";
import { addDoc , collection , getDocs , Timestamp , doc , updateDoc , deleteDoc , query , orderBy , limit  } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

const title = document.querySelector("#title");
const description = document.querySelector('#description');
const form = document.querySelector("#form");
const div = document.querySelector("div");

// Global Array
const globalarr = []

// Get Data
async function get() {
    const q = query(collection(db, 'todos'), orderBy('date', "desc"))
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
    globalarr.push({...doc.data(), id: doc.id})
});
render(globalarr)
}

// Render Data
function render(arr) {
    div.innerHTML = ''
    arr.map((item) => {
        div.innerHTML += `
        <div class="box">
        <h2>Title: ${item.title}</h2>
        <h2>Description: ${item.description}</h2>
        <button id="editBtn">Edit ToDo</button>
        <button id="deleteBtn">Delete ToDo</button>`
    })

    // Edit & Delete
    const editBtn = document.querySelectorAll("#editBtn");
    const deleteBtn = document.querySelectorAll("#deleteBtn");

    editBtn.forEach((item, index) => {
        item.addEventListener('click', async event => {
            // console.log('edit')
            const editPromptTitle = prompt("Enter Updated Title");
            const editPromptDescription = prompt("Enter Updated Description");

            const todoRef = doc(db, "todos", globalarr[index].id);
            await updateDoc(todoRef, {
              title: editPromptTitle,
              description: editPromptDescription
            });
            globalarr[index].title = editPromptTitle
            globalarr[index].description = editPromptDescription
            render(globalarr)
        })
    })

    deleteBtn.forEach((item, index) => {
        item.addEventListener('click', async event => {
            // console.log('delete')
            await deleteDoc(doc(db, "todos", globalarr[index].id));
            globalarr.splice(index, 1)
            render(globalarr)
        })
    })
}

get()

// Form 
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
        globalarr.unshift({
            title: title.value,
            description: description.value,
            date: Timestamp.fromDate(new Date()),
            id: docRef.id
        })

        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
      render(globalarr)

      title.value = '';
      description.value = '';
})
