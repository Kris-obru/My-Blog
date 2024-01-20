import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { useNavigate, useParams } from 'react-router-dom'
import { doc, collection, getDoc } from 'firebase/firestore';

// Visualizes the right side as the lowest post, tries to move one post right, if it is private it looks for the next one, if there is none it returns -1
function findRight(props) {
  let { postArr, privatePosts } = props.config;

  let postIter = props.id - 1;
  let post = props.id;

  while (postIter >= 0) {
    if (!privatePosts.includes(postIter)) {
      return postIter;
    }

    postIter -= 1;
  }

  if (post === props.id) {
    return -1;
  }
}

// Visualizes the left side as the highest post, tries to move one post left, if it is private it looks for the next one, if there is none it returns -1
function findLeft(props) {
  let { postArr, privatePosts } = props.config;

  let postIter = props.id + 1;
  let post = props.id;

  while (postIter < props.config.posts) {
    console.log("postIter:", postIter);

    if (!privatePosts.includes(postIter)) {
      console.log("Found non-private post:", postIter);
      return postIter;
    }

    postIter += 1;
  }

  if (post === props.id) {
    console.log("No non-private post found.");
    return -1;
  }
}


export default function Header(props) {
  const navigate = useNavigate()

  const [hideLeft,setHideLeft] = useState(false)
  const [hideRight,setHideRight] = useState(false)
  
  useEffect(() => {
    if(typeof props.config !== 'undefined') {
      if(props.id==props.config.postarr[0] || findRight(props) == -1) {
        setHideRight(true)
      } else {
        setHideRight(false)
      }
      if(props.id==props.config.postarr[props.config.posts] || findLeft(props) == -1) {
        setHideLeft(true)
        console.log(props.id==props.config.postarr[props.config.posts])
        console.log(findLeft(props) == -1)
      } else {
        setHideLeft(false)
      }
      if(props.id == -1) {
        setHideLeft(true)
        setHideRight(true)
      }
    }
  },[props.id])

  const handleLogin = (e) => {
    e.preventDefault()
    props.setId(-1)
    navigate("/login")
  }
  const handleAccount = (e) => {
    e.preventDefault()
    props.setId(-1)
    navigate("/account")
  }


  const hideleftcss = {
    visibility: hideLeft ? 'hidden' : 'visible',
    color: hideLeft ? 'rgba(255,255,255,0.0)' : 'rgba(255,255,255,1.0)',
    border: hideLeft ? '1px solid rgba(255,255,255,0.0)' : '1px solid rgba(255,255,255,1.0)',
    cursor: hideLeft ? 'default' : 'pointer',
  }
  const hiderightcss = {
    visibility: hideRight ? 'hidden' : 'visible',
    color: hideRight ? 'rgba(255,255,255,0.0)' : 'rgba(255,255,255,1.0)',
    border: hideRight ? '1px solid rgba(255,255,255,0.0)' : '1px solid rgba(255,255,255,1.0)',
    cursor: hideRight ? 'default' : 'pointer',
  }
  

  const handleLeftArrow = (e) => {
    e.preventDefault();
    if (!hideLeft) {
      const newPost = findLeft(props);
      if (props.user && props.user.uid === 'D0TkP7a1rph5ZdJJLj673zZuMrC3') {
        navigate(`/${props.config.postarr.indexOf(props.id)+1}`)
      } else if (newPost !== -1) navigate(`/${newPost}`);
    }
  };

  const handleRightArrow = (e) => {
    e.preventDefault();
    if (!hideRight) {
      const newPost = findRight(props);
      if (props.user && props.user.uid === 'D0TkP7a1rph5ZdJJLj673zZuMrC3') {
        navigate(`/${props.config.postarr.indexOf(props.id)-1}`)
      } else if (newPost !== -1) navigate(`/${newPost}`);
    }
  };

  const handleAllPosts = (e) => {
    e.preventDefault()
    props.setId(-1)
    navigate("/posts")
  }

  const handleCreation = () => {
    if(props.user && props.user.uid == "D0TkP7a1rph5ZdJJLj673zZuMrC3")
    navigate("/create")
  }
  
  return (
    <div id="Header">
      <div>
        <h1 onClick={handleCreation}>Obru</h1>
      </div>
      <div>
        <button onClick={handleLeftArrow} className="postbutton postbuttonleft" style={hideleftcss}><FontAwesomeIcon icon={faArrowLeft} /></button>
        <button className="postbutton postbuttonallposts" onClick={handleAllPosts}>All Posts</button>
        <button onClick={handleRightArrow} className="postbutton postbuttonright" style={hiderightcss}><FontAwesomeIcon icon={faArrowRight} /></button>
      </div>
      
      <div>
        <button className="postbutton loginaccountbutton" onClick={props.user ? handleAccount : handleLogin}>{props.user ? "Account" : "Login"}</button>
      </div>
      
    </div>
  )
}