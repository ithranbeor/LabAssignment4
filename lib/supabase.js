import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vmaalvritikdvlyntzal.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtYWFsdnJpdGlrZHZseW50emFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4OTQ4NTAsImV4cCI6MjA0OTQ3MDg1MH0.YgcVk8H7x88i2Qs4JU9xQaJnqWD8IB4V7mJdfRZnc1c';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});
