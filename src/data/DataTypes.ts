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
  supertechnique: string;
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
