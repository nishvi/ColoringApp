
export interface ColoringPage {
  id: string;
  prompt: string;
  lineArtUrl: string;
  coloredUrl?: string;
  createdAt: number;
}

export enum GenerationState {
  IDLE = 'IDLE',
  GENERATING_LINE_ART = 'GENERATING_LINE_ART',
  COLORING = 'COLORING',
  ERROR = 'ERROR'
}
