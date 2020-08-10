import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import "../Post.css";
import Avatar from "@material-ui/core/Avatar";
import firebase from "firebase";
import { Button } from "@material-ui/core";

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
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    let unsubscribe;
    let likesdata;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });

      //   likesdata = db
      //     .collection("posts")
      //     .doc(postId)
      //     .collection("likes")
      //     .onSnapshot((snapshot) => {
      //       setLikes(snapshot.docs.map((doc) => doc.data()));
      //     });
    }
    return () => {
      unsubscribe();
      likesdata();
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

    console.log("key");
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
      <div className="post_body">
        <img className="post_image" src={imageUrl} alt="" />
        <h4 className="post_text">
          <strong>{username}</strong>
          <br />
          {caption}
        </h4>
        {likes}
      </div>
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
          <Button className="like_button" onClick={postLike}>
            <i className="fa fa-heart fa-lg"></i>
          </Button>

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
