import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

const SignUpPage = () => {

  // States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Functions
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await register({ username, password });
      navigate('/user/login');
    } catch (err) {
      setError("Failed to register. Control username and password");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>

      <h1 className="signup">Create Account</h1>

      <div className="auth-form">

        <form onSubmit={handleSubmit}>

          <input
            aria-label="username"
            type="username"
            id="username"
            name="username"
            required value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            disabled={isLoading} />

          <input
            aria-label="password"
            type="password"
            id="password"
            name="password"
            required value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            disabled={isLoading} />

          <button
            style={{ marginTop: "1em" }}
            className="btn signin-btn"
            type="submit"
            disabled={isLoading}>
            {isLoading ? 'Signing up...' : 'Sign up'}
          </button>

          {error && <p style={{ color: "red", fontSize: "0.9em", margin: "1em 0 2em 0"}}>{error}</p>}

        </form>

        <p>Already a user?  <NavLink to="/user/login">Log in here</NavLink></p>
      </div>

    </div>
  )
}

export default SignUpPage