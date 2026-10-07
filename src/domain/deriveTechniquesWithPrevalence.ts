import type { Technique } from "@/data/DataTypes";
import { calculateCumulativeScore } from "./cumulativeScore";
import type { UploadedPrevalence } from "./importPrevalenceWorkbook";

/**
 * Applies an uploaded prevalence profile to a base technique list.
 * Techniques omitted from the uploaded profile receive a prevalence score of 0.
 */
export function deriveTechniquesWithPrevalence(
  baseTechniques: readonly Technique[],
  uploadedPrevalence: readonly UploadedPrevalence[],
): Technique[] {
  const prevalenceByTechnique = new Map<string, number>();

  for (const { Technique, Prevalence } of uploadedPrevalence) {
    if (prevalenceByTechnique.has(Technique)) {
      throw new Error(`Duplicate technique ID in uploaded prevalence: ${Technique}.`);
    }

    prevalenceByTechnique.set(Technique, Prevalence);
  }

  return baseTechniques.map((technique) => {
    const prevalenceScore = prevalenceByTechnique.get(technique.tid) ?? 0;

    return {
      ...technique,
      prevalence_score: prevalenceScore,
      cumulative_score: calculateCumulativeScore({
        chokePointScore: technique.choke_point_score,
        prevalenceScore,
        actionabilityScore: technique.actionability_score.combined_score,
      }),
    };
  });
}
