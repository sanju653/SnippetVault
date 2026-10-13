import { Link, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

function Home() {
const isLoggedIn = useAuthStore((state) => state.isLoggedIn);


if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
}

return (
    <div className="min-vh-100 d-flex flex-column bg-light">

        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4 py-3">
            <Link to="/" className="navbar-brand fw-bold fs-4 text-primary">
                <i className="bi bi-code-slash me-2"></i>
                SnippetVault
            </Link>

            <div className="ms-auto d-flex gap-2">
                <Link to="/login" className="btn btn-outline-primary px-4">
                    Login
                </Link>

                <Link to="/register" className="btn btn-primary px-4">
                    Register
                </Link>
            </div>
        </nav>

        <main className="container flex-grow-1 d-flex align-items-center">
            <div className="row align-items-center py-5 w-100">

                <div className="col-lg-6 mb-5 mb-lg-0">
                    <span className="badge bg-primary-subtle text-primary px-3 py-2 mb-3">
                        Your Personal Developer Workspace
                    </span>

                    <h1 className="display-4 fw-bold mb-4">
                        Store Your Code.
                        <br />
                        <span className="text-primary">
                            Save Your Ideas.
                        </span>
                    </h1>

                    <p className="lead text-secondary mb-4">
                        Keep your code snippets, technical notes, and
                        developer knowledge organized in one place.
                        Find what you need, whenever you need it.
                    </p>

                    <div className="d-flex flex-wrap gap-3">
                        <Link to="/register" className="btn btn-primary btn-lg px-4">
                            Get Started
                            <i className="bi bi-arrow-right ms-2"></i>
                        </Link>

                        <Link to="/login" className="btn btn-outline-dark btn-lg px-4">
                            Sign In
                        </Link>
                    </div>

                    <div className="d-flex flex-wrap gap-4 mt-5 text-secondary">
                        <span>
                            <i className="bi bi-code-square text-primary me-2"></i>
                            Code Snippets
                        </span>

                        <span>
                            <i className="bi bi-journal-text text-primary me-2"></i>
                            Technical Notes
                        </span>

                        <span>
                            <i className="bi bi-stars text-primary me-2"></i>
                            AI Assistance
                        </span>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card border-0 shadow-lg rounded-4 p-4">
                        <div className="d-flex align-items-center gap-2 mb-4">
                            <span className="rounded-circle bg-danger" style={{ width: 12, height: 12 }}></span>
                            <span className="rounded-circle bg-warning" style={{ width: 12, height: 12 }}></span>
                            <span className="rounded-circle bg-success" style={{ width: 12, height: 12 }}></span>
                            <span className="ms-2 text-secondary small">
                                example.java
                            </span>
                        </div>

                        <div className="bg-dark rounded-3 p-4 text-light">
                            <p className="text-secondary mb-3">
                                // Your code, organized
                            </p>

                            <div className="mb-2">
                                <span className="text-info">public class</span>{" "}
                                <span className="text-warning">HelloDeveloper</span>{" "}
                                {"{"}
                            </div>

                            <div className="ps-4 mb-2">
                                <span className="text-info">public static void</span>{" "}
                                <span className="text-warning">main</span>
                                (String[] args) {"{"}
                            </div>

                            <div className="ps-5 mb-2">
                                System.out.println(
                            </div>

                            <div className="ps-5 mb-2 text-success">
                                "Code. Learn. Build.")
                            </div>

                            <div className="ps-4 mb-2">{"}"}</div>
                            <div>{ "}"}</div>
                        </div>

                        <div className="row g-3 mt-2">
                            <div className="col-6">
                                <div className="bg-light rounded-3 p-3">
                                    <i className="bi bi-folder2-open fs-4 text-primary"></i>
                                    <h6 className="mt-2 mb-1">Organized</h6>
                                    <small className="text-secondary">
                                        Keep snippets together
                                    </small>
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="bg-light rounded-3 p-3">
                                    <i className="bi bi-lightbulb fs-4 text-warning"></i>
                                    <h6 className="mt-2 mb-1">AI Powered</h6>
                                    <small className="text-secondary">
                                        Understand your code
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </main>

        <footer className="text-center py-3 bg-white border-top text-secondary">
            <small>© {new Date().getFullYear()} SnippetVault. Built for developers.</small>
        </footer>

    </div>
);


}

export default Home;
