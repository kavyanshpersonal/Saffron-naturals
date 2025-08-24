console.log("Saffron Naturals ERP Loaded!");
// You can add more JS here later for real features.
<!-- Supabase SDK -->
<script src="https://unpkg.com/@supabase/supabase-js@2"></script>
<script>
  // TODO: replace with your real project values
  const SUPABASE_URL = "https://nylqihwnftbmkxuysgko.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55bHFpaHduZnRibWt4dXlzZ2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NzY4MjAsImV4cCI6MjA3MTQ1MjgyMH0.s6YLFNTUJowCdQnxMwdwpvoC-4PNx80DnVG2Tw0Yk_c";
  window.sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
</script>
