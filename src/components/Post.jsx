import React from "react";
import "../Post.css";
import Avatar from "@material-ui/core/Avatar";

function Post() {
  return (
    <div className="post">
      <div className="post_header">
        <Avatar
          className="post_avatar"
          alt="V"
          src="/static/images/avatar/1.jpg"
        />
        <h3>Username</h3>
      </div>
      <img
        className="post_image"
        src="https://post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/02/322868_1100-1100x628.jpg"
        alt=""
      />
      <h4 className="post_text">
        <strong>Papi</strong>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos architecto
        nostrum dicta consequatur odio suscipit iste lastrongorum corporis
        mollitia accusantium.
      </h4>
    </div>
  );
}

export default Post;
