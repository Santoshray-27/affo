import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Store, ArrowLeft, Home, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-full bg-mint text-primary flex items-center justify-center mb-6 shadow-sm">
        <Store className="w-10 h-10 opacity-70" />
      </div>

      <span className="text-xs font-bold text-leaf uppercase tracking-widest bg-mint px-3 py-1 rounded-full border border-primary/25 mb-3">
        Page Not Found (404)
      </span>

      <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-app-text tracking-tight">
        Looks Like This Trail Led Off-Farm!
      </h1>

      <p className="text-sm text-muted max-w-md mt-3 leading-relaxed">
        The page you are looking for doesn&apos;t exist, was moved, or has an invalid reference ID.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
        <Button
          variant="outline"
          size="md"
          onClick={() => navigate(-1)}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Go Back
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/')}
          icon={<Home className="w-4 h-4" />}
        >
          Return Home
        </Button>
        <Button
          variant="secondary"
          size="md"
          onClick={() => navigate('/shop')}
          icon={<Compass className="w-4 h-4" />}
        >
          Browse Fresh Harvest
        </Button>
      </div>
    </div>
  );
};

