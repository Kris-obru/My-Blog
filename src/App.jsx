import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useState, useEffect } from 'react'

import { getAuth, signOut } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

import Blog from "./pages/blog/blog"
import Header from "./pages/header/header"

import { app } from './Firebase'


export default function App() {

  const [id,setId] = useState(null)

  const [user,setUser] = useState()
  const db = getFirestore(app);

  useEffect(() => {
    const auth = getAuth();
    const handleBeforeUnload = () => {
      // Sign out the user when the tab or browser is closed
      if (userState) {
        signOut(auth);
      }
    };

    // Add the beforeunload event listener
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Clean up the beforeunload event listener when the component unmounts
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user]); // sign out

  
  return (
    <BrowserRouter>
      <Header id={id} />
        <Routes>
          <Route path="/" element={<Blog id={id} setId={setId} user={user} setUser={setUser} db={db} />}/>
          <Route path="/:id" element={<Blog id={id} setId={setId} user={user} setUser={setUser} db={db} />}/>
        </Routes>
    </BrowserRouter>
  )
}
