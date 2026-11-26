import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

class FirebaseErrorBoundary extends React.Component<Props, State> {
  declare props: Readonly<Props>;
  declare setState: (state: Partial<State> | ((prevState: Readonly<State>) => Partial<State>)) => void;
  state: State = { hasError: false, errorMessage: '' };

  static getDerivedStateFromError(error: Error): State {
    let readable = error.message;
    try {
      const parsed = JSON.parse(error.message);
      if (parsed && parsed.error && parsed.operationType) {
        readable = `Cloud Sync (${parsed.operationType} on ${parsed.path || 'database'}): ${parsed.error}`;
      }
    } catch {
      // keep raw message
    }
    return { hasError: true, errorMessage: readable };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-xl p-6 space-y-4 text-center shadow-sm">
            <AlertTriangle className="w-10 h-10 text-amber-600 mx-auto" />
            <h2 className="text-lg font-bold text-slate-900">TECH HUB Sync Recovery</h2>
            <p className="text-xs text-slate-600 leading-relaxed break-words">
              {this.state.errorMessage || 'An unexpected application error occurred.'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, errorMessage: '' })}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-blue-700 text-white rounded-lg hover:bg-blue-800"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Resume TECH HUB
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default FirebaseErrorBoundary;
