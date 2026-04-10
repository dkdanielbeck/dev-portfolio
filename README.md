# IBM FutureNow Center - Developer Tool Arsenal

Welcome to the internal source code for the Developer Tool Arsenal! This platform is built using Vite, React, TypeScript, and utilizes a Supabase PostgreSQL database to synchronize tools seamlessly across your entire department.

## 🚀 Getting Started

Since this platform now interacts with a real database rather than local browser storage, you need to configure a Supabase project and provide the deployment workflow with your private keys so the dynamic UI can retrieve the database records.

### 1. Provision Your Supabase Backend

1. Head over to [Supabase](https://supabase.com/) and create a strictly free-tier project. Wait a couple of minutes for the database to finish provisioning.
2. In the Supabase Dashboard, navigate to the **SQL Editor** positioned on the left-hand navigation menu.
3. Completely copy and paste the following comprehensive SQL configuration script into a new query and click **RUN**:

\`\`\`sql
-- Create the main tools data schema
CREATE TABLE tools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  image_url TEXT,
  added_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security (RLS) for the tools structure
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

-- Establish permissive internal department policies (anonymous full CRUD access)
CREATE POLICY "Enable read access for all users" ON tools FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON tools FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON tools FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON tools FOR DELETE USING (true);
\`\`\`

### 2. Configure Local Development

You will need the Supabase connection keys.
1. Within your Supabase Dashboard, slide over to **Project Settings** → **API**.
2. Locate the **Project URL** and the **anon `public` key**.
3. Over in your local project root (`dev-portfolio`), duplicate `.env.example` into a brand new `.env.local` operating file and inject your keys:

\`\`\`env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_public_key_here
\`\`\`

*(Note: Never commit `.env.local` to public repositories. Vite automatically safely embeds them strictly at compile-time).*

Run the local environment:
\`\`\`bash
npm run dev
\`\`\`

### 3. Deploy via GitHub Actions

This repository harnesses GitHub Actions to compile and rapidly deploy the static website onto GitHub pages. However, the GitHub builder needs to know your Supabase credentials!

1. In your GitHub repository, navigate directly to **Settings** → **Secrets and variables** → **Actions**.
2. Create **New repository secret**:
   - Name: `VITE_SUPABASE_URL`
   - Secret: *Enter your Supabase Project URL*
3. Create a second **New repository secret**:
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Secret: *Enter your Supabase anon key*
4. Ensure GitHub Pages is completely enabled (Settings → Pages - Build and Deployment Source set to "GitHub Actions").

The next time you push to the `main` branch, the `.github/workflows/deploy.yml` pipeline will automatically fire, intercept your secrets securely, bake them into the compiled JavaScript, and expose everything perfectly!
