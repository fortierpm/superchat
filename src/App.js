// REACT
import React from "react";
import { useState, useRef } from "react";

// STYLES
import './App.css';

// FIREBASE SDK
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'; // for database
import 'firebase/compat/auth'; // for user authentication/login

// REACT + FIREBASE HOOKS
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

// IDENTIFY FIREBASE PROJECT
firebase.initializeApp({
  // your config
  apiKey: "AIzaSyCQoBqxLnrHQvfeMVHtAuGbTwymNlr4zz0",
  authDomain: "superchat-3d47c.firebaseapp.com",
  projectId: "superchat-3d47c",
  storageBucket: "superchat-3d47c.appspot.com",
  messagingSenderId: "56213905099",
  appId: "1:56213905099:web:63ed3c140d5ff2eca5054e",
  measurementId: "G-N81KZSQP9X"
});

// FIREBASE REFS
const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header">
        
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

// SIGN-IN COMPONENT
function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  );
}

// SIGN-OUT COMPONENT
function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  );
}

// CHATROOM COMPONENT
function ChatRoom() {
  const dummy = useRef();

  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData(query, {idField: "id"});
  
  const [formValue, setFormValue] = useState("");

  const sendMessage = async(e) => {
    e.preventDefault(); // prevent refreshing page
    const { uid, photoURL } = auth.currentUser;

    // create new document in firestore
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    }); 

    setFormValue("");

    dummy.current.scrollIntoView({ behavior: "smooth" }); // keep focus on newest messages
  }

  return (
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <div ref={dummy}></div>
      </main>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    </>
  ); 
}

// CHAT MESSAGE COMPONENT
function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "recieved";

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt="" />
      <p>{text}</p>
    </div>
  );
}

// EXPORT APP COMPONENT
export default App;
