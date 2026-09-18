import {
  Briefcase,
  Car,
  Dumbbell,
  Gamepad2,
  Gift,
  GraduationCap,
  HeartPulse,
  Home,
  PiggyBank,
  Plane,
  Shirt,
  ShoppingCart,
  Smartphone,
  Tag,
  Utensils,
  Wallet,
  type LucideProps,
} from "lucide-react";

const ICONS = {
  tag: Tag,
  wallet: Wallet,
  "shopping-cart": ShoppingCart,
  utensils: Utensils,
  home: Home,
  car: Car,
  "heart-pulse": HeartPulse,
  "gamepad-2": Gamepad2,
  "graduation-cap": GraduationCap,
  plane: Plane,
  shirt: Shirt,
  smartphone: Smartphone,
  dumbbell: Dumbbell,
  gift: Gift,
  briefcase: Briefcase,
  "piggy-bank": PiggyBank,
} as const;

export function CategoryIcon({
  name,
  ...props
}: LucideProps & { name: string }) {
  const Icon = ICONS[name as keyof typeof ICONS] ?? Tag;
  return <Icon {...props} />;
}
