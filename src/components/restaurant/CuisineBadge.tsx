import Badge from "@/components/ui/Badge";

interface CuisineBadgeProps {
  cuisine: string;
}

export default function CuisineBadge({ cuisine }: CuisineBadgeProps) {
  return <Badge variant="primary">{cuisine}</Badge>;
}
