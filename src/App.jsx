import './App.css'
import { useParams, BrowserRouter, Route, Routes } from 'react-router-dom'
import { useState, useEffect } from 'react'

import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, collection, getDoc } from "firebase/firestore";


import Blog from "./pages/blog/blog"

import Header from "./pages/header/header"
import Posts from "./pages/header/posts"

import Account from "./pages/account/account"
import Login from "./pages/login/login"
import Create from "./pages/create/create"

import Manager from "./pages/manager/manager"
import Edit from "./pages/edit/edit"

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

  useEffect(() => {
    (async () => {
      if(typeof config === 'undefined') {
        const docRefConfig = doc(db,'posts','config')
        const docConfig = await getDoc(docRefConfig).catch((err) => {
          console.log(err)
        })
        setConfig(docConfig.data())
      }
    })()
  },[db])

  
  return (
    <BrowserRouter>
      <Header id={id} setId={setId} user={user} setUser={setUser} db={db} config={config} setConfig={setConfig} />
        <Routes>
          <Route path="/" element={<Blog id={id} setId={setId} user={user} setUser={setUser} db={db} config={config} setConfig={setConfig} />}/>
          <Route path="/:id" element={<Blog id={id} setId={setId} user={user} setUser={setUser} db={db} config={config} setConfig={setConfig} />}/>
          <Route path="/account" element={<Account id={id} setId={setId} user={user} setUser={setUser} db={db} config={config} setConfig={setConfig} />}/>
          <Route path="/login" element={<Login id={id} setId={setId} user={user} setUser={setUser} db={db} config={config} setConfig={setConfig} />}/>
          <Route path="/create" element={<Create id={id} setId={setId} user={user} setUser={setUser} db={db} config={config} setConfig={setConfig} />}/>
          <Route path="/posts" element={<Posts id={id} setId={setId} user={user} setUser={setUser} db={db} config={config} setConfig={setConfig} />}/>
          <Route path="/manager" element={<Manager id={id} setId={setId} user={user} setUser={setUser} db={db} config={config} setConfig={setConfig} />}/>
          <Route path="/edit/:id" element={<Edit id={id} setId={setId} user={user} setUser={setUser} db={db} config={config} setConfig={setConfig} />}/>
        </Routes>
    </BrowserRouter>
  )
}
