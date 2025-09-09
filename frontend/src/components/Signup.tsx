import React from 'react';

const Signup: React.FC = () => {
  return (
    <div>
      <h1>Sign Up</h1>
      <form action="/signup" method="post">
        <label htmlFor="full_name">Full Name:</label>
        <input type="text" id="full_name" name="full_name" required /><br />

        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required /><br />

        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" required /><br />

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
