// import styles from "../components/Register.module.css";
// import { useState } from "react";
// import { MdSunny, MdDarkMode } from "react-icons/md";
// import { useNavigate } from "react-router-dom";

// const Register = () => {
//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [theme, setTheme] = useState("dark");
//     const navigate = useNavigate();

//     const toggleTheme = () => {
//         setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         // Add login logic here
//         navigate("/home");
//     }

//     return (
//         <div className={`${styles.container} ${theme === "dark" ? styles.dark : styles.light}`}>
//             <div className={styles.content}>
//                 <button onClick={toggleTheme} className={styles.themeToggle} aria-label="Toggle Theme">
//                     {theme === "dark" ? <MdSunny /> : <MdDarkMode />}
//                 </button>
//                 <form onSubmit={handleSubmit} className={styles.form}>
//                     <div className={styles.para}>Welcome to<img src="../public/img/logo.png" alt="logo" className={styles.logoicon} /> TuneX</div>
//                     <button type="submit" className={styles.button1}><img src="../public/img/googleicon.png" alt="googleicon" className={styles.googleicon} /> Continue with Google</button>
//                     <div className={styles.orContainer}>
//                         <span className={styles.orText}>OR</span>
//                     </div>
//                     <input
//                         type="text"
//                         placeholder="Username"
//                         className={styles.input}
//                         value={username}
//                         onChange={(e) => setUsername(e.target.value)}
//                     />
//                     <input
//                         type="password"
//                         placeholder="Password"
//                         className={styles.input}
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                     />
//                     <button type="submit" className={styles.button}>Register</button>
//                     <p className={styles.para1}>Don't have an account? <a href="/login">Login</a></p>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default Register;
import styles from "../components/Register.module.css";
import { useState } from "react";
import { MdSunny, MdDarkMode } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;

const Register = () => {
    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");  // NEW FIELD
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [theme, setTheme] = useState("dark");
    const navigate = useNavigate();

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await axios.post(
                "https://tunex-15at.onrender.com/api/auth/register",
                {
                    username,
                    password,
                    displayName,   // 👈 sent to backend
                },
                { withCredentials: true }
            );

            navigate("/home");
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed");
        }

        setLoading(false);
    };

    return (
        <div className={`${styles.container} ${theme === "dark" ? styles.dark : styles.light}`}>
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
                        {loading ? "Creating..." : "Register"}
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
