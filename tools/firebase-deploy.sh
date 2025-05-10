#!/usr/bin/env sh

set -e

# Check args
if [ -z "$1" ]; then
  echo "Usage: $0 <project-name>"
  exit 1
fi

PROJECT_NAME="$1"

BRANCH="$GITHUB_REF_NAME"
if [ -z "$BRANCH" ]; then
  BRANCH=$(git rev-parse --abbrev-ref HEAD)
fi

CHANNEL=$(echo "$BRANCH" | tr '/' '-')

if [ "$BRANCH" = "main" ]; then
  echo "🚀 Deploying to production channel..."
  firebase deploy --only "$PROJECT_NAME"
else
  echo "🚀 Deploying to preview channel: $CHANNEL..."
  firebase hosting:channel:deploy "$CHANNEL" --expires 7d --only "$PROJECT_NAME"
fi