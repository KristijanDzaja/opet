import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from '../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

const UserContext = createContext()

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState({});

    const signUp = async (email, password) => {
        try {
            // Create user in Firebase Authentication
            await createUserWithEmailAndPassword(auth, email, password);

            // Add user details to Firestore
            const userData = {
                numPublishedPosts: 0,
                publishedPosts: [],
                email: email
            };
            await setDoc(doc(db, 'users', email), userData);
        } catch (error) {
            console.error("Error signing up:", error.message);
            throw error; // Rethrow error for handling in UI
        }
    };

    const signIn = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        return signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => {
            unsubscribe();
        };
    }, []);


    return (
        <UserContext.Provider value={{ signUp, signIn, logout, user }}>
            {children}
        </UserContext.Provider>
    );
};

export const UserAuth = () => {
    return useContext(UserContext);
};
