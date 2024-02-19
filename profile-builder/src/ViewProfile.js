// ViewProfile.js
import React from "react";

const ViewProfile = ({ userData, handleEdit, handleDelete }) => {
  return (
    <div>
      <h4>User Profiles</h4>
      <div>
        {userData ? (
          userData.map((user) => (
            <div key={user.id}>
                <h2>Name: {user.name}</h2>
              <p>Date of Birth: {user.dob}</p>
              <p>Profession: {user.profession.value}</p>
              <p>Hobbies: {user.hobbies.join(", ")}</p>
              {user.picture && (
                <img src={user.picture} alt="Profile" style={{ maxWidth: 200 }} />
              )}
              <button onClick={() => handleEdit(user)}>Edit</button>
              <button onClick={() => handleDelete(user.id)}>Delete</button>
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default ViewProfile;
