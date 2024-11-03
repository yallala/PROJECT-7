import React, { useState } from "react";
// Import components
import Options from "../Options/Options";
// Import styles
import "./Avatar.css";

const Avatar = ({
  dataUser,
  isClickable = false,
  navigateTo,
  logout,
  OnChange,
  fileAvatar,
  deleteAvatar,
}) => {
  const [isClicked, setIsClicked] = useState(false); // Toggle options menu

  // Toggle options menu on avatar click
  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  // Set avatar display (either user image or default icon)
  const setAvatar = () => {
    return dataUser && dataUser.avatar !== "none" ? (
      <img src={dataUser.avatar} alt="Avatar" />
    ) : (
      <i className="fa-solid fa-user"></i>
    );
  };

  return (
    <>
      {isClickable ? (
        <div className="avatar clickable" onClick={handleClick}>
          {setAvatar()}
          {isClicked && (
            <Options
              for="Avatar"
              userLogged={dataUser}
              navigateTo={navigateTo}
              logout={logout}
            />
          )}
        </div>
      ) : dataUser.isProfile ? (
        <div className="avatar-profile">
          {setAvatar()}
          <div className="avatar-options">
            <label htmlFor="avatar">
              <span className="hidden">avatar</span>
              {fileAvatar ? (
                <i className="fa-solid fa-xmark"></i>
              ) : (
                <i className="fa-solid fa-upload"></i>
              )}
            </label>
            <input
              id="avatar"
              name="avatar"
              type="file"
              accept=".jpg,.jpeg,.png,.gif"
              onChange={OnChange}
            />
            {dataUser.avatar !== "none" && (
              <div className="delete" onClick={deleteAvatar}>
                <i className="fa-solid fa-trash" alt="deleteAvatar"></i>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="avatar">{setAvatar()}</div>
      )}
    </>
  );
};

export default Avatar;
