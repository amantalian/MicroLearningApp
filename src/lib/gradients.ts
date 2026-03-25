export const GRADIENTS = [
  "from-violet-600 to-indigo-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-blue-500 to-cyan-600",
  "from-fuchsia-500 to-purple-600",
  "from-red-500 to-rose-600",
  "from-sky-500 to-blue-600",
  "from-lime-500 to-green-600",
  "from-yellow-500 to-amber-600",
];

export function getGradient(index: number): string {
  return GRADIENTS[index % GRADIENTS.length];
}
