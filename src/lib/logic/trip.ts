export type TripLine = {
  kind: "treatment" | "flight" | "hotel" | "transfer" | "car" | "esim" | "insurance" | "experience";
  id: string;
  label: string;
  amountEur: number;
  simulated: boolean;
};

export function tripTotalEur(lines: TripLine[]): number {
  return lines.reduce((sum, line) => sum + (Number.isFinite(line.amountEur) ? line.amountEur : 0), 0);
}

export function assertSimulatedLines(lines: TripLine[]): boolean {
  return lines.every((line) => line.simulated);
}
