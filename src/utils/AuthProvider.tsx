import {type ReactNode, useEffect, useState} from "react";
import {AuthContext} from "./AuthContext.tsx";
interface AuthProviderProps {
    children: ReactNode;
}
export const AuthProvider: React.FC<AuthProviderProps> = ({ children } ) => {
    const [isAuthenticated] = useState(true);
    const [role] = useState<'guest'|'host'>('guest');
    const [isLoading] = useState(false);
    useEffect(() => {
        // setIsLoading(true);
        // axios.get(environment + `/whoami`)
        //     .then(res => {
        //         if (res.status === 200){
        //             setIsAuthenticated(true);
        //         }
        //         setIsLoading(false);
        //     })
        //     .catch(() => {
        //         setIsAuthenticated(false);
        //         setIsLoading(false);
        //     });
    }, []);


    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, role }}>
            {children}
        </AuthContext.Provider>
    );
};