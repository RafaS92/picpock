import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import "../Post.css";
import Avatar from "@material-ui/core/Avatar";
import firebase from "firebase";

function Post({
  postId,
  username,
  caption,
  imageUrl,
  user,
  commentId,
  likesId,
}) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();

    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };

  const postLike = (event) => {
    event.preventDefault();
    const storyRef = db
      .collection("posts")
      .doc(postId)
      .collection("likes")
      .doc(likesId);

    const increment = firebase.firestore.FieldValue.increment(1);
    storyRef.update({ count: increment });
  };

  return (
    <div className="post">
      <div className="post_header">
        <Avatar
          className="post_avatar"
          alt="V"
          src="/static/images/avatar/1.jpg"
        />
        <h3>{username}</h3>
      </div>
      <img className="post_image" src={imageUrl} alt="" />
      <h4 className="post_text">
        <strong>{username}</strong>
        <br />
        {caption}

        <button className="like_button" onClick={postLike}>
          Like{" "}
        </button>
      </h4>
      <div className="post_comments">
        {comments.map((comment, commentId) => (
          <div key={commentId}>
            <strong>{comment.username}</strong>
            <p>{comment.text}</p>
            <br />
          </div>
        ))}
      </div>

      {user && (
        <form className="post_commentBox">
          <input
            className="post_input"
            type="text"
            placeholder="Add your post..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="post_button"
            disabled={!comment}
            type="subtmit"
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
