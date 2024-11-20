// import React, { useState } from "react";
// import axios from "axios";
// import Avatar from "../Avatar/Avatar";
// import TinyLoader from "../TinyLoader/TinyLoader";
// import "./Article.css";

// const Article = ({ dataArticle, userLogged }) => {
//   const [article, setArticle] = useState(dataArticle);
//   const [author] = useState(dataArticle.user);
//   const [likes, setLikes] = useState(dataArticle.likes);
//   const [showFullContent, setShowFullContent] = useState(false); // New state to toggle content visibility

//   const totalLike = likes.length;
//   const articleUrl = `http://localhost:3000/api/articles/`;
//   const likeUrl = "http://localhost:3000/api/likes";

//   const handleLikesClick = async (event) => {
//     const postLike = {
//       userId: userLogged.id,
//       articleId: article.id,
//     };
//     await axios
//       .post(likeUrl, postLike, {
//         headers: {
//           Authorization: `Bearer ${sessionStorage.getItem("token")}`,
//         },
//       })
//       .then((res) => {
//         if (!res.data?.length) event.target.classList.add("active");
//         else event.target.classList.remove("active");
//         fetchUpdatedArticle();
//       });
//   };

//   const fetchUpdatedArticle = () => {
//     axios
//       .get(articleUrl, {
//         headers: {
//           Authorization: `Bearer ${sessionStorage.getItem("token")}`,
//         },
//       })
//       .then((res) => {
//         const updatedArticle = res.data.articles.find(
//           (result) => result.id === article.id
//         );
//         setArticle(updatedArticle);
//         setLikes(updatedArticle.likes);
//       });
//   };

//   const toggleContent = () => {
//     setShowFullContent(!showFullContent);
//   };

//   return (
//     <>
//       {article ? (
//         <article
//           key={article.id + "-article"}

//         >
//           <div className="article-author">
//             <Avatar dataUser={{ ...author, isProfile: false }} />
//             <div className="author-infos">
//               <h3>
//                 {author.firstname} {author.lastname}
//               </h3>
//             </div>
//           </div>

//           <div className={`like ${likes.some((like) => like.userId === userLogged.id) ? "active" : ""}`}
//             onClick={handleLikesClick}>

//             <p>
//               {showFullContent ? article.article : `${article.article.substring(0, 10)}...`}
//             </p>
//             <span onClick={toggleContent} className="read-more">
//               {showFullContent ? "Show Less" : "Read More"}
//             </span>

//             {/* Image, Video, Audio Display Post */}
//             {showFullContent && article.image && (
//               article.image.endsWith(".jpg") ||
//                 article.image.endsWith(".jpeg") ||
//                 article.image.endsWith(".png") ||
//                 article.image.endsWith(".gif") ? (
//                 <img src={article.image} alt="postedImage" />
//               ) : article.image.endsWith(".mp4.undefined") ||
//                 article.image.endsWith(".mp4") ||
//                 article.image.endsWith(".mov") ||
//                 article.image.endsWith(".avi") ||
//                 article.image.endsWith(".webm") ||
//                 article.image.endsWith(".mov.undefined") ||
//                 article.image.endsWith(".avi.undefined") ||
//                 article.image.endsWith(".webm.undefined") ? (
//                 <video controls>
//                   <source src={article.image} type="video/mp4" />
//                   Your browser does not support the video tag.
//                 </video>
//               ) : article.image.endsWith(".mp3") ||
//                 article.image.endsWith(".mp3.undefined") ||
//                 article.image.endsWith(".wav") ||
//                 article.image.endsWith(".wav.undefined") ||
//                 article.image.endsWith(".ogg.undefined") ||
//                 article.image.endsWith(".ogg.undefined") ?
//                 (
//                   <audio controls>
//                     <source src={article.image} type="audio/mpeg" />
//                     Your browser does not support the audio element.
//                   </audio>
//                 ) : (
//                   ""
//                 )
//             )}


//             <div className="infos-total">
//               {likes && totalLike >= 1 && (
//                 <p className="like">
//                   <i className="fa-solid fa-heart"></i> {totalLike} Read
//                 </p>
//               )}
//             </div>
//           </div>
//         </article>
//       ) : (
//         <TinyLoader />
//       )}
//     </>
//   );
// };

// export default Article;



