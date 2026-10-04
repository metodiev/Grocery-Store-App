const LoadingSpinner = ({ className = "h-8 w-8" }) => {
  return (
    <div className="flex items-center justify-center p-6">
      <div className={`animate-spin rounded-full border-4 border-green-100 border-t-brand-primary ${className}`} />
    </div>
  );
};

export default LoadingSpinner;
