import React, { useState } from "react";
import axios from "axios";
// Import components
import App from "../App";
import Avatar from "../Avatar/Avatar";
import Options from "../Options/Options";
import TinyLoader from "../TinyLoader/TinyLoader";
// Import style
import "./Article.css";

const Article = ({ dataArticle, userLogged }) => {
  const [article, setArticle] = useState(dataArticle);
  const [author] = useState(dataArticle.user);
  const [valueArticle, setValueArticle] = useState(dataArticle.article);
  const [fileUpload, setFileUpload] = useState(null);
  const [editArticle, setEditArticle] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [isClicked, setIsClicked] = useState(false);


  const articleUrl = `http://localhost:3000/api/articles/`;



  // Handle editing of the article
  const handleEditClick = async (event) => {
    event.preventDefault();
    if (editArticle && isEdited) {
      const formData = new FormData();
      formData.set("message", valueArticle);
      if (fileUpload) formData.append("image", fileUpload);

      await axios
        .put(`${articleUrl}${article.id}`, formData, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        })
        .then(() => {
          setEditArticle(false);
          App.ReloadApp();
        });
    } else {
      setEditArticle(true);
    }
  };

  // Handle changes in the form (text or image input)
  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "message") {
      setIsEdited(article.article !== value);
      setValueArticle(value);
    }
    if (name === "picture") {
      setIsEdited(true);
      setFileUpload(files[0]);
    }
  };

  // Handle deletion of an image
  const handleDeleteImage = async () => {
    if (
      window.confirm("You are about to delete your image...\nAre you sure?")
    ) {
      await axios
        .delete(`${articleUrl}${article.id}/1`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        })
        .then(() => App.ReloadApp());
    }
  };

  // Handle deletion of an article
  const handleDeleteClick = async () => {
    if (
      window.confirm("You are about to delete this article...\nAre you sure?")
    ) {
      await axios
        .delete(`${articleUrl}${article.id}/0`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        })
        .then(() => App.ReloadApp());
    }
  };

  // Convert post date to a readable format
  const convertDate = () => {
    const start = new Date(article.postDate).getTime();
    const current = Date.now();
    const result = new Date(current - start);
    let since = new Date(result);
    if (since.getFullYear() <= 1970)
      if (since.getMonth() + 1 <= 1)
        if (since.getDate() <= 1)
          if (since.getHours() <= 1)
            if (since.getMinutes() < 1)
              since = new Date(result).getSeconds() + "sec.";
            else since = since.getMinutes() + "min.";
          else since = since.getHours() + "h.";
        else since = since.getDate() + "d.";
      else since = since.getMonth() + 1 + "mo.";
    else since = since.getFullYear() + "y.";

    return since;
  };

  return (
    <>
      {!editArticle ? (
        <>
          {article ? (
            <article key={article.id + "-article"}>
              <div className="article-author">
                <Avatar dataUser={{ ...author, isProfile: false }} />
                <div className="author-infos">
                  <h3>
                    {author.firstname} {author.lastname}
                  </h3>
                  <h4>
                    {author.job.jobs} | <i className="fa-solid fa-clock"></i>{" "}
                    {convertDate()}
                  </h4>
                </div>

                {(article.authorId === userLogged.id || userLogged.isAdmin) && (
                  <div
                    className="article-options"
                    onClick={() => setIsClicked(!isClicked)}
                  >
                    <i className="fa-solid fa-ellipsis"></i>
                    {isClicked && (
                      <Options
                        onEditClick={handleEditClick}
                        onDeleteClick={handleDeleteClick}
                        dataArticle={article}
                        for={"Article"}
                      />
                    )}
                  </div>
                )}
              </div>

              <p>{article.article}</p>
              {article.image !== "none" && (
                <img src={article.image} alt="postedImage" />
              )}

            </article>
          ) : (
            <TinyLoader />
          )}
        </>
      ) : (
        <article key={"edit-article-" + article.id}>
          <div className="article-author">
            <Avatar dataUser={{ ...author, isProfile: false }} />
            <div className="author-infos">
              <h3>
                {author.firstname} {author.lastname}
              </h3>
              <h4>
                {author.job.jobs} | <i className="fa-solid fa-clock"></i>{" "}
                {convertDate()}
              </h4>
            </div>
            <div className="article-no-options">
              <button onClick={handleEditClick}>
                <span className="hidden">Confirm edit article</span>
                <i className="fa-solid fa-check"></i>
              </button>
            </div>
          </div>

          <form onSubmit={handleEditClick}>
            <label htmlFor="message">message</label>
            <input
              id="message"
              type="text"
              name="message"
              placeholder="A small note?"
              defaultValue={valueArticle}
              onChange={handleChange}
            />

            <div className="article-edit-avatar">
              <label
                htmlFor="picture"
                className="file-upload"
                onChange={handleChange}
              >
                <span className="hidden">picture</span>
                {fileUpload ? (
                  <i className="fa-solid fa-xmark"></i>
                ) : (
                  <i className="fa-solid fa-image"></i>
                )}
              </label>
              <input
                id="picture"
                name="picture"
                type="file"
                label="UploadImage"
                accept=".jpg,.jpeg,.png,.gif"
                onChange={handleChange}
              />
              {article.image !== "none" && (
                <>
                  <button label="delAvatar" onClick={handleDeleteImage}>
                    <span className="hidden">delete Avatar</span>
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <img src={article.image} alt="postedImage" />
                </>
              )}
            </div>
          </form>
        </article>
      )}
    </>
  );
};

export default Article;
