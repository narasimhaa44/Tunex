// import styles from "../components/Login.module.css";
// import { useState } from "react";
// import { MdSunny, MdDarkMode } from "react-icons/md";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
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
//                     <button type="submit" className={styles.button}>login</button>
//                     <p className={styles.para1}>Don't have an account? <a href="/register">Register</a></p>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default Login;
import styles from "../components/Login.module.css";
import { useState } from "react";
import axios from "axios";
import { MdSunny, MdDarkMode } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

axios.defaults.withCredentials = true;

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [theme, setTheme] = useState("dark");
    const navigate = useNavigate();
    const { setUser } = useAuth(); // Destructure setUser

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await axios.post(
                "https://tunex-15at.onrender.com/api/auth/login",
                { username, password },
                { withCredentials: true }
            );

            setUser(res.data.user); // Update context
            navigate("/home");
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.error || "Login failed");
        }
    };

    return (
        <div className={`${styles.container} ${theme === "dark" ? styles.dark : styles.light}`}>
            <div className={styles.content}>
                <button onClick={toggleTheme} className={styles.themeToggle}>
                    {theme === "dark" ? <MdSunny /> : <MdDarkMode />}
                </button>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.para}>
                        Welcome to
                        <img src="/img/logo.png" className={styles.logoicon} />
                        TuneX
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
