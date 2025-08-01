#!/bin/bash

# Variables
REPO_NAME="saas-bank"
ORG_NAME="Honeypotz-Inc"
REPO_FULL_NAME="$ORG_NAME/$REPO_NAME"
ZIP_FILE="saas_bank_complete_bundle.zip"
WORKING_DIR="saas_bank_complete_bundle"

# Exit on error
set -e

# Step 1: Unzip the deployment bundle
unzip -o "$ZIP_FILE" -d "$WORKING_DIR"

# Step 2: Create the GitHub repository using GitHub CLI
gh repo create "$REPO_FULL_NAME" --public --description "Deployment, monitoring, and sandbox automation for SAAS BANK" --confirm

# Step 3: Initialize git and push to main branch
cd "$WORKING_DIR"
git init
git checkout -b main
git add .
git commit -m "Initial commit with deployment and monitoring setup"
git branch -M main
git remote add origin "https://github.com/$REPO_FULL_NAME.git"
git push -u origin main

# Step 4: Create sandbox branch and push
git checkout -b sandbox
git push -u origin sandbox

# Step 5: Configure branch protection for main
gh api repos/"$REPO_FULL_NAME"/branches/main/protection --method PUT --input - --header "Accept: application/vnd.github+json" <<EOF
{
  "required_status_checks": null,
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1
  },
  "restrictions": null
}
EOF

# Step 6: Create GitHub environments
gh api repos/"$REPO_FULL_NAME"/environments/production --method PUT
gh api repos/"$REPO_FULL_NAME"/environments/sandbox --method PUT

echo "✅ GitHub repository setup complete."
