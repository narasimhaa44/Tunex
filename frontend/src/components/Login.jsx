import styles from "../components/Login.module.css";
import { useState } from "react";
import axios from "axios";
import { MdSunny, MdDarkMode } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

axios.defaults.withCredentials = true;

import Loading from "./Loading";

// ... existing imports

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [theme, setTheme] = useState("dark");
    const [isLoading, setIsLoading] = useState(false); // Local loading state
    const navigate = useNavigate();
    const { setUser } = useAuth(); // Destructure setUser

    // Redirect if already logged in
    useState(() => {
        if (localStorage.getItem("token")) {
            navigate("/home", { replace: true });
        }
    }, []);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true); // Start loading

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
                { username, password },
                { withCredentials: true }
            );

            setUser(res.data.user); // Update context
            localStorage.setItem("token", res.data.accessToken);
            console.log("TOKEN SAVED:", res.data.accessToken);

            // Short delay to show animation (optional, but good for UX)
            setTimeout(() => {
                setIsLoading(false);
                navigate("/home", { replace: true });
            }, 500);

        } catch (err) {
            console.error("Login Error Details:", err);
            const errorMessage = err.response?.data?.error || err.message || "Login failed";
            setError(errorMessage);
            setIsLoading(false); // Stop loading on error
        }
    };

    return (
        <div className={`${styles.container} ${theme === "dark" ? styles.dark : styles.light}`}>
            {isLoading && <Loading />} {/* Show full screen loader */}
            <div className={styles.content}>
                <button onClick={toggleTheme} className={styles.themeToggle}>
                    {theme === "dark" ? <MdSunny /> : <MdDarkMode />}
                </button>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.para}>
                        Welcome to
                        <img src="/img/logo.png" className={styles.logoicon} />
                        Tune X
                    </div>

                    <input
                        type="text"
                        placeholder="Username"
                        className={styles.input}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className={styles.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && <p className={styles.error}>{error}</p>}

                    <button type="submit" className={styles.button}>Login</button>

                    <p className={styles.para1}>
                        Don't have an account? <a href="/register">Register</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
