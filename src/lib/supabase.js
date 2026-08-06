import { createClient } from '@supabase/supabase-js'

// Points at the SAME Supabase project as the Volta app (evpro-fleet), so quote
// submissions land next to fleet data. These are public values — the anon key
// is intentionally shipped in the browser bundle. Public form writes never use
// this client directly; they POST to the `submit-quote` edge function, which
// runs the service role server-side (see supabase/functions/submit-quote).
const SUPABASE_URL  = 'https://alaxasyzbibizsbkoyme.supabase.co'
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsYXhhc3l6YmliaXpzYmtveW1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTAwNzksImV4cCI6MjA5MzIyNjA3OX0.ovd3ygTkWjoTl--hMmAxlocwy9u4q9Mo_Gn-D-hJdBc'

export const SUPABASE_FUNCTIONS_URL = `${SUPABASE_URL}/functions/v1`
export const SUPABASE_ANON_KEY      = SUPABASE_ANON

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)
