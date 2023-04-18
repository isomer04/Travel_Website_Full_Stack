import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
  orderBy,
  getDocs,
  query,
  doc,
  deleteDoc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC3LTxzLQE9mWlljZsHZSnG0e8FuS1BtIQ",
  authDomain: "fullstack-project-travel.firebaseapp.com",
  projectId: "fullstack-project-travel",
  storageBucket: "fullstack-project-travel.appspot.com",
  messagingSenderId: "838492743759",
  appId: "1:838492743759:web:881b2fedb090346440623a",
  measurementId: "G-GRCXD5F9DS",
};

const app = initializeApp(firebaseConfig);
console.log(JSON.stringify(app) + " app")
const auth = getAuth(app);

let user = {};

const logoutBtn = document.getElementById("logout-button");
const userEmail = document.getElementById("user-email");
const addPostBtn = document.getElementById("addPostBtn");
const editContainer = document.getElementById("editContainer");

editContainer.style.display = "none";
// function closeEditForm() {
//   document.getElementById("editPostForm").style.display = "none";
// }

const logout = async () => {
  try {
    await auth.signOut();
    location.reload();
  } catch (error) {
    console.log(error.message);
  }
};
logoutBtn.addEventListener("click", logout);

// Get a reference to the posts collection in Firestore
const db = getFirestore();
const postsRef = collection(db, "posts");

// Add a new post to the collection
const addPost = async (title, content, author) => {
  try {
    const docRef = await addDoc(postsRef, {
      title: title,
      content: content,
      created_at: Timestamp.now(),
      author: author,
    });
    console.log("New post added with ID: ", docRef.id);
    // Refresh the page to show the new post
    location.reload();
  } catch (error) {
    console.error("Error adding post: ", error);
  }
};

// Handle the form submission when the "Save changes" button is clicked
addPostBtn.addEventListener("click", function (e) {
  e.preventDefault();

  // Get the values from the form
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;
  const author = document.getElementById("author").value;

  // Validate the form
  if (title.length == 0 || content.length == 0 || author == 0) {
    alert("Please fill in all the fields");
    return false;
  }

  // Add the new post to the database
  addPost(title, content, author);
});

//Show blog post in the page
const q = query(collection(db, "posts"), orderBy("created_at", "desc"));
getDocs(q)
  .then((querySnapshot) => {
    const postsList = document.getElementById("postsList");
    querySnapshot.forEach((doc) => {
      const post = doc.data();

      // Format the date using toLocaleDateString()
      const createdDate = new Date(
        post.created_at.seconds * 1000
      ).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      const addPostBtnOnly = document.getElementById("addPostBtnOnly");

      // Hide the buttons by default
      addPostBtnOnly.style.display = "none";
      editPostForm.style.display = "none";

      auth.onAuthStateChanged((currentUser) => {
        let postElement;
        user = currentUser;
        if (user) {
          console.log(JSON.stringify(user) + "this is user");
          userEmail.innerHTML = "<b> User Logged In: </b> " + user.email;
          // Show the buttons when a user is logged in
          addPostBtnOnly.style.display = "block";
          editContainer.style.display = "block";

          postElement = `
<div class="card">
  <div class="card-body">
    <h4 class="card-title">${post.title}</h4>
    <p class="card-title">${createdDate} <em>By ${post.author}</em></p>
    <p class="card-text">${post.content}</p>
    <a href="#" class="card-link" data-bs-toggle="modal"  data-bs-target="#editPostModal2" data-post-id="${doc.id}" onclick="prefillEditPostModal('${doc.id}')">Edit</a>
    <a href="#" class="card-link" data-post-id="${doc.id}" id="deletePostLink" onclick="deletePost('${doc.id}')">Delete</a>
  </div>
</div>`;
          console.log(" inside auth");
        } else {
          userEmail.innerHTML = "";
          postElement = `
<div class="card">
  <div class="card-body">
    <h4 class="card-title">${post.title}</h4>
    <p class="card-title">${createdDate} <em>By ${post.author}</em></p>
    <p class="card-text">${post.content}</p>
  </div>
</div>`;
          console.log(" outside auth");
        }
        postsList.innerHTML += postElement;
      });
    });
  })
  .catch((error) => {
    console.error("Error reading posts: ", error);
  });

// ============================ working end

// Get the buttons for adding, editing, and deleting posts
// const editPostForm = document.getElementById("editPostForm");
// const deletePostLink = document.getElementById("deletePostLink");

const addPostBtnOnly = document.getElementById("addPostBtnOnly");

// Hide the buttons by default
addPostBtnOnly.style.display = "none";
editPostForm.style.display = "none";
// deletePostLink.style.display = "none";

auth.onAuthStateChanged((currentUser) => {
  user = currentUser;
  if (user) {
    console.log(JSON.stringify(user) + "this is user");
    userEmail.innerHTML = "<b> User Logged In: </b> " + user.email;
    // Show the buttons when a user is logged in
    addPostBtnOnly.style.display = "block";
    // editPostForm.style.display = "block";
    // deletePostLink.style.display = "block";
  } else {
    userEmail.innerHTML = "";
  }
});

window.deletePost = async (postId) => {
  try {
    console.log("Deleting post with ID: ", postId);

    await deleteDoc(doc(postsRef, postId));
    console.log("Post deleted successfully");
    // Refresh the page to remove the deleted post
    location.reload();
  } catch (error) {
    console.error("Error deleting post: ", error);
  }
};

