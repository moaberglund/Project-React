import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import * as Yup from "yup";

// For ErrorMessages
interface ErrorMessage {
  message: string;
  type: 'username' | 'password' | 'general';
}

const SignUpPage = () => {

  // States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<ErrorMessage | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();


  // Yup 
  const validationSchema = Yup.object({
    username: Yup.string().required("Please enter a username.")
      .min(5, "Username must be at least 5 characters long.")
      .max(50, "Username can't be longer than 50 characters."),
    password: Yup.string().required("Please enter a password.")
      .min(8, "Password must be at least 6 characters long.")
      .max(20, "Password can't be longer than 20 characters."),
  });


  // Functions
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate the username and password
      await validationSchema.validate({ username, password }, { abortEarly: false });

      await register({ username, password });
      navigate('/user/login');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        // Create an object with the errors
        setError({
          message: err.errors.join(", "),
          type: err.path === 'username' ? 'username' : 'password',
        });
      } else {
        setError({
          message: "Failed to register. Control username and password.",
          type: 'general',
        });
      }
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
          {error && error.type === "username" && <p style={{ color: "red" }}>{error.message}</p>}

          <input
            aria-label="password"
            type="password"
            id="password"
            name="password"
            required value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            disabled={isLoading} />
          {error && error.type === "password" && <p style={{ color: "red" }}>{error.message}</p>}

          <button
            style={{ marginTop: "1em" }}
            className="btn signin-btn"
            type="submit"
            disabled={isLoading}>
            {isLoading ? 'Signing up...' : 'Sign up'}
          </button>

        </form>

        <p>Already a user?  <NavLink to="/user/login">Log in here</NavLink></p>
      </div>

    </div>
  )
}

export default SignUpPage