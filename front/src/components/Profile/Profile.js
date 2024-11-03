import React, { useState } from "react";
import axios from "axios";
// Import components
import App from "../App";
import Avatar from "../Avatar/Avatar";
import TinyLoader from "../TinyLoader/TinyLoader";

const Profile = ({ userLogged, jobsList }) => {
  const [inputValid, setInputValid] = useState([true, true, true, true, true]);
  const [validForm, setValidForm] = useState(true);
  const [valueFirstname, setValueFirstname] = useState(userLogged.firstname);
  const [valueLastname, setValueLastname] = useState(userLogged.lastname);
  const [valueEmail, setValueEmail] = useState(userLogged.email);
  const [valuePassword, setValuePassword] = useState(null);
  const [fileAvatar, setFileAvatar] = useState(null);
  const [curJobId, setCurJobId] = useState(userLogged.job.id);
  const [curJob, setCurJob] = useState(userLogged.job.jobs);
  const [curPosJob, setCurPosJob] = useState(null);

  const userUrl = "http://localhost:3000/api/user";

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("userId", userLogged.id);
    formData.append("firstname", valueFirstname);
    formData.append("lastname", valueLastname);
    formData.append("jobId", curJobId);
    formData.append("email", valueEmail);
    if (valuePassword) formData.append("password", valuePassword);
    if (fileAvatar) formData.append("avatar", fileAvatar);

    try {
      await axios.put(`${userUrl}/${userLogged.id}/0`, formData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      App.ReloadApp();
    } catch (error) {
      console.error("Error Edit Avatar!", error);
    }
  };

  // Handle input changes
  const handleChange = (event) => {
    const { name, value, files } = event.target;
    switch (name) {
      case "firstname":
        checkForm(event.target);
        setValueFirstname(value);
        break;
      case "lastname":
        checkForm(event.target);
        setValueLastname(value);
        break;
      case "email":
        checkForm(event.target);
        setValueEmail(value);
        break;
      case "password":
        checkForm(event.target);
        setValuePassword(value);
        break;
      case "avatar":
        checkForm(event.target);
        setFileAvatar(files[0]);
        break;
      default:
        console.error("Nothing here!");
        break;
    }
  };

  // Form validation logic
  const checkForm = (target) => {
    const inputs = [...inputValid];
    let pos = 0;

    switch (target.name) {
      case "firstname":
      case "lastname":
        if (target.name === "lastname") pos = 1;
        inputs[pos] = target.value.length >= 2;
        break;
      case "email":
        pos = 2;
        inputs[pos] = /^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+(\.[a-zA-Z]{2,})/g.test(
          target.value
        );
        break;
      case "password":
        pos = 3;
        inputs[pos] = target.value.length >= 4;
        if (target.value.length === 0) inputs[pos] = true;
        break;
      case "avatar":
        pos = 4;
        inputs[pos] = target.value !== "";
        break;
      default:
        console.error("Unknown field name!");
        break;
    }

    target.className = inputs[pos] ? "valid" : "error";
    setInputValid(inputs);
    setValidForm(!inputs.every((el) => el === true));
  };

  // Handle job change
  const handleJobClick = (event) => {
    let posJob = curPosJob + 1 || 1;
    if (posJob >= jobsList.length) posJob = 0;

    jobsList.forEach((job, index) => {
      if (posJob === index) {
        event.target.className = job.id === userLogged.job.id ? "" : "valid";
        setCurPosJob(posJob);
        setCurJobId(job.id);
        setCurJob(job.jobs);
        setValidForm(job.id === userLogged.job.id);
      }
    });
  };

  // Handle avatar deletion
  const deleteAvatar = async () => {
    if (window.confirm("Are you sure you want to delete your avatar?")) {
      try {
        await axios.delete(`${userUrl}/${userLogged.id}/1`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        App.ReloadApp();
      } catch (error) {
        console.error("Error deleting avatar!", error);
      }
    }
  };

  // Handle account deletion
  const deleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      try {
        await axios.put(`${userUrl}/${userLogged.id}/1`, new FormData(), {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        sessionStorage.clear();
        App.ReloadApp();
      } catch (error) {
        console.error("Error deleting account!", error);
      }
    }
  };

  return (
    <div className="profile">
      <form onSubmit={handleSubmit} disabled={validForm}>
        {userLogged ? (
          <Avatar
            dataUser={{ ...userLogged, isProfile: true }}
            fileAvatar={fileAvatar}
            OnChange={handleChange}
            deleteAvatar={deleteAvatar}
          />
        ) : (
          <TinyLoader />
        )}
        <div className="names-content">
          <label htmlFor="Prenom">First Name</label>
          <input
            id="Prenom"
            name="firstname"
            type="text"
            placeholder="First Name"
            value={valueFirstname}
            onChange={handleChange}
            required
          />
          <label htmlFor="Nom">Last Name</label>
          <input
            id="Nom"
            name="lastname"
            type="text"
            placeholder="Last Name"
            value={valueLastname}
            onChange={handleChange}
            required
          />
        </div>
        <label htmlFor="Jobs">Job</label>
        <input
          id="Jobs"
          name="jobs"
          type="text"
          readOnly
          label="Job"
          value={curJob}
          onClick={handleJobClick}
        />
        <label htmlFor="Email">Email</label>
        <input
          id="Email"
          name="email"
          type="email"
          placeholder="Ex: example@groupomania.com"
          label="Email Address"
          value={valueEmail}
          onChange={handleChange}
          required
        />
        <h2>Optional</h2>
        <label htmlFor="NewPassword">Password</label>
        <input
          id="NewPassword"
          name="password"
          type="password"
          placeholder="New password"
          label="Password"
          onChange={handleChange}
        />
        <input type="submit" disabled={validForm} value="Update" />
      </form>
      <h3>Delete Account!</h3>
      <input type="button" onClick={deleteAccount} value="Delete Account!" />
    </div>
  );
};

export default Profile;
