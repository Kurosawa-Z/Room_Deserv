import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../api/auth";

export default function Signup() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const navigate = useNavigate();

	const handleSignup = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setIsSubmitting(true);
		try {
			await signup(username, password, rememberMe);
			navigate("/home");
		} catch (err: any) {
			setError(err?.message ?? "Signup failed");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center app-bg-background app-text-foreground mx-4">
			<div className="w-full max-w-md">
				{/* Branding */}
				<div className="text-center mb-8">
					<div className="flex justify-center mb-4"></div>
					<h1 className="text-3xl font-bold mb-2 app-text-foreground">
						Room Deserv
					</h1>
					<p className="app-text-muted">Create your account</p>
				</div>

				{/* Form */}
				<div className="app-bg-card rounded-lg p-8 shadow-md">
					<h2 className="text-2xl font-bold mb-6 app-text-foreground text-center">
						Sign Up
					</h2>

					{error ? (
						<div className="mb-4 text-sm text-red-600">{error}</div>
					) : null}

					<form onSubmit={handleSignup} className="space-y-4">
						<div>
							<label
								htmlFor="username"
								className="block text-sm font-medium mb-2 app-text-foreground"
							>
								Username
							</label>
							<input
								type="text"
								id="username"
								className="w-full px-4 py-2 border app-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Choose a username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								required
							/>
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium mb-2 app-text-foreground"
							>
								Password
							</label>
							<input
								type="password"
								id="password"
								className="w-full px-4 py-2 border app-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Create a password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>

						<div className="flex items-center justify-between">
							<label className="flex items-center">
								<input
									type="checkbox"
									checked={rememberMe}
									onChange={(e) => setRememberMe(e.target.checked)}
									className="mr-2"
								/>
								<span className="text-sm app-text-foreground">Remember me</span>
							</label>
						</div>

						<button
							type="submit"
							disabled={isSubmitting}
							className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium rounded-md transition mt-6"
						>
							{isSubmitting ? "Creating..." : "Create account"}
						</button>
					</form>

					<div className="mt-6 text-center">
						<p className="text-sm app-text-foreground">
							Already have an account?{" "}
							<Link
								to="/login"
								className="app-text-primary hover:underline font-medium"
							>
								Log in
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
