import React, { useState } from "react";
import axios from "axios";
import TinyLoader from "../TinyLoader/TinyLoader";
// Import App reload function if needed
import App from "../App";

const Login = ({ navigateTo }) => {
  // useState is to update our state
  const [valueEmail, setValueEmail] = useState("");
  const [valuePassword, setValuePassword] = useState("");
  const [inputValid, setInputValid] = useState([false, false]);
  const [validForm, setValidForm] = useState(true);
  const [inAction, setInAction] = useState(false);
  const [error, setError] = useState("");
  const userUrl = "http://localhost:3000/api/user";
  const authUrl = "http://localhost:3000/api/auth/login";

  const postLogin = async (event) => {
    event.preventDefault();
    setValidForm(true);
    setInAction(true);
    setError("");

    const dataPost = {
      email: valueEmail,
      password: valuePassword,
    };

    try {
      const res = await axios.post(authUrl, dataPost);
      setToken(res.data.token);

      const getUserUrl = `${userUrl}?id=${res.data.userId}`;
      await axios.get(getUserUrl);
      setInAction(false);
      App.ReloadApp();
    } catch (err) {
      setValidForm(false);
      setInAction(false);
      setError("Email Address / Password incorrect!");
    }
  };

  const checkForm = (target) => {
    const inputs = [...inputValid];
    const pos = target.name === "email" ? 0 : 1;
    const regEmail = new RegExp(
      /^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+(\.[a-zA-Z]{2,})/g
    );

    if (target.name === "email") {
      inputs[pos] = target.value.match(regEmail) ? true : false;
    } else if (target.name === "password") {
      inputs[pos] = target.value.length >= 4;
    }
    target.className = inputs[pos] ? "valid" : "error";

    setInputValid(inputs);
    setValidForm(!inputs.every((el) => el === true));
  };

  const setToken = (userToken) => {
    sessionStorage.setItem("token", JSON.stringify(userToken));
  };

  // Using if...else for conditional rendering
  if (inAction) {
    return <TinyLoader />;
  } else {
    return (
      <>
        <div className="login">
          <h2>
            <i className="fa-solid fa-user-secret"></i> Log in!
          </h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={postLogin} disabled={validForm}>
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
            <input
              type="submit"
              disabled={validForm}
              label="Login"
              value="Login"
            />
          </form>
        </div>
        <div className="sign">
          <h3>Not a member yet?</h3>
          <button value="Register" onClick={navigateTo}>
            Register
          </button>
        </div>
      </>
    );
  }
};

export default Login;
