import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, NavLink } from "react-router-dom";

const LoginPage = () => {

  // States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(`/user/${user._id}`);
    }
  }, [user]);


  // Functions
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);


    try {
      await login({ username, password });

      navigate(`/user/${user?._id}`);


    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to login. Control username and password");
      }
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <div>
      <h1 className="login">Welcome Back</h1>

      <div className="auth-form">

        <form onSubmit={handleSubmit}>

          <input
            aria-label="username"
            type="text"
            id="username"
            name="username"
            required
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading} />

          <input
            aria-label="password"
            type="password"
            id="password"
            name="password"
            required
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading} />

          <button
            style={{ marginTop: "1em" }}
            className="btn login-btn"
            type="submit"
            disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          {error && <p style={{ color: "red", fontSize: "0.9em", margin: "1em 0 2em 0" }}>{error}</p>}

        </form>

        <p>Not a user yet?  <NavLink to="/user/signup">Create an account here</NavLink></p>
      </div>
    </div>
  )
}

export default LoginPage

