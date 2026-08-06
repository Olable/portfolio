export default function Loading({ text = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin"></div>
        <p className="text-gray-400">{text}</p>
      </div>
    </div>
  );
}
