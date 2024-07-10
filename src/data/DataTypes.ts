export interface Technique
  extends TechniqueBase,
    TechniqueCoverage,
    TechniqueScores {
  cumulative_score: number;
  adjusted_score: number;
  tactics: Array<string>;
  is_subtechnique: boolean;
  supertechnique: string | null;
  cis_controls: Array<string>;
  nist_controls: Array<string>;
  platforms: Array<string>;
  data_sources: Array<string>;
  has_car: boolean;
  has_sigma: boolean;
  has_es_siem: boolean;
  has_splunk: boolean;
}
export interface ExportedTechnique extends TechniqueBase, TechniqueScores {
  rank: number;
  score: number;
}
export interface TechniqueBase {
  tid: string;
  name: string;
  description: string;
  url: string;
  detection: string;
  subtechniques: Array<Subtechnique>;
  mitigations: Array<Mitigation>;
}
export interface Subtechnique {
  tid: string;
  name: string;
  description: string;
  url: string;
  detection: string;
  mitigations: Array<Mitigation>;
}
export interface Mitigation {
  mid: string;
  name: string;
  description: string;
  url: string;
}

export interface TechniqueScores {
  process_score: number;
  network_score: number;
  file_score: number;
  cloud_score: number;
  hardware_score: number;
  actionability_score: {
    combined_score: number;
    mitigation_score: number;
    detection_score: number;
  };
  choke_point_score: number;
  prevalence_score: number;
}

export interface TechniqueCoverage {
  process_coverage: boolean;
  network_coverage: boolean;
  file_coverage: boolean;
  cloud_coverage: boolean;
  hardware_coverage: boolean;
}
