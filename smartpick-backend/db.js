// db.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://asuzivmytohoclpzeksp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzdXppdm15dG9ob2NscHpla3NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MjEwNTMsImV4cCI6MjA3ODA5NzA1M30.blM8nIHqEjppkT-l4a_6lPzNfl9_DlfUVE4VdZR-nV8';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;