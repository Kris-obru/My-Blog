import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Blog from "./pages/blog/blog"
import Header from "./pages/header/header"

export default function App() {
  return (
    <BrowserRouter>
      <Header>
        <Routes>
          <Route path="/:id" element={<Blog />}/>
        </Routes>
      </Header>
    </BrowserRouter>
  )
}
