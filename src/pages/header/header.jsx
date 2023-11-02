import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { useParams } from 'react-router-dom'
import config from '../posts/config.json'

export default function Header(props) {
  var { id } = useParams()
  

  const handleLeftArrow = () => {
    
  }
  
  const handleRightArrow = () => {
    
  }
  
  return (
    <>
    <div id="Header">
      <div>
        <h1>My Blog</h1>
      </div>
      <div>
        <button onClick={handleLeftArrow}><FontAwesomeIcon icon={faArrowLeft} /></button>
        <button>All Posts</button>
        <button onClick={handleRightArrow}><FontAwesomeIcon icon={faArrowRight} /></button>
      </div>

    </div>
    <div id="Main">
      {props.children}
    </div>
    </>
  )
}