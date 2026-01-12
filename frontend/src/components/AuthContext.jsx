import { createContext, useState, useEffect, useContext } from "react";
import api from "../api/api";
import Loading from "./Loading";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/api/auth/me")
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
        await api.post("/api/auth/logout");
        localStorage.removeItem("token");
        setUser(null);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <AuthContext.Provider value={{ user, setUser, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// 🔥 FIXED (you forgot this import above)
export const useAuth = () => useContext(AuthContext);
