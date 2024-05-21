export interface Technique {
  tid: string;
  name: string;
  description: string;
  url: string;
  tactics: Array<string>;
  detection: string;
  platforms: Array<string>;
  data_sources: Array<string>;
  is_subtechnique: boolean;
  supertechnique: string | null;
  subtechniques: Array<Subtechnique>;
  mitigations: Array<Mitigation>;
  cumulative_score: number;
  adjusted_score: number;
  has_car: boolean;
  has_sigma: boolean;
  has_es_siem: boolean;
  has_splunk: boolean;
  cis_controls: Array<string>;
  nist_controls: Array<string>;
  process_coverage: boolean;
  network_coverage: boolean;
  file_coverage: boolean;
  cloud_coverage: boolean;
  hardware_coverage: boolean;
  process_score: number;
  network_score: number;
  file_score: number;
  cloud_score: number;
  hardware_score: number;
  actionability_score: number;
  choke_point_score: number;
  prevalence_score: number;
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

export interface ExportedTechnique {
  rank: number;
  tid: string;
  name: string;
  description: string;
  url: string;
  detection: string;
  score: number;
  process_score: number;
  network_score: number;
  file_score: number;
  cloud_score: number;
  hardware_score: number;
  subtechniques: Array<Subtechnique>;
  mitigations: Array<Mitigation>;
}
