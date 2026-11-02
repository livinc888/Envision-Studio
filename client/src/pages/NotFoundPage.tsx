import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Compass } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full p-8 rounded-3xl bg-[#121217] border border-white/10 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-studio-red/10 border border-studio-red/30 flex items-center justify-center mx-auto text-studio-red">
          <Compass className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <div className="font-mono text-xs font-bold uppercase tracking-widest text-studio-red">
            404 // NAVIGATION EXCEPTION
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Plate Not Found
          </h1>
          <p className="text-xs text-zinc-400 font-sans leading-relaxed">
            The studio route or resource node you requested does not exist or has been relocated.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/app" className="w-full sm:w-auto">
            <Button variant="primary" className="w-full justify-center">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              App Overview
            </Button>
          </Link>

          <Link to="/" className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full justify-center">
              <Home className="w-3.5 h-3.5 mr-1.5" />
              Website
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
