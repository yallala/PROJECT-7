import React, { useState } from "react";
import axios from "axios";
// Import components
import App from "../App";
import Avatar from "../Avatar/Avatar";

const AddForm = ({ userLogged }) => {
  const [valueArticle, setValueArticle] = useState(""); // Manage article input value
  const [fileUpload, setFileUpload] = useState(null); // Manage file input
  const [isValid, setIsValid] = useState(true); // Form validation state
  const articleUrl = "http://localhost:3000/api/articles"; // Request URL

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("userId", userLogged.id);
    formData.append("article", valueArticle);
    formData.append("image", fileUpload);

    try {
      // Send post request to add article
      await axios.post(articleUrl, formData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      App.ReloadApp(); // Optional: Improve by managing state locally instead of reloading the whole app
    } catch (error) {
      console.error("Error adding article!", error);
    }
  };

  // Handle input changes
  const handleChange = (event) => {
    const { name, value, files } = event.target;

    if (name === "article") {
      setValueArticle(value);
      setIsValid(!value.length); // If the article input is empty, form is invalid
    }

    if (name === "image") {
      setFileUpload(files[0]);
      setIsValid(!files.length); // Form becomes valid if an image is uploaded
    }
  };

  return (
    <form className="addArticle" onSubmit={handleSubmit} disabled={isValid}>
      <Avatar
        key={`avatar-${userLogged.id}`}
        dataUser={{ ...userLogged, isProfile: false }}
      />
      <label htmlFor="article">article</label>
      <input
        id="article"
        type="text"
        name="article"
        placeholder={`What's new, ${userLogged.firstname}?`}
        value={valueArticle}
        onChange={handleChange}
      />
      <label htmlFor="image" className="file-upload">
        <span className="hidden">upload</span>
        <i className="fa-solid fa-image"></i>
      </label>
      <input
        id="image"
        name="image"
        onChange={handleChange}
        type="file"
        label="UploadImage"
        accept=".jpg,.jpeg,.png,.gif"
      />
      <button aria-label="sendarticle" disabled={isValid}>
        <i className="fa-solid fa-paper-plane" alt="sendarticle"></i>
      </button>
      <input type="hidden" name="userId" value={userLogged.id} />
    </form>
  );
};

export default AddForm;
