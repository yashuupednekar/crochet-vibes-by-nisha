import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('App crashed:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cream flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="text-7xl mb-6">😵‍💫</div>
            <h1 className="font-display text-3xl text-blush-800 mb-3">Something went wrong</h1>
            <p className="font-body text-blush-400 text-sm mb-8">
              Don't worry — your data is safe. Let's get you back on track!
            </p>
            <button onClick={this.handleReset} className="btn-primary">
              Back to Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;