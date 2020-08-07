import React from "react";
import "../Post.css";

function Post() {
  return (
    <div className="post">
      <h3>Username</h3>
      <img
        className="post_image"
        src="https://post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/02/322868_1100-1100x628.jpg"
      />
      <h4>Username: caption</h4>
    </div>
  );
}

export default Post;