// Define a function to edit a post
window.prefillEditPostModal = (postId) => {
  // Get the post document from Firestore using its ID
  const postDocRef = doc(db, "posts", postId);

  // Get the post data and fill in the values in the edit post modal
  getDoc(postDocRef)
    .then((doc) => {
      if (doc.exists()) {
        const post = doc.data();
        // const editPostForm = document.getElementById("editPostForm");
        editPostForm.style.display = "block";
        editPostForm.elements.title.value = post.title;
        editPostForm.elements.content.value = post.content;
        editPostForm.dataset.postId = postId;
        // location.reload();
      } else {
        console.log("No such post document!");
      }
    })
    .catch((error) => {
      console.error("Error getting post document: ", error);
    });
};

// Define the editPost function
const editPost = async (postId, title, content) => {
  try {
    const postDocRef = doc(db, "posts", postId);

    await updateDoc(postDocRef, { title, content });

    console.log("Post updated successfully");
    // Hide the edit post modal
    const editPostModal = document.getElementById("editPostModal");
    // const bsModal = bootstrap.Modal.getInstance(editPostModal);
    // bsModal.hide();
    // Refresh the page to display the updated post
    location.reload();
  } catch (error) {
    console.error("Error updating post: ", error);
  }
};

// Handle the submit event for the edit post form
// const editPostForm = document.getElementById("editPostForm");
editPostForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = editPostForm.elements.title.value.trim();
  const content = editPostForm.elements.content.value.trim();
  const postId = editPostForm.dataset.postId;
  editPost(postId, title, content);
  editPostForm.style.display = "none";
  // location.reload();
});

// Get a reference to the Edit Post Modal
// const editPostModal = document.getElementById("editPostModal");

// // Open the Edit Post Modal and prefill the form with the post data
// const openEditPostModal = (postId, postTitle, postContent) => {
//   const editPostForm = document.getElementById("editPostForm");
//   const editPostTitle = document.getElementById("editPostTitle");
//   const editPostContent = document.getElementById("editPostContent");
//   const editPostBtn = document.getElementById("editPostBtn");

//   editPostTitle.value = postTitle;
//   editPostContent.value = postContent;

//   // Handle the form submission to update the post data
//   editPostBtn.onclick = async () => {
//     try {
//       await updatePost(
//         postId,
//         editPostTitle.value,
//         editPostContent.value
//       );
//       console.log("Post updated successfully");
//       // Refresh the page to show the updated post data
//       location.reload();
//     } catch (error) {
//       console.error("Error updating post:", error);
//     }
//   };

//   // Open the Edit Post Modal
//   const modal = new bootstrap.Modal(editPostModal);
//   modal.show();
// };

// // Update the post data in the Firestore database
// const updatePost = async (postId, postTitle, postContent) => {
//   try {
//     const postRef = doc(db, "posts", postId);
//     await updateDoc(postRef, {
//       title: postTitle,
//       content: postContent,
//       updated_at: serverTimestamp(),
//     });
//   } catch (error) {
//     console.error("Error updating post:", error);
//     throw error;
//   }
// };

// // Example usage:
// // Assume you have a button with data-post-id, data-post-title, and data-post-content attributes in each post card
// const postCards = document.querySelector(".post-cards");
// postCards.addEventListener("click", (event) => {
//   const target = event.target;
//   if (target.classList.contains("edit-post-btn")) {
//     const postId = target.dataset.postId;
//     const postTitle = target.dataset.postTitle;
//     const postContent = target.dataset.postContent;
//     openEditPostModal(postId, postTitle, postContent);
//   }
// });

// // Update an existing post in the collection
// const updatePost = async (postId, title, content) => {
//   try {
//     await postsRef.doc(postId).update({
//       title: title,
//       content: content,
//       updated_at: firebase.firestore.Timestamp.now(),
//     });
//     console.log("Post updated successfully");
//     // Refresh the page to show the updated post
//     location.reload();
//   } catch (error) {
//     console.error("Error updating post: ", error);
//   }
// };

// // Handle the form submission when the "Save changes" button is clicked
// editPostBtn.addEventListener("click", function (e) {
//   e.preventDefault();

//   // Get the values from the form
//   const title = document.getElementById("editTitle").value;
//   const content = document.getElementById("editContent").value;
//   const postId = document.getElementById("postId").value;

//   // Validate the form
//   if (title.length == 0 || content.length == 0) {
//     alert("Please fill in all the fields");
//     return false;
//   }

//   // Update the post in the database
//   updatePost(postId, title, content);
// });

// // Delete an existing post from the collection
// const deletePost = async (postId) => {
//   try {
//     await doc(postsRef, postId).delete();
//     console.log("Post deleted successfully");
//     // Refresh the page to remove the deleted post
//     location.reload();
//   } catch (error) {
//     console.error("Error deleting post: ", error);
//   }
// };

// Handle the "Delete" button click event
// function deletePost(event) {
//   event.preventDefault();

//   // Get the ID of the post to be deleted
//   const postId = event.target.dataset.postId;

//   // Confirm with the user before deleting the post
//   if (confirm("Are you sure you want to delete this post?")) {
//     // Delete the post from the database
//     deletePost(postId);
//   }
// }
