import React from "react";
// Import components
import Article from "../Article/Article";
import AddForm from "../Article/AddForm";

const Articles = ({ articles, userLogged }) => {
  return (
    <>
      <>
        {/* Form to add new article */}
        <AddForm userLogged={userLogged} />

        {/* Loop through all articles */}
        {articles && articles.length > 0 ? (
          articles.map((article) => (
            <Article
              key={article.id}
              dataArticle={article}
              userLogged={userLogged}
            />
          ))
        ) : (
          <p className="error">No articles available currently!</p>
        )}
      </>
    </>
  );
};

export default Articles;
