const STORAGE_PREFIX = "complex-preview-draft:";

export interface ComplexPreviewDraft {
  complex: Record<string, unknown>;
  slides: unknown[];
  savedAt: number;
}

export function saveComplexPreviewDraft(
  complexId: string,
  data: { complex: Record<string, unknown>; slides: unknown[] },
): void {
  const payload: ComplexPreviewDraft = {
    complex: data.complex,
    slides: data.slides,
    savedAt: Date.now(),
  };
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${complexId}`, JSON.stringify(payload));
  } catch {
    // ignore quota errors
  }
}

export function loadComplexPreviewDraft(complexId: string): ComplexPreviewDraft | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${complexId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ComplexPreviewDraft;
    if (!parsed?.complex) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearComplexPreviewDraft(complexId: string): void {
  localStorage.removeItem(`${STORAGE_PREFIX}${complexId}`);
}
