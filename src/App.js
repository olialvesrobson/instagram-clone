import React, {useState, useEffect  } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './config/firebase'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './imageUpload';



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
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [modalStyle] = useState(getModalStyle);
  const [openImage, setOpenImage] = useState(false);

  const [ username, setUsername] = useState("");
  const [ email, setEmail] = useState("");
  const [ password, setPassword] = useState("");
  const [ user, setUser] = useState(null);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) =>{
      if (authUser) {
        //User has logged in...
        console.log(authUser);
        setUser(authUser);
      } else {
        //User has logged out...
        setUser(null);
      }

    })
    return () => {
      //Perform some cleanup actions
      unsubscribe();
    }
  }, [user, username])

  const handleSignUp = (event) => {
      event.preventDefault();

      auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message))
  }

  const handleSignIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  }
  // useEffecct: Runs a piece of code based on a specific condition
  useEffect(() => {
    // this is where the code runs
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);

  return (
    <div className="app">
      
      {/* Bun */}

      {/** sign up modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
            <img className="app_headerImage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt="instagram-clone-logo" />
            </center>

            <Input type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={handleSignUp}>Sign Up</Button>
          
          </form>
          
        </div>
      </Modal>

      {/** sign in modal */}
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
            <img className="app_headerImage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt="instagram-clone-logo" />
            </center>

            <Input type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={handleSignIn}>Sign In</Button>
          
          </form>
          
          
          
        </div>
      </Modal>

      {/** image pick */}
      <Modal
        open={openImage}
        onClose={() => setOpenImage(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          {/** upload images  */}
          {user?.displayName ? (
            <ImageUpload username={user.displayName}/>
          ): (
            <h4>Sorry you need to login to upload</h4>
          )}
          {/** end upload images  */}
        </div>
      </Modal>

      {/** app header  */}
      <div className="app_header">
        <Button className="" 
          onClick={() => setOpenImage(true)}>
            <ion-icon size="large" name="camera-outline" />
        </Button>
        <img className="app_headerImage"
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        alt="instagram-clone-logo"></img>

        {user ? 
          (
            <Button onClick={() => auth.signOut() }>Logout</Button>
          ): (
            <div>
              <Button onClick={() => setOpenSignIn(true) }>Sign In</Button>
              <Button onClick={() => setOpen(true) }>Sign Up</Button>
            </div>

            
          )
        }
      </div>

      
      <div className="app__posts">
        <div className="app__postsLeft">
          {
            posts.map(({id, post}) =>(
              <Post postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
            ))
          }
        </div>
        
      </div>
      
      
      

      <footer className="app__footer">
        <h3>Powered by Robson O. Alves</h3>
      </footer>

      <div className="app__menufooter">
        
        <button className="app__menubutton app__menubutton_sides">
          <ion-icon name="home-outline"/>
        </button>

        <button className="app__menubutton app__menubutton_center"
          onClick={() => setOpenImage(true)}
        >
          <ion-icon name="add-circle-outline"/>
        </button>

        <button className="app__menubutton app__menubutton_sides">
          <ion-icon name="heart-outline"/>
        </button>
      </div>


      



    </div>
  );
}

export default App;
