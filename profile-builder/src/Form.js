import React, { useState } from 'react';
import './Form.css';

const Form = () => {
  const [user, setUser] = useState({
    name: '',
    dob: '',
    profession: '',
    hobbies: [],
    picture: null
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: type === 'file' ? e.target.files[0] : value
    }));
  };

  const userHandler = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    const formData = new FormData();
    formData.append('name', user.name);
    formData.append('dob', user.dob);
    formData.append('profession', user.profession);
    user.hobbies.forEach(hobby => formData.append('hobbies[]', hobby));
    formData.append('picture', user.picture);

    try {
      await fetch('https://us-central1-profile-builder-13108.cloudfunctions.net/uploadProfile', {
        method: 'POST',
        body: formData
      });

      // Clear form fields
      setUser({
        name: '',
        dob: '',
        profession: '',
        hobbies: [],
        picture: null
      });

      // Display success notification
      alert('User profile added successfully!');
    } catch (error) {
      console.error('Error adding user profile:', error);
      // Display error notification
      alert('Error adding user profile. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <form className="profile-form" onSubmit={userHandler}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" maxLength="30" value={user.name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="dob">Date of Birth:</label>
          <input type="date" id="dob" name="dob" value={user.dob} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="profession">Profession:</label>
          <select id="profession" name="profession" value={user.profession} onChange={handleChange}>
          <option value="option1">Software Engineer</option>
            <option value="option2">Wed Developer</option>
            <option value="option3">Doctor</option>
            <option value="option4">Lawyer</option>
            <option value="option5">Chef</option>
            <option value="option6">Architect</option>
            <option value="option7">Accountant</option>
            <option value="option8">Grafic Designer</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="hobbies">Hobbies:</label>
          <select id="hobbies" name="hobbies" multiple value={user.hobbies} onChange={handleChange}>
          <option value="hobby1">Reading</option>
            <option value="hobby2">Cooking</option>
            <option value="hobby3">Painting</option>
            <option value="hobby4">Writing</option>
            <option value="hobby5">Hiking</option>
            <option value="hobby6">Swimming</option>
            <option value="hobby7">Yoga</option>
            <option value="hobby8">Traveling</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="picture">Picture:</label>
          <input type="file" id="picture" name="picture" accept=".png" onChange={handleChange} />
          {user.picture && <img src={URL.createObjectURL(user.picture)} alt="Selected" className="selected-image" />}
        </div>
        <button type="submit" className="add-profile-btn">Add Profile</button>
      </form>
    </div>
  );
};

export default Form;
