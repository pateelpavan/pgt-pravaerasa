import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NexusLogin from '@/components/ui/nexus-3d-animated-login-futuristic-authentication-ui';
import { Code2 } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async ({ email, password }) => {
    // Attempt authentication via AuthContext
    const loggedUser = await login(email.trim(), password);

    // Automatic hidden role-based routing:
    // If admin credentials match, redirects directly to Admin Dashboard (/admin)
    // Otherwise redirects to Client Dashboard (/dashboard)
    if (loggedUser.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="w-full">
      <NexusLogin
        brandName="PTG"
        logo={
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 via-amber-500 to-orange-600 p-[2px] shadow-md shadow-orange-500/20">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <Code2 className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        }
        accentColor="#EA580C"
        title="Portal Login"
        description="Sign in to access your project progress, scheduled meetings, and flexible milestone EMI payments."
        emailPlaceholder="name@company.com or Login ID"
        passwordPlaceholder="Enter your secure password"
        signInText="Sign in to Portal"
        showSocialLogin={false}
        showForgotPassword={false}
        showRememberMe={true}
        eyebrow="PAVERASA TECH GROWTH"
        headline="Accelerating Digital Enterprise Growth"
        tagline="From high-performance engineering to AI solutions, track milestones and EMI payments seamlessly."
        signupText="Don't have a client account?"
        signupLinkText="Register as Client"
        onSubmit={handleLoginSubmit}
        onSignup={() => navigate('/register')}
      />
    </div>
  );
}
