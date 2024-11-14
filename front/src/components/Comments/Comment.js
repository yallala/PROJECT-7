import React, { useState } from "react";
import axios from "axios";
// Import components
import App from "../App";
import Avatar from "../Avatar/Avatar";
import Options from "../Options/Options";

const Comment = ({ userLogged, comment, onDeleteClick }) => {
  const [valueComment, setValueComment] = useState(comment.comment); // comment text
  const [fileUpload, setFileUpload] = useState(null); // image for comment
  const [editComment, setEditComment] = useState(false); // edit mode
  const [isEdited, setIsEdited] = useState(false); // to track if comment is modified
  const [isClicked, setIsClicked] = useState(false); // toggle options menu
  const [isValid, setIsValid] = useState(false); // form validation

  const commentUrl = "http://localhost:3000/api/comments"; // API URL

  // Handle comment edit
  const handleEditClick = async (event) => {
    event.preventDefault();

    if (editComment && isEdited) {
      // Form data containing comment and image
      const formData = new FormData();
      formData.set("comment", valueComment);
      if (fileUpload != null) formData.append("image", fileUpload);

      // Update request
      await axios
        .put(`${commentUrl}/${comment.id}`, formData, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        })
        .then(() => App.ReloadApp());
    } else {
      setEditComment(!editComment); // Toggle edit mode
    }
  };

  // Handle input changes
  const handleChange = (event) => {
    const { name, value, files } = event.target;

    if (name === "comment") {
      setIsValid(value.length === 0); // Form validation
      setIsEdited(comment.comment !== value); // Track if comment is edited
      setValueComment(value); // Update comment text
    }

    if (name === "image") {
      setFileUpload(files[0]); // Update image
    }
  };

  // Toggle options menu
  const handleOptionsClick = () => {
    setIsClicked(!isClicked);
  };

  // Convert post date to readable format
  const convertDate = (myDate) => {
    const start = new Date(myDate).getTime();
    const current = Date.now();
    const timeDifference = new Date(current - start);
    let since = new Date(timeDifference);

    if (since.getFullYear() <= 1970)
      if (since.getMonth() + 1 <= 1)
        if (since.getDate() <= 1)
          if (since.getHours() <= 1)
            if (since.getMinutes() < 1) since = `${since.getSeconds()} sec.`;
            else since = `${since.getMinutes()} min.`;
          else since = `${since.getHours()} h.`;
        else since = `${since.getDate()} d.`;
      else since = `${since.getMonth() + 1} mo.`;
    else since = `${since.getFullYear()} y.`;

    return since;
  };

  return (
    <div key="div-comment" className="comment">
      <Avatar
        key={`avatar-${comment.id}`}
        dataUser={{ ...comment.user, isProfile: false }}
      />
      <div className="comment-content">
        <h3>
          {comment.user.firstname} {comment.user.lastname}
        </h3>
        {editComment ? (
          <form
            onSubmit={handleEditClick}
            className="editComment"
            disabled={isValid}
          >
            <label htmlFor="comment">Comment</label>
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
          </form>
        ) : (
          <p>{comment.comment}</p>
        )}
        <h4>
          {comment.user.job.jobs} | <i className="fa-solid fa-clock"></i>{" "}
          {convertDate(comment.postDate)}
        </h4>
      </div>

      {!editComment &&
        (comment.authorId === userLogged.id || userLogged.isAdmin) && (
          <div className="article-options" onClick={handleOptionsClick}>
            <i className="fa-solid fa-ellipsis"></i>
            {isClicked && (
              <Options
                onEditClick={handleEditClick}
                onDeleteClick={onDeleteClick}
                for="Comment"
                commentId={comment.id}
              />
            )}
          </div>
        )}
    </div>
  );
};

export default Comment;
