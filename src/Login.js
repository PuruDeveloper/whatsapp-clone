import { Button } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { auth, provider } from "./firebase";
import "./Login.css";
import { actionTypes } from "./Reducer";
import { useStateValue } from "./StateProvider";
import db from "./firebase";

function Login() {
  const [{ user, userName, userEmail }, dispatch] = useStateValue();
  const [userPassword, setUserPassword] = useState("");
  const [users, setUsers] = useState([]);
  let photoURL = "";
  let uid = "";
  let testValue = 0;
  let username = "";
  let useremail = "";

  useEffect(() => {
    const unsubscribe = db.collection("users").onSnapshot((snapshot) =>
      setUsers(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );
  }, []);

  async function googleSignUp() {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        // console.log(result.user.uid);

        setUserPassword(Math.floor(Math.random() * 10000000));
        setTimeout(() => {}, 5000);
        //If the user is already registered then we take his username and useremail and uid from the database because he can edit those.
        {
          users.map((user) => {
            for (let i = 0; i < 1; i++) {
              if (user.data.uid === result.user.uid) {
                testValue = 1;
                username = user.data.username;
                useremail = user.data.useremail;
                uid = user.data.uid;
                photoURL = user.data.userphoto;
              }
              break;
            }
          });
        }

        //If testValue === 0 then the user is here for the first time
        //If testValue !== 0 then the user has already been here befor and is a registered user.

        if (testValue === 0) {
          //Dispatching action so that application knows user has logged in
          dispatch({
            type: actionTypes.SET_USER,
            user: result.user,
            userName: result.user.displayName,
            userEmail: result.user.email,
            uid: result.user.uid,
            photoURL: result.user.photoURL,
          });
          db.collection("users").add({
            uid: result.user.uid,
            username: result.user.displayName,
            useremail: result.user.email,
            userpassword: Math.floor(Math.random() * 10000000),
            userphoto: result.user?.photoURL,
            description: "",
          });
          testValue = 0;

          alert("Welcome to the chatsapp");
        } else if (testValue > 0) {
          dispatch({
            type: actionTypes.SET_USER,
            user: username,
            userName: username,
            userEmail: useremail,
            uid: uid,
            photoURL: photoURL,
          });
          alert("We are glad you came back");
          testValue = 0;
        }
      })
      .catch((error) => alert(error.message));
  }
  return (
    <div className="login">
      <div className="login__container">
        <div className="login__text">
          <h1>Sign up to chatsapp</h1>
        </div>

        <Button onClick={googleSignUp}>Sign In With Google</Button>
        {/* <Button>Sign In Manually</Button> */}
      </div>
    </div>
  );
}

export default Login;
