const chiffres = (numero) => String(numero).replace(/\D/g, "");

export function lienWhatsApp(numero, message = "") {
  const texte = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${chiffres(numero)}${texte}`;
}

export function lienAppel(numero) {
  return `tel:+${chiffres(numero)}`;
}