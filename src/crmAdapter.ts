// Minimal "CRM adapter" for CRM style case submission & listing.
// Intent: give you seams for unit/service tests without external deps.

export type CaseStatus = "New" | "In Progress" | "Resolved" | "Closed";
export type Category = "General" | "Benefits" | "Healthcare" | "Education";

export interface WebCaseInput {
  subject: string;
  message: string;
  email: string;
  phone?: string;
  category?: string;
  veteranId?: string; // e.g., 9-digit ID
}

export interface CrmCase {
  id: string;
  subject: string;
  description: string;
  email: string;
  phone?: string;
  category: Category;
  status: CaseStatus;
  createdAt: string; // ISO string
  veteranId?: string;
}

function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export function normalizePhone(p?: string): string | undefined {
  if (!p) return undefined;
  const digits = p.replace(/\D/g, "");
  if (digits.length === 10) return `${digits.slice(0,3)}-${digits.slice(3,6)}-${digits.slice(6)}`;
  if (digits.length === 11 && digits.startsWith("1")) {
    return `${digits.slice(1,4)}-${digits.slice(4,7)}-${digits.slice(7)}`;
  }
  return p;
}

export function redactPII(text: string): string {
  return text
    .replace(/\b\d{9}\b/g, "[REDACTED-SSN]")
    .replace(/\b\d{16,}\b/g, "[REDACTED-CARD]");
}

export function buildCrmCase(input: WebCaseInput, now = new Date()): CrmCase {
  if (!input.subject || input.subject.trim().length === 0) throw new Error("subject required");
  if (input.subject.length > 120) throw new Error("subject too long (max 120)");
  if (!isEmail(input.email)) throw new Error("invalid email");
  if (input.veteranId && !/^\d{9}$/.test(input.veteranId)) throw new Error("invalid veteranId");

  const category = (["General", "Benefits", "Healthcare", "Education"] as const)
    .includes((input.category ?? "General") as Category)
      ? (input.category as Category) ?? "General"
      : "General";

  const c: CrmCase = {
    id: `case_${Math.random().toString(36).slice(2,10)}`,
    subject: input.subject.trim(),
    description: redactPII(input.message),
    email: input.email.toLowerCase(),
    phone: normalizePhone(input.phone),
    category,
    status: "New",
    createdAt: now.toISOString(),
    veteranId: input.veteranId,
  };
  return c;
}

const _cases: CrmCase[] = [];

export function createCase(input: WebCaseInput, now = new Date()): CrmCase {
  const c = buildCrmCase(input, now);
  _cases.push(c);
  return c;
}

export interface ListParams {
  status?: CaseStatus;
  category?: Category;
  page?: number;
  pageSize?: number;
}

export function listCases(params: ListParams = {}): { items: CrmCase[]; total: number; page: number; pageSize: number } {
  const { status, category } = params;
  const pageSize = Math.max(1, params.pageSize ?? 20);
  const page = Math.max(1, params.page ?? 1);

  let filtered = _cases.slice();
  if (status) filtered = filtered.filter(c => c.status === status);
  if (category) filtered = filtered.filter(c => c.category === category);

  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return { items, total: filtered.length, page, pageSize };
}

let _token: { value: string; expiresAt: number } | null = null;

export async function getAuthToken(fetchNow = Date.now): Promise<string> {
  const now = fetchNow();
  if (_token && _token.expiresAt >= now) {
    return _token.value;
  }
  const newTok = `tok_${Math.random().toString(36).slice(2,8)}`;
  _token = { value: newTok, expiresAt: now + 60_000 };
  return newTok;
}

export function __resetStore() { _cases.length = 0; _token = null; }
