import styles from "../components/Register.module.css";
import { useState } from "react";
import { MdSunny, MdDarkMode } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

axios.defaults.withCredentials = true;

const Register = () => {
    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");  // NEW FIELD
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [theme, setTheme] = useState("dark");
    const navigate = useNavigate();

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
        setLoading(true);
        setError("");

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/auth/register`,
                {
                    username,
                    password,
                    displayName,   // 👈 sent to backend
                },
                { withCredentials: true },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            // Short delay to show animation (optional)
            setTimeout(() => {
                setLoading(false);
                navigate("/home", { replace: true });
            }, 500);

        } catch (err) {
            console.error("Registration Error Details:", err);
            const errorMessage = err.response?.data?.error || err.message || "Registration failed";
            setError(errorMessage);
            setLoading(false);
        }
    };

    return (
        <div className={`${styles.container} ${theme === "dark" ? styles.dark : styles.light}`}>
            {loading && <Loading />}
            <div className={styles.content}>
                <button onClick={toggleTheme} className={styles.themeToggle}>
                    {theme === "dark" ? <MdSunny /> : <MdDarkMode />}
                </button>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.para}>
                        Create Account
                        <img src="/img/logo.png" className={styles.logoicon} /> TuneX
                    </div>

                    <div className={styles.orContainer}>
                        <span className={styles.orText}>REGISTER</span>
                    </div>

                    <input
                        type="text"
                        placeholder="Username"
                        className={styles.input}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    {/* NEW: Display Name Input */}
                    <input
                        type="text"
                        placeholder="Display Name"
                        className={styles.input}
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className={styles.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && <p className={styles.error}>{error}</p>}

                    <button type="submit" className={styles.button} disabled={loading}>
                        Register
                    </button>

                    <p className={styles.para1}>
                        Already have an account? <a href="/login">Login</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
