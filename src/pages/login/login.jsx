import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendEmailVerification } from "firebase/auth";

export default function Login(props) {

  const navigate = useNavigate("/Account")

  const [login, setLogin] = useState(true)
  const [message, setMessage] = useState("")
  // Declare state variables to store user input

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  }); // create account

  const sendVerificationEmail = (user) => {
    sendEmailVerification(user)
    .then(() => {
      setMessage("Sent verificaitoin email")
    }).catch((error) => {
      console.log(error);
    });
  }

  // Handle user login
  const handleLogin = (event) => {
    event.preventDefault();

      const auth = getAuth();

      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        if (userCredential.user.emailVerified) {
          props.setUser(userCredential.user)
          navigate("/account")
          //SIGNED IN
        } else {
          setMessage(<>Email has not been verified.<br/><button onClick={sendVerificationEmail(userCredential.user)}>Send email</button></>)
        }
      })
      .catch((error) => {
        setMessage(error.message)
      });
  };

  const handleSubmit = (event) => {
      event.preventDefault();
      // Handle form submission logic here

      if (formData.password != '') {


        if (formData.password == formData.confirmPassword) {

          const auth = getAuth();

          createUserWithEmailAndPassword(auth, formData.email, formData.password)
          .then((userCredential) => {
            sendEmailVerification(userCredential.user)
            .then(() => {
              setLogin(true)
              setMessage("Email verification sent to " + "\"" + formData.email + "\"." + " Confirm to log in.")
              // Email verification sent!
              // ...
            });
          })
          .catch((error) => {
            setMessage(error.message)
          });

        } else {
          setMessage("Passwords do not match!")
        }
      }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const loginpage = (
    <>
        <h1>Login</h1>

        <form onSubmit={handleLogin} autoComplete="off">
          <input className="inputfield" type="email" placeholder="example@email.com" id="email" value={email} onChange={(event) => setEmail(event.target.value)} required={true} />
          <br />
          <input className="inputfield" type="password" placeholder="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)} required={true} />
          <br /><br />
          <button type="submit" className="button">Login</button>
          <br /><br />
          <button type="button" className="button" onClick={() => {setLogin(false); setMessage("")}} >No login? Create Account</button>
        </form>

        <p>
          {message}
        </p>

    </>
  );

  const createpage = (
    <>
          <h1>Create account</h1>

          <form onSubmit={handleSubmit} autoComplete="off">
            <input className="inputfield" type="email" placeholder="example@email.com" id="email" name="email" value={formData.email} onChange={handleInputChange} />
            <br />
            <input className="inputfield" type="password" placeholder="Password" id="password" name="password" value={formData.password} onChange={handleInputChange} />
            <br />
            <input className="inputfield" type="password" placeholder="Confirm Password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} />
            <br /><br />
            <button type="submit" className="button">Create Account</button>
            <br /><br />
            <button type="button" className="button" onClick={() => {setLogin(true); setMessage("")}} >Already Registered? Log In</button>
          </form>

          <p>
            {message}
          </p>

    </>
  )

  if(!props.user) {
    return (
      <div id="Login">
        <div className="centered vert">
          {login ? loginpage : createpage}
        </div>
      </div>
    );
  }
}