import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import Post from "./components/Post";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import "./App.css";
import { Button, Input } from "@material-ui/core";
import ImageUpload from "./ImageUpload";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
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
        console.log(authUser);
        setUser(authUser);
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
    db.collection("posts").onSnapshot((snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          post: doc.data(),
        }))
      );
    });
  }, []);

  const signUp = (event) => {
    event.preventDefault();

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
    <div className="app">
      <ImageUpload />
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img
                className="app_headerImage"
                src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgQDQ0NCAcSEA0NCA4NDQcPEBARDQgNFRIiFhURExUkKCggGRsxJxUfLTMiKysvOjA6Fx8/OD8uQyg5Oi8BCgoKDg0OFQ8NFS0gFRkrLysuKystKystKy0tLSsrLSstLS0uKysrKystKysrKy0rLS0rLSsrLS0rKysrKysrLf/AABEIAKcBLgMBEQACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAAAQcCBQYEA//EAEkQAAIBAgIGBAcLCAsAAAAAAAABAgMEBREGBxITITFBUXGBFyJVYZGS0hUyQlKToaKjsbPRFBYlVmJllMIjMzQ1NkNydHV2sv/EABsBAQEBAQEBAQEAAAAAAAAAAAECAAYFAwQH/8QAPBEBAQABAQMHCAcHBQAAAAAAAAECAwQFERIhMUFhodEGE1FTcZGx4RQyM3KBwfAVFiM0QkNzIjWDovH/2gAMAwEAAhEDEQA/AOPPwv6yFMCAoAwBTBQBAUwVACApklAEBUALBQCgCwVAFAEBTAgKgCgCwUAQFQBTAwBQSUwICgDAFMxOCe2FAGMFAKAMAUwMAUApgQFAKgSICmCgCAqMCAoBQBYKgCgCwUAQFQBTAgKAICoySgDAFMFAEMTgnthQBYKgCgDAFMFAGAKYGAKAUyRAUAqAFgoBQBYKgBAUApgQFQBTAgKAICoApgQFBIsFQBQBDE4J7gVAFAFgoAgKgCmBgCgFMDAFAGBJTBQBAUAqMCAoBQBYKgBAUwUAQFQBTAgKALBUCSgCwUAQxOCe2FAKYEBUAUAWCgCAqAKYGAKAUyRgCgDAFMFAEBTBUAICgFMCAqAFgoBQBAVACwUAoJFgqAKDE4J7YLBUAICmCgCAqAKYEBQBYKgCgCySgCAqAKYGAKAUAQFMFQAgKYKAICoAWCgFAFgqBIgKYKDE4KPbBAUApgQFQAsFAKAICoApgQFAFgqB7MPwy/uG42NjUqtPJ7uEpKH+p8l3jypHx1to0tGcdXOT21uYaB6Tvlg0u+pRX2yNy4/Dd77HP7ndfBn4P9KfI7+Wt/aHzkH7Z2L1ndl4I8H+lPkd/LW/tD5zEftjYvWd2Xg+dXQbSaKzlgs+HxZU5P0JsqauKpvbY70ak7/Bo7q1uKU93dW06U0s3RqQlCaXXk+J9JZeh+3DUw1JysMpZ2c74lRQUAoAsFAKgBYKAUAQFRgQFAKCRYKDE4J7YICmCoAQFMFAEBUALBQCgCwVAFB1mr7RRYhXlO5zVpbuLq5Zp3E3ypp9HLi+hdWeYWvI3tvH6JpyYfaZdHZ2+HyWNj2l+CYWlaULfaqQgssPoKMYW6azW3LlHPvfHPpCTi5vZd2bTt38XK8Mb13r9n64OZnrcr/AwKK8zrt/yorkV6c8m8evV7vmw8Ld35Gp/Ky/AfN9p/dzD1t9x4W7vyLT+Vl+A+a7W/dzD1t93zfWlrcnmt9gSyz4uNdppeZbJvNdqMvJyf06vd83U2WI6P43bTpTpbTis5WtRKNe0b4KcGs/Sn29RNlwry9TR2rdupMpenrnRey/P8FQaVYFWsLupbVZbUclOjX5b+i+Uu3g0/Omfqwy5U4ut2La8dq0ZqTp6LPRWoPo/WFAGAKAUwICgDAFMFAEBTBUCRAUzE4J7YMAUApgQFAKjAgKAUAWCoAQFAKC7tXkadtgUa7hk3C5uqn7ey2k/VgiXD73t1tvuHH0Yzu/O1S1xXq1Kk6teblUqVJTnUfOc5PNv5z6R2uGGOGMxxnCTmTa21erUjStqMqlScsoUYJuU35kVx4DU1MdPG553hJ1u2w/VZjU4qV1cUaGa/qW5TqR8zy4fOyfOPD1fKDZ8bwwxuXdPHuebF9W2PUIyqUYwuIR4uNFy3qWXPYaWfYs2VNSdb6aG/Nm1bMcuON7ej3+PBs9UssHjO6V/u43ecVT32yv6PJ7Shn058+4NTj+D8u/pr5TC6XG6fXw9Pb+Tz3GJWFDSWjVwWUdzO6o0au6a3NR1PEqbOXBrjn2oZLcOdeGhq6m7csdp+tJbOPTzc8/XobrXTaRdGzuPhQuKlFv4ylHaWfqP0s2jefg/H5Pal5epp9VnH3f+qoP1OpCgCAqMFAFgoBQBgCmBgCgFAFklBicE9sKAMYKAMAUApgQFAKgBYKAUAWCoF3YastF5Zfq7cv6uTJ6nC63PvWf5J8YpE+ruV06CYLZYdhzv75KNarab+tcSXjW9DLajTiua6M1zb68kRbxcTvTatTbNp8xpfVl4Sem9HHw7PxcjjWs7GKlSXuZs29FS8TOEKlaceuTea7kuHWy5h6Xr7NuDZ8MZ57/AFZe6fhw52w0V1m3W9hRx3ZlTnJR90YxUJ0W/hTS8Vx7EsvObLDrj823bhw5Fz2XpnV08fZ18Xo1t6N0thYla01GSqRhdRS4VFLhGr258H17S6jaeXU+e4duy5X0bO839P5z81c4M8ru1fVfUX9NH2y+rXRbT9jn7L8Fr65V+jqD/e0Pupny0vrOU8n/AOZy+7fjFOH6nYBUAUAQFAFgqAKAMYKAUAQFMDAFBBwUe4FAEBQCmBgCgDGCgFAEBTBUAICmXfYf4Xl/1u4+6kT1OE1f91/5J8YpA+l6Hcrx1obXuNV3HvN5b7WXLd7xZfPkE6XC7k4fTceV08/v4X5qPPq7gKZeGObS0af5b7/3Et1Pa577Zjln59rI+E6XDbNz7y/h9HLvu5/yU1hP9qtv95R/9o/Tl0V2W0fZZ+y/BbOuX+7aH/L0/uah8dL6zk/J/wDmcvu34xTZ+t2AICgCwVAFAFgoAgKgCmBAUAoAsg4J7YUAWCoAoAwBQCmBAUAYApgoAwBTLuw156Lyy/V25X1ckHU4XW5t6z/JPjFIn0dwujQDHbPEMP8Ac+/alWpWu4q28nk7q3y2VNdL4ZJvrWfSiXFb12TU2TaPP6X1beMvovo8Oxy+M6rcUhUk8LrQrUW/FjOShWguqXwX2p8epFzN6mz+UGjlj/Hlxy7OeeP66Xv0W1Y1o1YVscqQcISUlh8Htb5roqPll5lnma5cX5tu39jcLhs0vG9d5uHsTra0mpSisNtKu01VU7uaeag4+9pdufF9WS844Tn4tuHYMpfpOpPu+P5RXmDLO7tV131FfTR9cuiuh2n7HP2X4LX1yv8AR1uv3tB/VTPlpfWcp5PfzOX3b8Ypw/U68FgqAKAICmBAVAFAFgoAgKgCmBCDgnthUYKAICgCwVAFAFgoAgKgCmBgCgu7V1Onc4HG3c83GNza1P2dptr6M0M6HC74xujt91JOnhlP17Ypa7tq1KrUo3ENmpSqyhOm/gyTyZUrttPUx1MZnheMvOi3r1ac41KFaUKkJZxrQk4zpvrTXFFNnhjnLjnOMvVXZWGs/H6cVGtGjXy/zakGqj74tL5g5LxdXcGy53jjxx9l5u/j8XnxbWLpBcQcI1oUItNP8ni4zkurabbXdkVMF6G5Nl0ryrLle3w5u9yR9I9dvNCMOq3GJ2cKcc1C6hXqSyzUKdN7Tz6uWXbJBneZ+DeetNLZdS3rnCe283zd1rpvIqlZ26fjSr1KzXxVGOys/XfoZGl0vC8ndK3PU1OqST38/wCSqT9MdUCAoBQBYKgBAUwUAQFQBTAgKALIOCe2FAKALBUAUAQFMCAqAKALBQBAVA6rQDSt4fcSVdOVrX2VWiuLoyXKpFd/FdK7ELyd7bu+l6cuH2mPR29ngsrGdFsAxaMbqjX8eUUliNvKL3ySyUai5Nruayy6B9jmNm3htWwW6WU5p/Tl1ez9cHNz1RPPxMf4Z8E7fil648a9KeUvp0f+3yYeCOr5ej/Dv2h5VP7yz1Pf8jwR1fL0f4d+0PKrfvJPU9/yfWhqjhmt9jrcemEKCi32Nyf2Dy6jLykvD/Tpc/t+TpaFto7gdtKbnsuS8arNqd1fSXKMVwz7FklzfWTz2vMyz2veerJw48Pwk/XvU9pPjle+u6lzXWynlClQ5qhSXvY59PPNvrbPvjOEdhsWyY7LozTx/G+mtUfR+oEBTBUAICgFMCAqAFgoBQBAVAFMxOCe2kQFRgQFAKALBUAUAWCgCAqAKYEBQeiyvryhJys7ypSk+c6U5Qcl52h4Plq6OnqzhqYzKds4txDTbSVcFjVTvUJfah4PxXdOx3+1O9n+fek/lmXqUvZHkp/Y+xeq774n59aT+WZ+pS/AeTB+yNi9V33xfKtplpHNNSxuqk/itQfpWTKmMVjuvZMbxmlPj8WmuK9apJzuK0pzfOrOTlKXa3xLk4dD9uGGOE5OE4TsfMohQBjBQCgFAFgqAEBTBQBAVACwUAoMTgo9xIgKAUAWCoAQFAKYEBUAUwICgCAqAKYEBQBYKgSUAYApgoAwBTAwBQCgCwUAqAFgoBQBAUzE4J7YISUAqMCAoBQBYKgBAUwUAQFQBTAgKALBUAUAYySgCAqAKYGAKAUAYApgYAoBTAgKAVACwUGJwUe2DGCgkoAgKYKgBAUwUAQFRgQFAKAICoApgQFAFgqBJQBYKAICoApgYAoBQBjBQBgCmCgCApmJwT2woAwJKYGAKAUAQFMFQAgKYKAICoAWCgFAFgqAEBTJKAICoApgQFAFgqAKAMAUApgYAoAwBTMTgnthUALBQSICowUAYAoBTAgKAVGBAUAoAsFQAgKAUAWCoEiApgoAgKgCmBAUAWCoAoAsFAEBQYnBPcCgCAqBJTAgKAICowUAYAoBTAgKAVACwUAoAsFQAgKZJQBAVACwUAoAsFQBQBAUwICoAoAs/9k="
                alt=""
              />
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
            <Button onClick={signUp}>SIGN UP</Button>
          </form>
        </div>
      </Modal>
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img
                className="app_headerImage"
                src="data:image/jpeg;base64,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"
                alt=""
              />
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
            <Button onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>
      <div className="app_header">
        <img
          className="app_headerImage"
          src="data:image/jpeg;base64,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"
          alt=""
        />
      </div>
      {user ? (
        <Button onClick={() => auth.signOut()}>Logout</Button>
      ) : (
        <div className="app_loginContainer">
          <Button onClick={() => setOpenSignIn(true)}>Sign in</Button>
          <Button onClick={() => setOpen(true)}>Sign up</Button>
        </div>
      )}
      <h1> Que pedo vato</h1>;
      {posts.map(({ id, post }) => (
        <Post
          key={id}
          username={post.username}
          caption={post.caption}
          imageUrl={post.imageUrl}
        />
      ))}
    </div>
  );
}

export default App;
