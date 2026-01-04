interface CardProps {
  title: string;
  value: string;
  icon: string;
}

export default function CardInfo({ title, value, icon }: CardProps) {
  return (
    <div className="bg-zinc-800 p-6 rounded-2xl border border-zinc-700 hover:border-emerald-500 transition-colors group">
      <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
      <p className="text-white text-xl font-bold mt-1">{value}</p>
    </div>
  );
}