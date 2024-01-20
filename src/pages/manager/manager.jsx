import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'
import { collection, getDoc, setDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';

const renameDocument = async (props, collectionPath, oldDocumentId, newDocumentId) => {
  try {
    // Get a reference to the old and new documents
    const oldDocRef = doc(props.db, collectionPath, oldDocumentId);
    const newDocRef = doc(props.db, collectionPath, newDocumentId);

    // Get the data from the old document
    const snapshot = await getDoc(oldDocRef);
    const data = snapshot.data();

    // Set the data in the new document
    await setDoc(newDocRef, data);

    // Delete the old document
    await deleteDoc(oldDocRef)

  } catch (error) {
    console.error('Error renaming document:', error);
  }
};


export default function Manager(props) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const currentDate = new Date();

  const handleDelete = async (postId, postTitle, isPrivate) => {
    const userConfirmed = window.confirm(`Are you sure you want to delete the post "${postTitle}"?`);

    if (userConfirmed) {
      try {
        // Remove postId from postarr
        const updatedPostarr = props.config.postarr.filter(id => Number(id) !== Number(postId));
        // Remove postId from privatePosts (if private)
        const updatedPrivatePosts = isPrivate
          ? props.config.privatePosts.filter(id => Number(id) !== Number(postId))
          : props.config.privatePosts || [];

        // Update Firestore config document
        const configDocRef = doc(props.db, 'posts', 'config');
        await updateDoc(configDocRef, {
          posts: props.config.posts - 1,
          postarr: updatedPostarr,
          privatePosts: updatedPrivatePosts,
        });

        renameDocument(props, "posts", `${postId}`, "deleted--" + postId + `--${currentDate}`);
        
        navigate('/manager');
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  if (!(props.user && props.user.uid === 'D0TkP7a1rph5ZdJJLj673zZuMrC3')) {
    useEffect(() => {
      navigate('/');
    }, []);
  } else {
    useEffect(() => {
      const fetchData = async () => {
        try {
          if (props.db && props.config) {
            const colRef = collection(props.db, 'posts');
            const querySnapshot = await getDocs(colRef);
            const postsData = querySnapshot.docs
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
              .filter((post) => !isNaN(post.id) && Number.isFinite(+post.id));

            const orderedPosts = props.config.postarr
              .map((postId) => postsData.find((post) => post.id === String(postId)))
              .filter(Boolean)
              .reverse();

            setPosts(orderedPosts);
          }
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      };

      fetchData();
    }, [props.db, props.config]);

    return (
      <div id="Manager">
        {posts.map((post) => (
          <div key={post.id} className="managerpost">
            <span>{post.title}</span>
            <span className="managerpostoptions">
              <button onClick={() => navigate(`/edit/${post.id}`)}>Edit</button>
              <button onClick={() => handleDelete(post.id, post.title, post.isPrivate)}>Delete</button>
            </span>
          </div>
        ))}
      </div>
    );
  }
}
