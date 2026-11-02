import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('EnvisionStudio Uncaught Error Boundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0B0D] text-white flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full p-8 rounded-3xl bg-[#121217] border border-white/10 shadow-2xl text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-studio-red/10 border border-studio-red/30 flex items-center justify-center mx-auto text-studio-red">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white tracking-tight">System Exception Intercepted</h2>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                An unexpected interface error occurred. The application state has been preserved safely.
              </p>
              {this.state.error?.message && (
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] text-zinc-400 text-left overflow-auto max-h-24">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="primary"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Reload Application
              </Button>

              <a href="/">
                <Button variant="secondary">
                  <Home className="w-3.5 h-3.5 mr-1.5" />
                  Studio Home
                </Button>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
