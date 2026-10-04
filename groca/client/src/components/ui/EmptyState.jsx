const EmptyState = ({ title, description, action }) => {
  return (
    <div className="card flex flex-col items-center gap-3 p-10 text-center">
      <h3 className="text-xl font-bold text-slate-800">{title}</h3>
      <p className="max-w-md text-sm text-slate-600">{description}</p>
      {action}
    </div>
  );
};

export default EmptyState;
