import React from "react";
import axios from "axios";
// Import components.
import App from "../App";
import Avatar from "../Avatar/Avatar";

const Member = ({ userLogged, member }) => {
  const userUrl = "http://localhost:3000/api/user"; // API URL for user

  // Delete a user
  const handleDeleteUser = async () => {
    if (
      window.confirm(
        `You are about to permanently delete the account of:\n${member.id} - ${member.firstname} ${member.lastname}\nAre you sure?`
      )
    ) {
      try {
        // Send DELETE request to delete the user
        await axios.delete(`${userUrl}/${member.id}/0`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        App.ReloadApp(); // Optional: Improve by managing state locally
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  // Toggle admin rights
  const handleSetAdmin = async () => {
    const newAdminStatus = member.isAdmin ? 0 : 1;
    const message = member.isAdmin
      ? `You are about to remove admin rights from:\n${member.firstname} ${member.lastname}\nAre you sure?`
      : `You are about to grant admin rights to:\n${member.firstname} ${member.lastname}\nAre you sure?`;

    if (window.confirm(message)) {
      try {
        const updatedMember = { ...member, isAdmin: newAdminStatus };
        // Send PUT request to update the user's admin status
        await axios.put(`${userUrl}/${member.id}/0`, updatedMember, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        App.ReloadApp(); // Optional: Improve by managing state locally
      } catch (error) {
        console.error("Error updating admin status:", error);
      }
    }
  };

  return (
    <>
      {userLogged && member ? (
        <div className="member" key={`Member-${member.id}`}>
          <Avatar key={member.id} dataUser={{ ...member, isProfile: false }} />
          <p>
            {member.firstname} {member.lastname}
          </p>
          <div>
            {!member.isDelete ? (
              <>
                {member.id === 1 ? (
                  <button
                    className="edit actived"
                    disabled={member.isAdmin}
                    aria-label="editAdmin"
                  >
                    <i className="fa-solid fa-shield"></i>
                  </button>
                ) : (
                  <>
                    <button
                      className={`edit ${member.isAdmin ? "actived" : ""}`}
                      aria-label="editAdmin"
                      onClick={handleSetAdmin}
                    >
                      <i className="fa-solid fa-shield"></i>
                    </button>
                    <button
                      className="delete"
                      aria-label="delUser"
                      onClick={handleDeleteUser}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </>
                )}
              </>
            ) : (
              <button
                className="delete"
                aria-label="delUser"
                onClick={handleDeleteUser}
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            )}
          </div>
        </div>
      ) : (
        "Error loading member!"
      )}
    </>
  );
};

export default Member;
