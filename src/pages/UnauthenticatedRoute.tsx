import {type ReactNode, useContext} from "react";
import {Navigate} from "react-router-dom";
import {AuthContext} from "../utils/AuthContext";
interface UnauthenticatedRouteProps {
    children: ReactNode;
}
export const UnauthenticatedRoute: React.FC<UnauthenticatedRouteProps> = ({ children }) => {
    const { isAuthenticated, isLoading } = useContext(AuthContext);
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isAuthenticated) {
        return <Navigate to="/" />;
    }

    return children;
};