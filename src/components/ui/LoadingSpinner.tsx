interface LoadingSpinnerProps {
  text?: string;
}

export default function LoadingSpinner({ text }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div className="w-8 h-8 border-3 border-dark-600 border-t-primary rounded-full animate-spin" />
      {text && <p className="text-light-300 text-sm">{text}</p>}
    </div>
  );
}
