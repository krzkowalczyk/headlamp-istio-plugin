#!/usr/bin/env bash
set -euo pipefail

VERSION="${1:?Usage: ./release.sh <version> (e.g. 0.2.0)}"
TAG="v${VERSION}"
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)

echo "==> Checking working tree..."
if [ -n "$(git status --porcelain)" ]; then
  echo "Error: working tree is not clean. Commit or stash changes first."
  exit 1
fi

echo "==> Updating version to ${VERSION}..."
npm version "${VERSION}" --no-git-tag-version

sed -i '' "s|^version:.*|version: ${VERSION}|" artifacthub-pkg.yml

echo "==> Building and packaging..."
npm run build
npm run package

ARCHIVE=$(ls *.tar.gz)
CHECKSUM=$(shasum -a 256 "${ARCHIVE}" | awk '{print $1}')
URL="https://github.com/${REPO}/releases/download/${TAG}/${ARCHIVE}"

echo "==> Updating artifacthub-pkg.yml..."
sed -i '' "s|headlamp/plugin/archive-url:.*|headlamp/plugin/archive-url: \"${URL}\"|" artifacthub-pkg.yml
sed -i '' "s|headlamp/plugin/archive-checksum:.*|headlamp/plugin/archive-checksum: \"SHA256:${CHECKSUM}\"|" artifacthub-pkg.yml

echo "==> Committing and tagging..."
git add package.json artifacthub-pkg.yml
git commit -m "release: ${TAG}"
git tag "${TAG}"

echo "==> Pushing..."
git push origin main "${TAG}"

echo "==> Creating GitHub release..."
gh release create "${TAG}" "${ARCHIVE}" \
  --title "${TAG}" \
  --generate-notes

rm -f "${ARCHIVE}"

echo "==> Done! Released ${TAG}"
echo "    https://github.com/${REPO}/releases/tag/${TAG}"
