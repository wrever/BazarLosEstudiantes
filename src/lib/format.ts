export function formatCLP(value: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function availabilityLabel(stock: number) {
  if (stock <= 0) return "Agotado";
  return "Disponible";
}
