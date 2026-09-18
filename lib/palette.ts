// Paleta categórica validada com o script de acessibilidade do guia de dataviz:
// separação sob daltonismo (ΔE ≥ 8), piso de visão normal (ΔE ≥ 15) e contraste
// contra as superfícies deste app (#ffffff no claro, #14141b no escuro).
export const CATEGORY_COLORS = [
  { name: "Azul", light: "#2a78d6", dark: "#3987e5" },
  { name: "Laranja", light: "#eb6834", dark: "#d95926" },
  { name: "Verde-água", light: "#1baf7a", dark: "#199e70" },
  { name: "Amarelo", light: "#eda100", dark: "#c98500" },
  { name: "Rosa", light: "#e87ba4", dark: "#d55181" },
  { name: "Verde", light: "#008300", dark: "#008300" },
  { name: "Violeta", light: "#4a3aa7", dark: "#9085e9" },
  { name: "Vermelho", light: "#e34948", dark: "#e66767" },
] as const;

export const FALLBACK_COLOR = CATEGORY_COLORS[0];

export function colorPair(light: string) {
  return (
    CATEGORY_COLORS.find(
      (color) => color.light.toLowerCase() === light.toLowerCase()
    ) ?? { name: "Personalizada", light, dark: light }
  );
}

// Ícones disponíveis para categorias (nomes resolvidos em components/category-icon).
export const CATEGORY_ICONS = [
  "tag",
  "wallet",
  "shopping-cart",
  "utensils",
  "home",
  "car",
  "heart-pulse",
  "gamepad-2",
  "graduation-cap",
  "plane",
  "shirt",
  "smartphone",
  "dumbbell",
  "gift",
  "briefcase",
  "piggy-bank",
] as const;

export type CategoryIcon = (typeof CATEGORY_ICONS)[number];
