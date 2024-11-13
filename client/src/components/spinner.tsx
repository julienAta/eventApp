export function Spinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}
