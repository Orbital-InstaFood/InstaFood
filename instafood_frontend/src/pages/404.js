import { useNavigate } from "react-router-dom";

export default function PageNotFound() {
    const navigate = useNavigate();

    return (
        <div>
            <p>Page not found.</p>
            <button onClick={() => navigate("/")}>Go to home page</button>
        </div>
    );
}