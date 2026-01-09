import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/me`, {
            withCredentials: true,
        })
            .then((res) => {
                console.log(res.data.user);
                console.log("Auth User:", res.data.user);
                setUser(res.data.user);
                setLoading(false);
            })
            .catch(() => {
                setUser(null);
                setLoading(false);
            });
    }, []);

    // Logout
    const logout = async () => {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/logout`);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// 🔥 FIXED (you forgot this import above)
export const useAuth = () => useContext(AuthContext);
