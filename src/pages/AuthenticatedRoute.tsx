import { Navigate } from "react-router-dom";
import React, {type ReactNode, useContext} from "react";
import {AuthContext} from "../utils/AuthContext";
interface AuthenticatedRouteProps {
    children: ReactNode;
}
export const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({ children }) => {
    const { isAuthenticated , isLoading } = useContext(AuthContext);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated){
        return <Navigate to="/login" />
    }

    return <>
        {children}
    </>;
};