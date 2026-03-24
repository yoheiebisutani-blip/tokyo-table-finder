interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "gold" | "green";
  className?: string;
}

const variants = {
  default: "bg-dark-700 text-light-200",
  primary: "bg-primary/20 text-primary",
  gold: "bg-accent-gold/20 text-accent-gold",
  green: "bg-accent-green/20 text-accent-green",
};

export default function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
