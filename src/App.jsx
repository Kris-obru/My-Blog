import './App.css'
import { useParams, BrowserRouter, Route, Routes } from 'react-router-dom'
import { useState, useEffect } from 'react'

import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, collection, getDoc } from "firebase/firestore";


import Blog from "./pages/blog/blog"
import Header from "./pages/header/header"

import { app } from './Firebase'


export default function App() {

  const [id,setId] = useState()
  const [user,setUser] = useState()
  const [config,setConfig] = useState()
  
  const db = getFirestore(app);

  useEffect(() => {
    const auth = getAuth();
    const handleBeforeUnload = () => {
      // Sign out the user when the tab or browser is closed
      if (userState) {
        signOut(auth);
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user]); // sign out

  
  return (
    <BrowserRouter>
      <Header id={id} setId={setId} user={user} setUser={setUser} db={db} config={config} setConfig={setConfig} />
        <Routes>
          <Route path="/" element={<Blog id={id} setId={setId} user={user} setUser={setUser} db={db} config={config} setConfig={setConfig} />}/>
          <Route path="/:id" element={<Blog id={id} setId={setId} user={user} setUser={setUser} db={db} config={config} setConfig={setConfig} />}/>
        </Routes>
    </BrowserRouter>
  )
}
