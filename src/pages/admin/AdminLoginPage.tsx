import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAppStore } from '../../store/AppStoreContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch } = useAppStore();
  const toast = useToast();

  const [email, setEmail] = useState('owner@annapurna.demo');
  const [password, setPassword] = useState('demo1234');
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/admin';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      dispatch({ type: 'SET_ADMIN_AUTH', payload: true });
      toast.success('Welcome to Owner Portal', 'Logged in as Annapurna Administrator.');
      navigate(from, { replace: true });
    }, 400);
  };

  return (
    <div className="min-h-screen bg-forest-deep flex flex-col justify-center items-center p-4 selection:bg-mint selection:text-forest">
      <div className="w-full max-w-md bg-white rounded-card shadow-dropdown p-8 space-y-6 border border-line">
        <div className="text-center space-y-2">
          <img
            src="/brand/logo-simple.png"
            alt="Annapurna"
            className="h-12 mx-auto mb-2"
          />
          <h1 className="font-heading text-2xl font-normal text-ink">
            Owner Portal
          </h1>
          <p className="text-xs text-muted font-mono">
            Annapurna Farm Fresh &amp; Organics Operations
          </p>
        </div>

        {/* Demo Credentials Box */}
        <div className="p-3.5 bg-cream/60 rounded-[10px] border border-line text-xs font-mono space-y-1">
          <p className="text-forest font-semibold">Demo Access Credentials</p>
          <p className="text-muted text-[11px]">
            Email: <strong className="text-ink">owner@annapurna.demo</strong>
          </p>
          <p className="text-muted text-[11px]">
            Password: <strong className="text-ink">demo1234</strong> (pre-filled)
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Owner Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Enter Dashboard
          </Button>
        </form>

        <div className="pt-2 text-center">
          <Link
            to="/"
            className="text-xs font-mono text-muted hover:text-forest inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
};
