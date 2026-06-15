import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qolztghskzqxqapgztto.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbHp0Z2hza3pxeHFhcGd6dHRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MjE2NDUsImV4cCI6MjA5NzA5NzY0NX0.Qs_XzW3NPen5OKaEeubcs_XBSyMj0O5sT0DolTbe_bs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
