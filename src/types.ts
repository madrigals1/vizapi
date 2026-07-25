export type TableData = Record<string, unknown>[];

export interface CompareField {
  name: string;
  value: number;
  bigger?: boolean;
}

export interface CompareSide {
  image: string;
  bio_fields: CompareField[];
  compare_fields: CompareField[];
}

export interface CompareData {
  left: CompareSide;
  right: CompareSide;
}

export interface SliceDataRow {
  sliceName: string;
  sliceValue: number;
  sliceColor: string;
}

export interface PieData {
  title: string;
  sliceName: string;
  sliceValue: string;
  sliceData: SliceDataRow[];
  chartArea: Record<string, unknown>;
  pieHole?: number;
  is3D?: boolean;
  width: number;
  height: number;
  fontSize?: number;
}

export interface BarOptions {
  width: number;
  height: number;
  [key: string]: unknown;
}

export interface BarData {
  data: unknown[][];
  options: BarOptions;
}

export interface PathInfo {
  absolute: string;
  relative: string;
  link: string;
}

export interface UniquePathOptions {
  prefix?: string;
  suffix?: string;
  extension?: string;
}

export interface VisualizeOptions<T> {
  action: (data: T) => string | Promise<string>;
  data: T;
  prefix: string;
  width: number;
  height: number;
}

export type VisualResult = string | false;
