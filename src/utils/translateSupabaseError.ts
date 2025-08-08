// src/utils/translateSupabaseError.ts
export type AnySupabaseError = {
  code?: string | null
  message: string
  details?: string | null
  hint?: string | null
  status?: number | null
}

// Mapeamento por código de erro do Postgres
const PG_CODE_MAP: Record<string, string> = {
  // Violação de única (unique)
  "23505": "Esse registro já existe.",
  // FK
  "23503": "Não é possível salvar porque existe relação com outro registro.",
  // Not null
  "23502": "Campo obrigatório não informado.",
  // Check constraint
  "23514": "Um ou mais campos não atendem às regras definidas.",
  // Permissão / RLS
  "42501": "Você não tem permissão para essa operação.",
  // Sintaxe/entrada inválida (família 22xxx)
  "22001": "Valor muito longo para o campo.",
  "22003": "Número fora do intervalo permitido.",
  "22P02": "Formato inválido para o campo.",
};

// Mapeamento por nome de constraint (fino e 100% personalizado)
const CONSTRAINT_MAP: Array<{ pattern: RegExp; message: string }> = [

  { pattern: /contabilidade_identificacao_unique/i, message: "Já existe uma contabilidade com essa identificação." },

  { pattern: /contabilidade_email_unique/i, message: "Já existe uma contabilidade com este e-mail." },

  { pattern: /empresa_cnpj_unique/i, message: "Já existe uma empresa com este CNPJ." },
  { pattern: /empresa_email_unique/i, message: "Já existe uma empresa com este e-mail." },
  { pattern: /empresa_nome_fantasia_unique/i, message: "Já existe uma empresa com este nome fantasia." },
  { pattern: /empresa_razao_social_unique/i, message: "Já existe uma empresa com esta razão social." },
  { pattern: /empresa_telefone_unique/i, message: "Já existe uma empresa com este telefone." },
  // adicione outras constraints do seu schema aqui...
];

// Mapeamento básico para Auth (supabase.auth)
const AUTH_MAP: Array<{ test: (e: AnySupabaseError) => boolean; message: string }> = [
  { test: e => /email.*exists|already.*registered/i.test(e.message), message: "E-mail já cadastrado." },
  { test: e => /invalid login|invalid credentials/i.test(e.message), message: "E-mail ou senha inválidos." },
  { test: e => e.status === 429, message: "Muitas tentativas. Tente novamente em alguns minutos." },
];

export function translateSupabaseError(err: AnySupabaseError): string {
  const raw = `${err.message} ${err.details ?? ""}`.trim();

  // 1) Constraint específica
  for (const { pattern, message } of CONSTRAINT_MAP) {
    if (pattern.test(raw)) return message;
  }

  // 2) Código do Postgres
  if (err.code && PG_CODE_MAP[err.code]) return PG_CODE_MAP[err.code];

  // 3) Erros de Auth comuns
  for (const m of AUTH_MAP) {
    if (m.test(err)) return m.message;
  }

  // 4) Fallbacks inteligentes
  if (/duplicate key value|unique constraint/i.test(raw)) return "Registro duplicado.";
  if (/foreign key/i.test(raw)) return "Há dependências que impedem essa ação.";
  if (/not-null/i.test(raw)) return "Preencha todos os campos obrigatórios.";

  // 5) Último recurso: mostra algo genérico + (opcional) detalhes no console
  console.error("[Supabase error]", err);
  return "Não foi possível concluir a operação. Tente novamente.";
}
