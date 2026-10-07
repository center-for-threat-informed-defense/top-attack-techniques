export interface CumulativeScoreComponents {
  chokePointScore: number;
  prevalenceScore: number;
  actionabilityScore: number;
  coverageAdjustment?: number;
}

/**
 * Calculates the base technique score from the methodology components.
 *
 * The optional coverage adjustment represents the sum of any workbook-side
 * coverage adjustments. Runtime monitoring adjustments remain separate.
 */
export function calculateCumulativeScore({
  chokePointScore,
  prevalenceScore,
  actionabilityScore,
  coverageAdjustment = 0,
}: CumulativeScoreComponents): number {
  return (
    (chokePointScore + prevalenceScore + actionabilityScore) *
    (1 + coverageAdjustment)
  );
}