import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Avatar from "../Avatar/Avatar";
import TinyLoader from "../TinyLoader/TinyLoader";
import "./Article.css";

const Article = ({ dataArticle, userLogged }) => {
  const [article, setArticle] = useState(dataArticle);
  const [author] = useState(dataArticle.user);
  const [likes, setLikes] = useState(dataArticle.likes);
  const [showFullContent, setShowFullContent] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const totalLike = likes.length;
  const articleUrl = `http://localhost:3000/api/articles/`;
  const likeUrl = `http://localhost:3000/api/likes`;

  // Unique cookie keys for the logged-in user and article
  const cookieKeyReadMore = `article-${article.id}-user-${userLogged.id}-readMore`;
  const cookieKeyLiked = `article-${article.id}-user-${userLogged.id}-liked`;

  useEffect(() => {
    // Retrieve states from cookies
    const readMoreState = Cookies.get(cookieKeyReadMore);
    const likeState = Cookies.get(cookieKeyLiked);

    setShowFullContent(readMoreState === "true");
    setIsLiked(likeState === "true");
  }, [cookieKeyReadMore, cookieKeyLiked]);

  const handleLikesClick = async (event) => {
    const postLike = {
      userId: userLogged.id,
      articleId: article.id,
    };

    try {
      const res = await axios.post(likeUrl, postLike, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      if (!res.data?.length) {
        setIsLiked(true);
        Cookies.set(cookieKeyLiked, "true"); // Store like state in cookies
        event.target.classList.add("active");
      } else {
        setIsLiked(false);
        Cookies.set(cookieKeyLiked, "false");
        event.target.classList.remove("active");
      }
      fetchUpdatedArticle();
    } catch (error) {
      console.error("Error liking the article:", error);
    }
  };

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
      })
      .catch((err) => console.error("Error fetching article:", err));
  };

  const toggleContent = () => {
    const newShowFullContent = !showFullContent;
    console.log("New Show Full Content State:", newShowFullContent); // Debug log
    setShowFullContent(newShowFullContent);
  
    // Persist read-more state in cookies
    Cookies.set(cookieKeyReadMore, newShowFullContent.toString());
  };

  useEffect(() => {
    console.log("Article image:", article.image);
    console.log("Show Full Content:", showFullContent);
  }, [article, showFullContent]);
  

  return (
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

          <div
            className={`like ${isLiked ? "active" : ""}`}
            onClick={handleLikesClick}
          >
            <p>
              {showFullContent ? article.article : `${article.article.substring(0, 10)}...`}
            </p>
            <span onClick={toggleContent} className="read-more">
              {showFullContent ? "" : "Read More"}
            </span>
{showFullContent && article.image && (
  <>
    {article.image.endsWith(".jpg") ||
              article.image.endsWith(".jpg.undefined") ||
              article.image.endsWith(".jpeg") ||
              article.image.endsWith(".jpeg.undefined") ||
              article.image.endsWith(".png") ||
              article.image.endsWith(".png.undefined") ||
              article.image.endsWith(".gif") ||
              article.image.endsWith(".gif.undefined") ? (
                <img src={article.image} alt="postedImage" />
              ) : article.image.endsWith(".mp4") ||
              article.image.endsWith(".mp4.undefined") ||
              article.image.endsWith(".mov") ||
              article.image.endsWith(".mov.undefined") ||
              article.image.endsWith(".avi") ||
              article.image.endsWith(".avi.undefined") ||
              article.image.endsWith(".webm.undefined") ||
              article.image.endsWith(".webm") ? (
              <video controls>
                <source src={article.image} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : article.image.endsWith(".mp3") ||
            article.image.endsWith(".mp3.undefined") ||
            article.image.endsWith(".wav") ||
            article.image.endsWith(".wav.undefined") ||
            article.image.endsWith(".ogg") ||
            article.image.endsWith(".ogg.undefined") ? (
            <audio controls>
              <source src={article.image} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
    ) : (
      <p>{article.article}</p>
    )}
  </>
)}



            <div className="infos-total">
              {likes && totalLike >= 1 && (
                <p className="like">
                  <i className="fa-solid fa-heart"></i> {totalLike} Read
                </p>
              )}
            </div>
          </div>
        </article>
      ) : (
        <TinyLoader />
      )}
    </>
  );
};

export default Article;
