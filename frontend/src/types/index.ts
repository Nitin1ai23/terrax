// Shared domain types for TERRAX

export type JobStatus = 'uploaded' | 'validating' | 'processing' | 'generating_tiles' | 'ready' | 'error'

export type DatasetKind = 'elevation' | 'orthophoto' | 'lidar' | 'vector' | 'csv'

export interface Dataset {
  id: string
  name: string
  kind: DatasetKind
  status: JobStatus
  createdAt: string
  sizeBytes: number
  crs?: string
  extent?: [number, number, number, number] // minx, miny, maxx, maxy
}

export interface Project {
  id: string
  name: string
  status: 'processing' | 'ready' | 'error'
  datasetCount: number
  updatedAt: string
  thumbnail?: string
}

export type AnalysisMethod =
  | 'ordinary_kriging'
  | 'indicator_kriging'
  | 'categorical_kriging'
  | 'cokriging'
  | 'gwr'
  | 'compositional'
  | 'spacetime'

export type VariogramModel = 'spherical' | 'exponential' | 'gaussian' | 'matern'

export interface VariogramParams {
  model: VariogramModel
  nugget: number
  sill: number
  range: number
}

export interface AnalysisJob {
  id: string
  method: AnalysisMethod
  status: JobStatus
  progress: number
  datasetId: string
  createdAt: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: number
}

export interface AssistantContext {
  page: string
  datasetId?: string
  lastAnalysis?: AnalysisMethod
}
