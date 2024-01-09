import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBnMIBrMgOsZppP2YvuUL4RiuGjYb-zWjo",
  authDomain: "fir-9-test-fcc03.firebaseapp.com",
  projectId: "fir-9-test-fcc03",
  storageBucket: "fir-9-test-fcc03.appspot.com",
  messagingSenderId: "675877601826",
  appId: "1:675877601826:web:90c6eaf630c822817f007b",
};

// init firebase app
initializeApp(firebaseConfig);

// init services
const db = getFirestore();
const auth = getAuth();

// collection ref
const colRef = collection(db, "books");

//queries
const q = query(colRef, orderBy("createdAt"));

// // real time collection data
// onSnapshot(q, (snapshot) => {
//   let books = [];
//   snapshot.docs.forEach((doc) => {
//     books.push({ ...doc.data(), id: doc.id });
//   });
//   console.log(books);
// });

const unsubCol = onSnapshot(q, (snapshot) => {
  let books = [];

  snapshot.docs.forEach((doc) => {
    const data = doc.data();

    // Log the document data for debugging
    console.log("Document data:", data);

    // Check if the author field exists and has the expected value
    // if (data && data.author === "Joshua Mensah") {
    books.push({ ...data, id: doc.id });
    // }
  });

  console.log("Filtered books:", books);
});

// adding docs
const addBookForm = document.querySelector(".add");
addBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp(),
  }).then(() => {
    addBookForm.reset();
  });
});

// deleting documents
const deleteBookForm = document.querySelector(".delete");
deleteBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const docRef = doc(db, "books", deleteBookForm.id.value);

  deleteDoc(docRef).then(() => {
    deleteBookForm.reset();
  });
});

//get a single document
const docRef = doc(db, "books", "vQsTfAdT7snTYmM8pOi0");

// getDoc(docRef).then((doc) => {
//   console.log(doc.data(), doc.id);
// });

const unsubDoc = onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id);
});

//updateing a document
const updateForm = document.querySelector(".update");
updateForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const docRef = doc(db, "books", updateForm.id.value);

  updateDoc(docRef, {
    title: "updated title",
  }).then(() => {
    updateForm.reset();
  });
});

//signing users up
const signupForm = document.querySelector(".signup");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = signupForm.email.value;
  const password = signupForm.password.value;
  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      // console.log("user created:", cred.user);
      signupForm.reset();
    })
    .catch((err) => {
      console.log(err.message);
    });
});

//logging in and out
const logoutButton = document.querySelector(".logout");
logoutButton.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      // console.log("the user logged out");
    })
    .catch((err) => {
      console.log(err.message);
    });
});

const loginForm = document.querySelector(".login");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      // console.log("the user logged in:", cred.user);
    })
    .catch((err) => {
      console.log(err.message);
    });
});

//subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
  console.log("user status changed:", user);
});

//unsubscribing from chanfes (auth & db)
// const unsubButton = document.querySelector(".unsub");
// unsubButton.addEventListener("click", () => {
//   console.log("unsubscribing");
//   unsubCol();
//   unsubDoc();
//   unsubAuth();
// });
