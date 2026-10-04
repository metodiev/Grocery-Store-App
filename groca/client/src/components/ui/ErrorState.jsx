const ErrorState = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="card flex flex-col items-center gap-3 p-10 text-center">
      <h3 className="text-xl font-bold text-red-700">Unable to Load Data</h3>
      <p className="text-sm text-red-600">{message}</p>
      {onRetry && (
        <button className="btn-primary" onClick={onRetry} type="button">
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorState;
