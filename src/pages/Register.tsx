import React from 'react';

const Register: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Register</h1>
      <form className="w-full max-w-sm">
        <input className="w-full p-2 mb-4 border rounded" type="text" placeholder="Username" />
        <input className="w-full p-2 mb-4 border rounded" type="email" placeholder="Email" />
        <input className="w-full p-2 mb-4 border rounded" type="password" placeholder="Password" />
        <button className="w-full bg-green-500 text-white p-2 rounded">Register</button>
      </form>
    </div>
  );
};

export default Register;
