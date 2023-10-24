import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Blog from "./pages/blog/blog"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
      </Routes>
    </BrowserRouter>
  )
}
