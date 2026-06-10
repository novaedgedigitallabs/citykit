# How to Deploy to Vercel

Since the project and documentation (`index.html` and `docs.html`) are built using plain HTML, CSS, and JavaScript without a specific build framework, deploying to Vercel is extremely fast and simple.

Follow these steps to deploy your repository:

### 1. Push to GitHub
Ensure all your latest changes (including `index.html` and `docs.html`) are pushed to your GitHub repository (`novaedgedigitallabs/citykit`).

### 2. Import Project in Vercel
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click on **Add New...** and select **Project**.
3. Locate the `novaedgedigitallabs/citykit` repository from the list of your GitHub repositories and click **Import**.

### 3. Configure Deployment Settings
On the "Configure Project" screen, apply the following settings:
- **Project Name:** `citykit` (or any name you prefer).
- **Framework Preset:** Select **Other** (since this is a static HTML site without a framework).
- **Root Directory:** Keep it as `./` (default).

Under **Build and Output Settings**, Vercel will detect your `package.json` and try to run `npm run build` by default. Since `npm run build` is for building the npm library (not the website), you **must override this behavior**. Please configure exactly as follows:

- **Build Command:** Toggle **Override ON**, and type `echo "No build needed"` (or leave the text box completely empty).
- **Output Directory:** Toggle **Override ON**, and type `.` (a single period, meaning the root directory).

### 4. Deploy
Click the **Deploy** button. Vercel will instantly upload your static files and assign you a live URL (e.g., `citykit.vercel.app`).

### Post-Deployment
Once deployed, Vercel will automatically serve `index.html` at the root URL `/`, and your documentation will be accessible at `/docs.html`. Any future pushes to the `main` branch on GitHub will automatically trigger a new deployment.
