import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-10">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                    >
                        Logout
                    </button>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Welcome back, {user?.name}!</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-700 p-4 rounded">
                            <p className="text-gray-400 text-sm">Email</p>
                            <p className="text-lg">{user?.email}</p>
                        </div>
                        <div className="bg-gray-700 p-4 rounded">
                            <p className="text-gray-400 text-sm">Phone</p>
                            <p className="text-lg">{user?.phone_number}</p>
                        </div>
                        <div className="bg-gray-700 p-4 rounded">
                            <p className="text-gray-400 text-sm">Member Since</p>
                            <p className="text-lg">{new Date(user?.created_at || "").toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}