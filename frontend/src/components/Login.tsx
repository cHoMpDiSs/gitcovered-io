import React from 'react';

const Login: React.FC = () => {
  return (
    <div>
      <h1>Login</h1>
      <form action="/login" method="post">
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required /><br />

        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" required /><br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
