import { createContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    signOut,
    updateProfile
} from "firebase/auth";
import auth from "@/FireBase/firebase";


export const AppContext = createContext(null);

const provider = new GoogleAuthProvider();

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const signUpWithEmail = async (email, password, name) => {
        try {
            setLoading(true);
            const res = await createUserWithEmailAndPassword(auth, email, password);
            if (name) {
                await updateProfile(res.user, { displayName: name });
            }
            setUser(res.user);
            return { success: true, user: res.user };
        } catch (error) {
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const loginWithEmail = async (email, password) => {
        try {
            setLoading(true);
            const res = await signInWithEmailAndPassword(auth, email, password);
            setUser(res.user);
            return { success: true, user: res.user };
        } catch (error) {
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const loginWithGoogle = async () => {
        try {
            setLoading(true);
            const res = await signInWithPopup(auth, provider);
            setUser(res.user);
            return { success: true, user: res.user };
        } catch (error) {
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await signOut(auth);
        setUser(null);
    };

    return (
        <AppContext.Provider value={{ user, loading, signUpWithEmail, loginWithEmail, loginWithGoogle, logout }}>
            {children}
        </AppContext.Provider>
    );
};
