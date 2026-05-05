import { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
  try {
    console.log("Sending:", email, password); // 👈 check values

    const res = await axios.post("http://127.0.0.1:5000/api/auth/login", {
      email,
      password,
    });

    console.log("Response:", res.data); // 👈 check success

    localStorage.setItem("token", res.data.token);

    alert("Login successful 🚀");
    window.location.href = "/dashboard";

  } catch (error) {
    console.log("ERROR:", error);
    console.log("BACKEND:", error.response?.data); // 👈 VERY IMPORTANT
      alert(JSON.stringify(error.response?.data));
    alert("Login failed ❌");
  }
};
  return (
    <div>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Enter email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Enter password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;