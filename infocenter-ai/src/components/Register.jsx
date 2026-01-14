import {useState} from 'react';
import {UserPlus, ArrowLeft, Mail, Lock, User} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import '../css/Register.css';

export function Register({onRegister}) {
    const navigate = useNavigate(); // ✅ router navigation

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (!formData.email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    fullName: formData.fullName
                })
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || "Registration failed");
            }

            const user = await response.json();
            console.log("Registered user:", user);

            // optional callback
            onRegister?.(user.email);

            // redirect after successful backend save
            navigate("/login");

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="register-page">
            <div className="register-card">

                {/* Header */}
                <div className="register-header">
                    <div className="icon-circle">
                        <UserPlus className="header-icon"/>
                    </div>
                    <h2>Create Account</h2>
                    <p>Join the university community</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="register-form">
                    {error && <div className="error-message">{error}</div>}

                    {/* Full Name */}
                    <div className="form-group">
                        <label>Full Name</label>
                        <div className="input-wrapper">
                            <User className="input-icon"/>
                            <input
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="form-group">
                        <label>Email Address</label>
                        <div className="input-wrapper">
                            <Mail className="input-icon"/>
                            <input
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@university.edu"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon"/>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="At least 6 characters"
                            />
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon"/>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Re-enter password"
                            />
                        </div>
                    </div>

                    {/* Register Button */}
                    <button type="submit" className="register-button">
                        <UserPlus className="btn-icon"/> Create Account
                    </button>
                </form>

                {/* ✅ Login navigation */}
                <div className="login-link">
                    Already have an account?
                    <button onClick={() => navigate("/login")}>
                        Login here
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Register;