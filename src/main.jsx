import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import './index.css'

class GlobalErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Global Error Caught:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-900 p-4 font-sans text-center">
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Something went wrong</h1>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-6">The application encountered an unexpected error.</p>
                    <button
                        onClick={() => window.location.reload(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-6 rounded-lg transition-colors shadow-lg"
                    >
                        Reload Application
                    </button>
                    <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500">
                        Clicking reload will clear the local cache and refresh the app.
                    </p>
                </div>
            );
        }

        return this.props.children;
    }
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <GlobalErrorBoundary>
            <HelmetProvider>
                <App />
            </HelmetProvider>
        </GlobalErrorBoundary>
    </React.StrictMode>,
)
