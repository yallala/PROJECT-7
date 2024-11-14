
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
// Import components
import App from "../App";
import Avatar from "../Avatar/Avatar";
// import Options from "../Options/Options";
import TinyLoader from "../TinyLoader/TinyLoader";
// Import style
import "./Article.css";

const Article = ({ dataArticle, userLogged }) => {
  const [article, setArticle] = useState(dataArticle);
  const [author] = useState(dataArticle.user);
  // const [valueArticle, setValueArticle] = useState(dataArticle.article);
  const [likes, setLikes] = useState(dataArticle.likes);
  // const [fileUpload, setFileUpload] = useState(null);

  const totalLike = likes.length;

  const articleUrl = `http://localhost:3000/api/articles/`;
  const likeUrl = "http://localhost:3000/api/likes";


  // Handle like/unlike
  const handleLikesClick = async (event) => {
    const postLike = {
      userId: userLogged.id,
      articleId: article.id,
    };
    await axios
      .post(likeUrl, postLike, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (!res.data?.length) event.target.classList.add("active");
        else event.target.classList.remove("active");
        fetchUpdatedArticle();
      });
  };

  // Fetch updated article data (for likes)
  const fetchUpdatedArticle = () => {
    axios
      .get(articleUrl, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        const updatedArticle = res.data.articles.find(
          (result) => result.id === article.id
        );
        setArticle(updatedArticle);
        setLikes(updatedArticle.likes);
      });
  };


  return (
    <>
      <>
        {article ? (
          <article key={article.id + "-article"}>
            <div className="article-author">
              <Avatar dataUser={{ ...author, isProfile: false }} />
              <div className="author-infos">
                <h3>
                  {author.firstname} {author.lastname}
                </h3>
              </div>

            </div>

            {/* Only Image */}
            {/* <p>{article.article}</p>
            {article.image !== "none" && (
              <img src={article.image} alt="postedImage" />
            )} */}

            {/* Image and Video */}
            {/* <p>{article.article}</p>
            {article.image && (
              article.image.endsWith(".jpg") ||
                article.image.endsWith(".jpeg") ||
                article.image.endsWith(".png") ||
                article.image.endsWith(".gif") ? (
                <img src={article.image} alt="postedImage" />
              ) : (
                <video controls>
                  <source src={article.image} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )
            )} */}

            {/* Image, Video & Audio */}
            <p>{article.article}</p>
            {article.image && (
              article.image.endsWith(".jpg") ||
                article.image.endsWith(".jpeg") ||
                article.image.endsWith(".png") ||
                article.image.endsWith(".gif") ? (
                <img src={article.image} alt="postedImage" />
              ) : article.image.endsWith(".mp4.undefined") ||
                article.image.endsWith(".mp4") ||
                article.image.endsWith(".mov") ||
                article.image.endsWith(".avi") ||
                article.image.endsWith(".webm") ||
                article.image.endsWith(".mov.undefined") ||
                article.image.endsWith(".avi.undefined") ||
                article.image.endsWith(".webm.undefined") ? (
                <video controls>
                  <source src={article.image} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : article.image.endsWith(".mp3") ||
              article.image.endsWith(".mp3.undefined") ||
              article.image.endsWith(".wav") ||
              article.image.endsWith(".wav.undefined") ||
              article.image.endsWith(".ogg.undefined") ||
              article.image.endsWith(".ogg.undefined") ?
               (
                <audio controls>
                  <source src={article.image} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              ) : (
                ""
              )
            )}




            <div className="infos-total">
              {likes && totalLike >= 1 && (
                <p className="like">
                  <i className="fa-solid fa-heart"></i> {totalLike} user tracked
                </p>
              )}
            </div>

            <ul className="options">
              <li
                className={`like ${likes.some((like) => like.userId === userLogged.id)
                  ? "active"
                  : ""
                  }`}
                onClick={handleLikesClick}
              >
                <i className="fa-solid fa-heart"></i> Click to track user
              </li>
            </ul>

          </article>
        ) : (
          <TinyLoader />
        )}
      </>
    </>
  );
};

export default Article;



