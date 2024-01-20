import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, collection, getDocs, getDoc } from 'firebase/firestore';

export default function Blog(props) {
  const [post, setPost] = useState();
  
  const { id } = useParams()
  const navigate = useNavigate()
  
  useEffect(() => {
    (async () => {
        if(typeof props.config != 'undefined') {
          if (!Number.isInteger(Number(id)) || !props.config.postarr.includes(Number(id))) {
            navigate(`/${props.config.postarr[props.config.posts-1]}`)
          } else {
            // let postIter = Number(id);
            // while(props.config.privatePosts.includes(postIter) || !(postIter >= 0)) {
            //   postIter-=1;
            // } 
            props.setId(Number(id))
          }
        }
      
      if(Number.isInteger(Number(props.id))) {
        const docRefPost = doc(props.db,'posts',`${props.id}`,)
        await getDoc(docRefPost)
        .then((docPost) => {
          setPost(docPost.data())
        })
        .catch((err) => {
          console.log(err)
        })
      }
    })()
    
  }, [props.id,props.config,id,props.db]);

  if (!post) {
    // Loading state, you can show a loading spinner or message here
    return <div>Loading...</div>;
  }

  const tags = post.tags.map((tag, index) => {
    return ( 
      <span key={index} className="tag">{tag}</span>
    )
  });
  
  return (
    <div id="Blog">
      <div
        className="post"
        key={post.id}
      >
        <h1>{post.title}</h1>
        <h3>{post.date} {tags}</h3>
        <div className="content" dangerouslySetInnerHTML={{ __html: post.content }}></div>
      </div>
    </div>
  );
}