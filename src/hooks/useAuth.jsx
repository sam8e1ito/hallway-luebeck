import React, { useEffect, useState } from "react";
import { auth, db, createUserProfile } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { AuthContext } from "./authContext";

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (u) => {
            setUser(u);
            if (u) {
                try {
                    const docRef = doc(db, "users", u.uid);
                    // Retry logic to handle transient offline errors
                    let snap = null;
                    let retries = 3;
                    while (retries > 0) {
                        try {
                            snap = await getDoc(docRef);
                            break;
                        } catch (retryErr) {
                            retries--;
                            if (retries > 0) {
                                await new Promise((resolve) =>
                                    setTimeout(resolve, 500 * (4 - retries))
                                );
                            } else {
                                throw retryErr;
                            }
                        }
                    }
                    if (snap && snap.exists()) {
                        const profileData = snap.data();
                        console.log("Profile loaded:", profileData);
                        setProfile(profileData);
                    } else {
                        // create minimal profile if it doesn't exist
                        try {
                            await createUserProfile(u.uid, {
                                displayName: u.displayName || u.email,
                                photoURL:
                                    u.photoURL ||
                                    `https://api.dicebear.com/9.x/identicon/svg?seed=${encodeURIComponent(
                                        u.uid
                                    )}`,
                            });
                            const newSnap = await getDoc(docRef);
                            setProfile(
                                newSnap.exists() ? newSnap.data() : null
                            );
                        } catch (createErr) {
                            console.warn(
                                "Profile creation skipped, continuing anyway",
                                createErr
                            );
                            setProfile(null);
                        }
                    }
                } catch (e) {
                    console.error("fetch profile error after retries", e);
                    // Continue anyway; don't block auth
                    setProfile(null);
                }
            } else {
                setProfile(null);
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const value = { user, profile, loading, setProfile };
    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
