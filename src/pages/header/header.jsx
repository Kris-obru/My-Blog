import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { doc, collection, getDoc } from 'firebase/firestore';

export default function Header(props) {
  const navigate = useNavigate()

  const [hideLeft,setHideLeft] = useState(false)
  const [hideRight,setHideRight] = useState(false)

  const [config, setConfig] = useState({"posts":3})
  
  useEffect(() => {
    if(props.id != null) {
      if(props.id==0) {
        setHideRight(true)
      } else {
        setHideRight(false)
      }
      if(props.id==config.posts-1) {
        setHideLeft(true)
      } else {
        setHideLeft(false)
      }
    }

    (async () => {
      

    })()

  },[props.id])

    


  const hideleftcss = {
    visibility: hideLeft ? 'hidden' : 'visible',
    cursor: hideLeft ? 'default' : 'pointer',
  }
  const hiderightcss = {
    visibility: hideRight ? 'hidden' : 'visible',
    cursor: hideRight ? 'default' : 'pointer',
  }
  

  const handleLeftArrow = (e) => {
    e.preventDefault()
    if(!hideLeft) {
      navigate(`/${parseInt(props.id,10)+1}`)
    }
  }
  
  const handleRightArrow = (e) => {
    e.preventDefault()
    if(!hideRight) {
      navigate(`/${parseInt(props.id,10)-1}`)
    }
  }
  
  return (
    <div id="Header">
      <div>
        <h1>Obru</h1>
      </div>
      <div>
        <button onClick={handleLeftArrow} className="postbutton postbuttonleft" style={hideleftcss}><FontAwesomeIcon icon={faArrowLeft} /></button>
        <button className="postbutton postbuttonallposts">All Posts</button>
        <button onClick={handleRightArrow} className="postbutton postbuttonright" style={hiderightcss}><FontAwesomeIcon icon={faArrowRight} /></button>
      </div>

    </div>
  )
}