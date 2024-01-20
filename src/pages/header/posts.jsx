import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function Posts(props) {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (props.db && props.config) {
          const colRef = collection(props.db, 'posts');
          const querySnapshot = await getDocs(colRef);
          const postsData = querySnapshot.docs
            .map(doc => ({
              id: doc.id,
              ...doc.data()
            }))
            .filter(post => !isNaN(post.id) && Number.isFinite(+post.id));

          // Order postsData based on the order in props.config.postarr
          const orderedPosts = props.config.postarr
            .map(postId => postsData.find(post => post.id === String(postId)))
            .filter(Boolean)
            .reverse(); // Reverse the order

          setPosts(orderedPosts);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchData();
  }, [props.db, props.config]);

  return (
    <div id="Posts">
      {(props.user && props.user.uid == "D0TkP7a1rph5ZdJJLj673zZuMrC3") ?<div className="allpostspost" onClick={() => navigate("/manager")}>
        Manage Posts
      </div> : ""}
      {posts.map(post => {
        if(post.isPrivate) {
          return;  
        }
        const tags = post.tags.map((tag, index) => (
          <span key={index} className="tag">
            {tag}
          </span>
        ));
        
        return (
          <div
            key={post.id}
            className="allpostspost"
            onClick={() => navigate(`/${Number(post.id)}`)}
          >
            <span>{post.title}</span>
            {tags}
          </div>
        );
      })}
    </div>
  );
}
