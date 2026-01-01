/**
 * Types for app workspace
 */

export type WorkflowStatus =
  | "idle"
  | "checking"
  | "checked"
  | "formatting"
  | "complete";

export interface FormatSettings {
  enableTypography: boolean;
  enableMargins: boolean;
  enableSpacing: boolean;
  fixCitations: boolean;
  autoFitTables: boolean;
  centerImages: boolean;
}
