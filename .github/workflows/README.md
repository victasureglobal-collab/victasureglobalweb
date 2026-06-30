# Supabase Keep-Alive Workflow Setup Guide

This workflow is configured to automatically run every 3 days to perform a real database read on your Supabase project. This prevents Supabase from pausing your free tier database due to inactivity.

---

## 1. How to Add GitHub Secrets

To make the workflow run successfully, you need to add your Supabase credentials as GitHub Secrets:

1. Go to your repository page on GitHub.
2. Click **Settings** (top navigation tab).
3. In the left sidebar, expand **Secrets and variables** and click **Actions**.
4. Click the **New repository secret** button.
5. Add the following secrets:
   - **`SUPABASE_PROJECT_URL`**: Your Supabase project URL (e.g. `https://your-project-id.supabase.co`). Do *not* include a trailing slash.
   - **`SUPABASE_ANON_KEY`**: Your Supabase Project API `anon` `public` key.
6. Click **Add secret** to save them.

---

## 2. How to Test the Workflow Manually

You can manually trigger the workflow at any time to verify it's working:

1. Go to the **Actions** tab on your GitHub repository.
2. Select **Supabase Keep-Alive** from the list of workflows in the left sidebar.
3. Click the **Run workflow** dropdown button on the right side.
4. Select the branch (e.g., `main`) and click the green **Run workflow** button.
5. Watch the job run. The logs will display the HTTP status code returned by the database request.

---

## 3. How to Change the Schedule

The schedule is controlled by the `cron` expression in the `.github/workflows/supabase-keepalive.yml` file:

```yaml
  schedule:
    - cron: '0 0 */3 * *' # Currently runs every 3 days at midnight
```

If you wish to change the frequency:
- **Every day**: Change to `0 0 * * *`
- **Every 5 days**: Change to `0 0 */5 * *`
- **Every week**: Change to `0 0 * * 0` (runs every Sunday)
