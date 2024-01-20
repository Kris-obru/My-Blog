import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';

export default function Edit(props) {
  const navigate = useNavigate();
  const { id } = useParams();

  // State to manage post data
  const [post, setPost] = useState({
    title: '',
    content: '',
    tags: [],
    isPrivate: false, // New field for post privacy
  });

  // Fetch post data when component mounts
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const postDocRef = doc(props.db, 'posts', id);
        const postDocSnapshot = await getDoc(postDocRef);

        if (postDocSnapshot.exists()) {
          const postData = postDocSnapshot.data();
          setPost({
            title: postData.title,
            content: postData.content,
            tags: postData.tags,
            isPrivate: postData.isPrivate || false, // Set to false if not present
          });
        } else {
          // Handle case where post with given ID doesn't exist
          console.error('Post not found');
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching post data:', error.message);
      }
    };

    fetchPostData();
  }, [props.db, id, navigate]);

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
      const postDocRef = doc(props.db, 'posts', id);
      await updateDoc(postDocRef, post);

      // Update the 'config' document with the new post information
      const configDocRef = doc(props.db, 'posts', 'config');
      await updateDoc(configDocRef, {
        privatePosts: post.isPrivate
          ? arrayUnion(Number(id))
          : arrayRemove(Number(id)),
      });

      navigate(`/${id}`);
    } catch (error) {
      console.error('Error updating post:', error.message);
    }
  };

  return (
    <div>
      <h1>Edit Post</h1>
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
        <button type="submit">Edit Post</button>
      </form>
    </div>
  );
}
