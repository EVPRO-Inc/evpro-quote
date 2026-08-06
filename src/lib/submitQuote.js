import { SUPABASE_FUNCTIONS_URL, SUPABASE_ANON_KEY } from './supabase.js'

const FN_URL = `${SUPABASE_FUNCTIONS_URL}/submit-quote`

// POST the quote to the stateless submit-quote edge function (emails sales; no
// DB write). The anon key only satisfies the Supabase gateway — the form is
// public. Mirrors the Volta inspection form's callPublic().
export async function submitQuote(payload) {
  let res
  try {
    res = await fetch(FN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify(payload),
    })
  } catch {
    // Network/CORS failure — never surface the raw "Failed to fetch".
    throw new Error("Couldn't reach our server. Check your connection and try again.")
  }
  const json = await res.json().catch(() => ({}))
  if (!res.ok || json.error) {
    throw new Error(json.error || "Something went wrong. Please try again.")
  }
  return json
}
