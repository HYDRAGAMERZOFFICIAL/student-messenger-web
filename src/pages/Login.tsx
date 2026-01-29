import React from 'react';

const Login: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <form className="w-full max-w-sm">
        <input className="w-full p-2 mb-4 border rounded" type="text" placeholder="Username" />
        <input className="w-full p-2 mb-4 border rounded" type="password" placeholder="Password" />
        <button className="w-full bg-blue-500 text-white p-2 rounded">Login</button>
      </form>
    </div>
  );
};

export default Login;
