import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, collection, getDocs, getDoc } from 'firebase/firestore';

export default function Blog(props) {
  const [post, setPost] = useState();
  
  const { id } = useParams()
  
  useEffect(() => {
    
    (async () => {
      if(typeof props.config === 'undefined') {
          const docRefConfig = doc(props.db,'posts','config')
          const docConfig = await getDoc(docRefConfig).catch((err) => {
            console.log(err)
          })
          props.setConfig(docConfig.data())
        } else {
          if (typeof id === 'undefined' || id > props.config.posts-1) {
            props.setId(props.config.posts-1)
          } else {
            props.setId(id)
          }
        }
      
      if(typeof props.id != 'undefined') {
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
    
  }, [props.id,props.config,id]);

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