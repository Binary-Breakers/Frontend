# Readme
Frontend for Binary Breakers Application

# Usage
1. Git clone repo: https://github.com/Binary-Breakers/Frontend
2. Run command: cd binarybreakersfrontend
3. Open de Dev Branch
4. Run command: npm run dev
5. Navigate to http://localhost:3000 or https://binary-breakers-frontend.vercel.app/
6. Register an Account in our app
7. Verify by clicking the verification link in your mailbox
8. Sign in into the website

# Setup
Part 1 (Browser)
1. Create a github repo inside your orginasation: https://github.com/
2. Add teammembers to the newly created github repo: https://github.com/repo --> settings --> Collaborators and teams --> Invite
3. Register an account and create an orginasation in Supabase: https://supabase.com/
4. Add teammembers to Supabase orginasation: https://supabase.com/dashboard --> BinaryBreakers (orginasation) --> Settings --> Teams --> Invite
5. Create a project inside Supabase Dashboard and create a database with password: https://supabase.com/dashboard
Part 2 (IDE)
6. Git clone and open repo in IDE: https://github.com/Binary-Breakers/Frontend
7. Run command: npx create-next-app -e with-supabase (Set a name for the app when prompted)
8. Run command: cd binarybreakersfrontend
9. Open de Dev Branch
10. Rename or duplicate .env.example to .env.local in the root directory
11. Retrieve API keys from https://supabase.com/dashboard/repo --> Project Settings --> API:
    - Project URL
    - API Key (anon)
12. Update the .env file with API keys:
    NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
    NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
13. Run command: npm run dev
14. Navigate to http://localhost:3000