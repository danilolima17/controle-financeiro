function required(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(
      `Variável de ambiente ${name} não configurada. Copie .env.local.example para .env.local e preencha com as credenciais do seu projeto Supabase.`
    );
  }
  return value;
}

export function supabaseUrl() {
  return required(
    "NEXT_PUBLIC_SUPABASE_URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL
  );
}

export function supabaseAnonKey() {
  return required(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}
