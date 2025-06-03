// FlowObject class and related types for FlowDiagram
export type FlowArrow = 'left' | 'middle' | 'right' | 'down';

export interface FlowObjectConfig {
  label: string;
  color: string;
  icon: string;
  arrow: FlowArrow;
  t: number;
  devilish?: boolean;
}

export class FlowObject {
  label: string;
  color: string;
  icon: string;
  arrow: FlowArrow;
  t: number;
  devilish: boolean;
  constructor(cfg: FlowObjectConfig) {
    this.label = cfg.label;
    this.color = cfg.color;
    this.icon = cfg.icon;
    this.arrow = cfg.arrow;
    this.t = cfg.t;
    this.devilish = !!cfg.devilish;
  }
}

