import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import Post from "./components/Post";
import Modal from "@material-ui/core/Modal";
import "./App.css";
import { Button, Input } from "@material-ui/core";
import ImageUpload from "./components/ImageUpload";
import InstagramEmbed from "react-instagram-embed";

// const useStyles = makeStyles((theme) => ({
//   paper: {
//     position: "absolute",
//     width: 380,
//     backgroundColor: theme.palette.background.paper,
//     border: "2px solid #000",
//     boxShadow: theme.shadows[5],
//     padding: theme.spacing(2, 4, 3),
//   },
// }));

function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // User has logged in..
        setUser(authUser);
        console.log(authUser.displayName);
      } else {
        //user has logged out...
        setUser(null);
      }
    });

    return () => {
      //perform some cleanup actions
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  const signUp = (event) => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));

    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpenSignIn(false);
  };

  return (
    <div className="app" id="start">
      <Modal className="modals" open={open} onClose={() => setOpen(false)}>
        <div className="makeStyles">
          <form className="app_signup">
            <center>
              <img className="app_headerImage" src="images/logo.png" alt="" />
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" color="primary" onClick={signUp}>
              SIGN UP
            </Button>
          </form>
        </div>
      </Modal>
      <Modal
        className="modals"
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div className="makeStyles">
          <form className="app_signup">
            <center>
              <img className="app_headerImage" src="images/logo.png" alt="" />
            </center>

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button color="primary" onClick={signIn}>
              Sign In
            </Button>
          </form>
        </div>
      </Modal>

      <div className="app_header">
        <a href="#start">
          <img className="app_headerImage" src="images/logo.png" alt="" />{" "}
        </a>

        {user ? (
          <div className="app_loginContainer">
            <Button
              variant="outlined"
              className="auth_buttons"
              color="default"
              onClick={() => auth.signOut()}
            >
              Logout
            </Button>
          </div>
        ) : (
          <div className="app_loginContainer">
            <Button
              variant="outlined"
              color="default"
              className="auth_buttons"
              onClick={() => setOpenSignIn(true)}
            >
              Sign in
            </Button>

            <Button
              variant="outlined"
              color="default"
              className="auth_buttons"
              onClick={() => setOpen(true)}
            >
              Sign up
            </Button>
          </div>
        )}
      </div>

      <div className="app_posts">
        <div className="app_postsLeft">
          {user ? (
            <ImageUpload username={user.displayName} />
          ) : (
            <h3 className="login_message">
              You need to login to post, like and comment.
            </h3>
          )}
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              likes={id}
              commentId={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
              likesId={id}
            />
          ))}
        </div>

        <div className="app_postsRight">
          <InstagramEmbed
            url="https://www.instagram.com/p/B_NenirJP6Z/?utm_source=ig_embed&amp;utm_campaign=loading"
            maxWidth={300}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
