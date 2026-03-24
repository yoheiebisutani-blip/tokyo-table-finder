interface DifficultyBadgeProps {
  level: number;
  showLabel?: boolean;
}

const labels = ["Very Easy", "Easy", "Moderate", "Hard", "Very Hard"];

export default function DifficultyBadge({ level, showLabel = false }: DifficultyBadgeProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`inline-block w-2 h-2 rounded-full ${i < level ? "bg-primary" : "bg-dark-600"}`}
          />
        ))}
      </div>
      {showLabel && <span className="text-xs text-light-300">{labels[level - 1]}</span>}
    </div>
  );
}
