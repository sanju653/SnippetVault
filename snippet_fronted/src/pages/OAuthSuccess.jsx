
import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

function OAuth2Success() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const login = useAuthStore((state) => state.login);
    const hasProcessed = useRef(false);

    useEffect(() => {
        if (hasProcessed.current) return;
        hasProcessed.current = true;

        const accessToken = searchParams.get("accessToken");
        const refreshToken = searchParams.get("refreshToken");
const id = searchParams.get("id");
const name = searchParams.get("name");
const email = searchParams.get("email");

        if (!accessToken || !refreshToken || !id || !name || !email) {
            console.error("OAuth callback is missing required parameters.");
            navigate("/login", {
                replace: true,
                state: {
                    message: "Social login failed. Please try again."
                }
            });
            return;
        }

        // Save both tokens in Zustand
        login({
           user: {
        id: Number(id),
        name,
        email
    },
            accessToken,
            refreshToken,
        });

        // Remove tokens from the URL and open dashboard
        navigate("/", { replace: true });
    }, [searchParams, login, navigate]);

    return (
        <div className="container text-center py-5">
            <div
                className="spinner-border text-primary mb-3"
                role="status"
            >
                <span className="visually-hidden">Loading...</span>
            </div>

            <h4>Completing sign in...</h4>
            <p>Please wait while we prepare your workspace.</p>
        </div>
    );
}

export default OAuth2Success;

