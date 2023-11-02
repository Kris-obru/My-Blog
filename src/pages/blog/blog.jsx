import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import config from '../posts/config.json'

export default function Blog() {
  var { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {

    if (typeof id === 'undefined') {
      id = config.posts-1
    }
      // Use dynamic import to load the JSON file
    import(`../posts/${id}.json`)
      .then((module) => {
          // Access the data from the imported module
        const post = module.default;
        setPost(post);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  if (!post) {
    // Loading state, you can show a loading spinner or message here
    return <div>Loading...</div>;
  }

  const fullcontent = `<h1>${post.title}</h1><p> ${post.date}</p><div class="content">${post.content}</div>`;

  return (
    <div id="Blog">
      <div
        className="post"
        key={post.id}
        dangerouslySetInnerHTML={{ __html: fullcontent }}
      ></div>
    </div>
  );
}