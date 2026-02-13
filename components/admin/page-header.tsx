export function AdminPageHeader({
  title,
  description
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6 space-y-2">
      <h1 className="text-3xl font-bold text-white">{title}</h1>
      {description ? <p className="text-sm text-slate-300">{description}</p> : null}
    </div>
  );
}