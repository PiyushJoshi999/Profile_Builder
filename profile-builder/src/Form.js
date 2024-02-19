import React, { useState, useEffect } from "react";
import "./Form.css";
import Select from "react-select";
import { imgDB } from "./firebase";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import ViewProfile from "./ViewProfile";
import jsPDF from "jspdf";

const hob = [
  {
    value: "painting",
    label: "painting",
  },
  {
    value: "writing",
    label: "writing",
  },
  {
    value: "traveling",
    label: "traveling",
  },
  {
    value: "reading",
    label: "reading",
  },
  {
    value: "hiking",
    label: "hiking",
  },
  {
    value: "singing",
    label: "singing",
  },
  {
    value: "yoga",
    label: "yoga",
  },
  {
    value: "dancing",
    label: "dancing",
  },
  {
    value: "other",
    label: "other",
  },
];

const prof = [
  {
    value: "student",
    label: "student",
  },
  {
    value: "software engineer",
    label: "software engineer",
  },
  {
    value: "web developer",
    label: "web developer",
  },
  {
    value: "doctor",
    label: "doctor",
  },
  {
    value: "lawyer",
    label: "lawyer",
  },
  {
    value: "chef",
    label: "chef",
  },
  {
    value: "teacher",
    label: "teacher",
  },
  {
    value: "artist",
    label: "artist",
  },
  {
    value: "other",
    label: "other",
  },
];

const Form = () => {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [profession, setProfession] = useState("");
  const [hobby, setHobby] = useState([]);
  const [picture, setPicture] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showProfiles, setShowProfiles] = useState(false);
  const [userData, setUserData] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null); // Add this line

  useEffect(() => {
    if (showProfiles) {
      fetch("https://user-data-a6fea-default-rtdb.firebaseio.com/users.json")
        .then((response) => response.json())
        .then((data) => {
          // Convert fetched data object into an array of users
          const usersArray = data
            ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
            : [];
          setUserData(usersArray);
        })
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, [showProfiles]);

  const handlePic = (e) => {
    console.log(e.target.files[0]);
    const imgs = ref(imgDB, `Imgs/${v4()}`);
    uploadBytes(imgs, e.target.files[0]).then((data) => {
      console.log(data, "imgs");
      getDownloadURL(data.ref).then((val) => {
        setPicture(val);
      });
    });
  };

  const resetForm = () => {
    setName("");
    setDob("");
    setProfession("");
    setHobby([]);
    setPicture("");
  };

  const validateForm = () => {
    return name !== "" && dob !== "" && profession !== "" && picture !== "";
  };

  const userHandler = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      alert("Please fill all the fields and select an image");
      return;
    }
    const hobbies = hobby.map((h) => h.value);
    const userData = {
      name: name,
      dob: dob,
      profession: profession,
      hobbies: hobbies,
      picture: picture,
    };
    fetch("https://user-data-a6fea-default-rtdb.firebaseio.com/users.json", {
      method: "POST",
      body: JSON.stringify(userData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          console.log(res);
          setSubmitted(true);
          alert("Data submitted successfully");
          resetForm();
        } else {
          throw new Error("Failed to send data to Firebase Realtime Database");
        }
      })
      .catch((err) => {
        console.error("Error sending data to Firebase Realtime Database:", err);
        alert("Failed to send data to Firebase Realtime Database");
      });
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setName(user.name);
    setDob(user.dob);
    setProfession(user.profession);
    setHobby(user.hobbies.map((h) => ({ value: h, label: h })));
    setPicture(user.picture);
  };

  const handleDelete = (userId) => {
    fetch(
      `https://user-data-a6fea-default-rtdb.firebaseio.com/users/${userId}.json`,
      {
        method: "DELETE",
      }
    )
      .then((res) => {
        if (res.ok) {
          setUserData(userData.filter((user) => user.id !== userId));
          alert("User deleted successfully");
        } else {
          throw new Error("Failed to delete user");
        }
      })
      .catch((err) => {
        console.error("Error deleting user:", err);
        alert("Failed to delete user");
      });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    let yPos = 10;

    userData.forEach((user) => {
      doc.text(`Name: ${user.name}`, 10, yPos);
      doc.text(`Date of Birth: ${user.dob}`, 10, yPos + 10);
      doc.text(`Profession: ${user.profession}`, 10, yPos + 20);
      doc.text(`Hobbies: ${user.hobbies.join(", ")}`, 10, yPos + 30);
      yPos += 50;
    });

    doc.save("userData.pdf");
  };

  return (
    <div className="form-container">
      <form className="profile-form" onSubmit={userHandler}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            maxLength="30"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="dob">Date of Birth:</label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="profession">Profession:</label>
          <Select
            id="profession"
            name="profession"
            options={prof}
            value={profession}
            onChange={(p) => setProfession(p)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="hobbies">Hobbies:</label>
          <Select
            id="hobbies"
            name="hobbies"
            options={hob}
            value={hobby}
            onChange={(h) => setHobby(h)}
            isMulti={true}
          />
        </div>
        <div className="form-group">
          <label htmlFor="picture">Picture:</label>
          <input
            type="file"
            id="picture"
            name="picture"
            accept=".png"
            onChange={handlePic}
          />
        </div>
        {picture && (
          <img src={picture} alt="Selected" className="selected-image" />
        )}
        <button type="submit" className="add-profile-btn">
          Add Profile
        </button>
      </form>

      <button
        type="button"
        className="show-profile-btn"
        onClick={() => setShowProfiles(!showProfiles)}
      >
        Show Profiles
      </button>
      {showProfiles && (
        <ViewProfile
          userData={userData}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      )}
      <div>
        <button
          type="button"
          className="print-profile-btn"
          onClick={generatePDF}
        >
          Print Data
        </button>
      </div>
    </div>
  );
};

export default Form;
