import techniques from "@/data/Techniques.json";
import type { Technique } from "@/data/DataTypes";
import { describe, expect, it } from "vitest";
import { deriveTechniquesWithPrevalence } from "./deriveTechniquesWithPrevalence";

describe("deriveTechniquesWithPrevalence", () => {
  it("overrides supplied prevalence, assigns zero to omissions, and preserves the base list", () => {
    const baseTechniques = structuredClone(techniques.slice(0, 2)) as Technique[];
    const [firstTechnique, secondTechnique] = baseTechniques;
    const originalFirstPrevalence = firstTechnique.prevalence_score;
    const originalSecondPrevalence = secondTechnique.prevalence_score;

    const derivedTechniques = deriveTechniquesWithPrevalence(baseTechniques, [
      { Technique: firstTechnique.tid, Prevalence: 0.75 },
    ]);

    expect(derivedTechniques[0].prevalence_score).toBe(0.75);
    expect(derivedTechniques[0].cumulative_score).toBe(
      firstTechnique.choke_point_score +
        0.75 +
        firstTechnique.actionability_score.combined_score,
    );
    expect(derivedTechniques[1].prevalence_score).toBe(0);
    expect(baseTechniques[0].prevalence_score).toBe(originalFirstPrevalence);
    expect(baseTechniques[1].prevalence_score).toBe(originalSecondPrevalence);
  });

  it("rejects duplicate uploaded technique IDs", () => {
    const baseTechniques = structuredClone(techniques.slice(0, 1)) as Technique[];
    const techniqueId = baseTechniques[0].tid;

    expect(() =>
      deriveTechniquesWithPrevalence(baseTechniques, [
        { Technique: techniqueId, Prevalence: 0.1 },
        { Technique: techniqueId, Prevalence: 0.2 },
      ]),
    ).toThrow(`Duplicate technique ID in uploaded prevalence: ${techniqueId}.`);
  });
});
