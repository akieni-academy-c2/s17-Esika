const MAX_L = 1280;
const MAX_H = 720;
const MAX_OCTETS = 200 * 1024;

const versBlob = (canvas, qualite) =>
  new Promise((resolve) => canvas.toBlob(resolve, "image/webp", qualite));

/** Réduit une photo en WebP < 200 Ko (1280x720 max). Retourne { blob, url, taille }. */
export async function compresserImage(fichier) {
  const bitmap = await createImageBitmap(fichier);
  let echelle = Math.min(1, MAX_L / bitmap.width, MAX_H / bitmap.height);
  let blob = null;

  for (let essai = 0; essai < 4; essai++) {
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * echelle);
    canvas.height = Math.round(bitmap.height * echelle);
    canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    for (let q = 0.85; q >= 0.4; q -= 0.15) {
      blob = await versBlob(canvas, q);
      if (blob && blob.size <= MAX_OCTETS) break;
    }
    if (blob && blob.size <= MAX_OCTETS) break;
    echelle *= 0.8; // encore trop lourd : on réduit les dimensions
  }

  bitmap.close?.();
  if (!blob) throw new Error("COMPRESSION_IMPOSSIBLE");
  return { blob, url: URL.createObjectURL(blob), taille: blob.size };
}