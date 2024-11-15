import React, { useState } from "react";
import axios from "axios";
import TinyLoader from "../TinyLoader/TinyLoader";
import App from "../App";

const Register = ({ navigateTo }) => {
  const [valueFirst, setValueFirst] = useState("");
  const [valueLast, setValueLast] = useState("");
  const [valueEmail, setValueEmail] = useState("");
  const [valuePassword, setValuePassword] = useState("");
  const [inputValid, setInputValid] = useState([false, false, false, false]);
  const [validForm, setValidForm] = useState(true);
  const [inAction, setInAction] = useState(false);
  const [error, setError] = useState("");
  const signUrl = "http://localhost:3000/api/auth/sign";

  // const postRegister = async (event) => {
  //   event.preventDefault();
  //   setValidForm(true);
  //   setInAction(true);

  //   const dataPost = {
  //     firstname: valueFirst,
  //     lastname: valueLast,
  //     email: valueEmail,
  //     password: valuePassword,
  //   };

  //   try {
  //     const res = await axios.post(signUrl, dataPost);
  //     setToken(res.data.token);
  //     App.ReloadApp();
  //   } catch (err) {
  //     setValidForm(false);
  //     setInAction(false);
  //     setError("Email address already exists!");
  //   }
  // };

  const postRegister = async (event) => {
    event.preventDefault();
    setValidForm(true);
    setInAction(true);

    const dataPost = {
      firstname: valueFirst,
      lastname: valueLast,
      email: valueEmail,
      password: valuePassword,
    };

    try {
      const res = await axios.post(signUrl, dataPost);
      setToken(res.data.token);
      App.ReloadApp();
    } catch (err) {
      setValidForm(false);
      setInAction(false);
      if (err.response && err.response.status === 409) {
        // Assuming the backend responds with 409 for conflict (duplicate email)
        setError("This email address is already registered!");
      } else {
        setError("An error occurred. Please try again.");
      }
    }

  };

  const checkForm = (target) => {
    const inputs = [...inputValid];
    const inputName = target.name;
    let pos;

    switch (inputName) {
      case "firstname":
      case "lastname":
        pos = inputName === "firstname" ? 0 : 1;
        inputs[pos] = target.value.length >= 2;
        break;
      case "email":
        pos = 2;
        const regEmail = new RegExp(
          /^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+(\.[a-zA-Z]{2,})/g
        );
        inputs[pos] = regEmail.test(target.value);
        break;
      case "password":
        pos = 3;
        inputs[pos] = target.value.length >= 4;
        break;
      default:
        console.error("Unknown field name!");
        break;
    }

    target.className = inputs[pos] ? "valid" : "error";
    setInputValid(inputs);
    setValidForm(!inputs.every((el) => el === true));
  };

  const setToken = (userToken) => {
    sessionStorage.setItem("token", JSON.stringify(userToken));
  };

  // If form is being submitted, show loader
  if (inAction) {
    return <TinyLoader />;
  }

  // If form is not being submitted, show the registration form
  return (
    <>
      <div className="login">
        <h2>
          <i className="fa-solid fa-file-signature"></i> Sign up!
        </h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={postRegister} disabled={validForm}>
          <label htmlFor="Prenom">First Name</label>
          <input
            id="Prenom"
            name="firstname"
            type="text"
            placeholder="First Name"
            onChange={(e) => {
              setValueFirst(e.target.value);
              checkForm(e.target);
            }}
            required
          />
          <label htmlFor="Nom">Last Name</label>
          <input
            id="Nom"
            name="lastname"
            type="text"
            placeholder="Last Name"
            onChange={(e) => {
              setValueLast(e.target.value);
              checkForm(e.target);
            }}
            required
          />
          <label htmlFor="Email">Email</label>
          <input
            id="Email"
            name="email"
            type="email"
            placeholder="Ex: example@groupomania.com"
            onChange={(e) => {
              setValueEmail(e.target.value);
              checkForm(e.target);
            }}
            required
          />
          <label htmlFor="Password">Password</label>
          <input
            id="Password"
            name="password"
            type="password"
            placeholder="password"
            onChange={(e) => {
              setValuePassword(e.target.value);
              checkForm(e.target);
            }}
            required
          />
          <input type="submit" disabled={validForm} value="Register" />
        </form>
      </div>
      <div className="sign">
        <h3>Already a member?</h3>
        <button value="Login" onClick={navigateTo}>
          Log in
        </button>
      </div>
    </>
  );
};

export default Register;
