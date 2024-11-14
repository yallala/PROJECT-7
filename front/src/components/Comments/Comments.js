import React, { useState } from "react";
import axios from "axios";
// Import components
import App from "../App";
import Comment from "./Comment";
import Avatar from "../Avatar/Avatar";
import TinyLoader from "../TinyLoader/TinyLoader";
// Import style
import "./Comments.css";

const Comments = ({ userLogged, articleId, comments: initialComments }) => {
  const [valueComment, setValueComment] = useState(""); // Comment input value
  const [fileUpload, setFileUpload] = useState(null); // Image for comment
  const [isValid, setIsValid] = useState(true); // Form validation

  const commentUrl = "http://localhost:3000/api/comments"; // API URL for comments

  // Handle comment submission
  const handleSubmitComment = async (event) => {
    event.preventDefault();

    // Form data containing comment and image
    const formData = new FormData();
    formData.append("userId", userLogged.id);
    formData.append("comment", valueComment);
    formData.append("image", fileUpload);
    formData.append("articleId", articleId);

    try {
      // Post request
      await axios.post(commentUrl, formData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      App.ReloadApp(); // Reload the app after successful submission
    } catch (error) {
      console.error("Error adding comment!", error);
    }
  };

  // Handle input changes for comment and image
  const handleChange = (event) => {
    const { name, value, files } = event.target;

    if (name === "comment") {
      setValueComment(value);
      setIsValid(value.length === 0); // Validate form (disable if empty)
    }

    if (name === "image") {
      setFileUpload(files[0]); // Set uploaded image
    }
  };

  // Handle comment deletion
  const handleDeleteClick = async (commentId) => {
    if (window.confirm("Are you sure?")) {
      try {
        // Delete request
        await axios.delete(`${commentUrl}/${commentId}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        App.ReloadApp(); // Reload the app after successful deletion
      } catch (error) {
        console.error("Error deleting comment!", error);
      }
    }
  };

  return (
    <>
      {/* Render list of comments */}
      {initialComments ? (
        initialComments.map((comment) => (
          <Comment
            key={`comment-${comment.id}`}
            userLogged={userLogged}
            comment={comment}
            onDeleteClick={() => handleDeleteClick(comment.id)}
          />
        ))
      ) : (
        <TinyLoader />
      )}

      {/* Add new comment form */}
      <form
        className="addComment"
        onSubmit={handleSubmitComment}
        disabled={isValid}
      >
        <Avatar
          key={`avatar-${userLogged.id}`}
          dataUser={{ ...userLogged, isProfile: false }}
        />
        <label htmlFor="comment">comment</label>
        <input
          id="comment"
          type="text"
          name="comment"
          placeholder="Write a comment..."
          value={valueComment}
          onChange={handleChange}
        />
        <button aria-label="sendComment" disabled={isValid}>
          <i className="fa-solid fa-paper-plane" alt="sendComment"></i>
        </button>
        <input type="hidden" name="userId" value={userLogged.id} />
      </form>
    </>
  );
};

export default Comments;
