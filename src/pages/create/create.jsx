import React, { useState } from 'react';
import { setDoc, doc, arrayUnion } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function Create(props) {
  const navigate = useNavigate();

  // State to manage post data
  const [post, setPost] = useState({
    title: '',
    content: '',
    date: new Date().toLocaleDateString(), // Format the date
    tags: [],
    isPrivate: false, // New field for post privacy
  });

  // Handle input change for form fields
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // If the input is a checkbox, handle it separately
    if (type === 'checkbox') {
      setPost((prevPost) => ({
        ...prevPost,
        [name]: checked,
      }));
    } else {
      setPost((prevPost) => ({
        ...prevPost,
        [name]: value,
      }));
    }
  };

  // Handle changes in the tags input field
  const handleTagsChange = (e) => {
    const tagsInput = e.target.value;
    const tagsArray = tagsInput.split(',').map((tag) => tag.trim());
    setPost((prevPost) => ({
      ...prevPost,
      tags: tagsArray,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Add a new post document to the 'posts' collection
      const postDocRef = doc(props.db, 'posts', `${props.config.posts}`);
      await setDoc(postDocRef, post);

      // Update the 'config' document with the new post information
      const configDocRef = doc(props.db, 'posts', 'config');
      await setDoc(configDocRef, {
        posts: props.config.posts + 1,
        postarr: [...props.config.postarr, props.config.posts],
        privatePosts: post.isPrivate
          ? arrayUnion(props.config.posts)
          : props.config.privatePosts || [],
      });

      // Navigate to the newly created post
      navigate(`/${props.config.posts}`);
    } catch (error) {
      console.error('Error creating post:', error.message);
    }
  };

  return (
    <div>
      <h1>Create Post</h1>
      <form onSubmit={handleSubmit}>
        {/* Title input */}
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={post.title}
            onChange={handleInputChange}
          />
        </label>
        <br />
        {/* Content textarea */}
        <label>
          Content:
          <textarea
            name="content"
            value={post.content}
            onChange={handleInputChange}
          />
        </label>
        <br />
        {/* Tags input */}
        <label>
          Tags (comma-separated):
          <input
            type="text"
            name="tags"
            value={post.tags.join(', ')}
            onChange={handleTagsChange}
          />
        </label>
        <br />
        {/* Private post checkbox */}
        <label>
          Private Post:
          <input
            type="checkbox"
            name="isPrivate"
            checked={post.isPrivate}
            onChange={handleInputChange}
          />
        </label>
        <br />
        {/* Submit button */}
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
}
