#!/bin/bash

set -e

# Create patch release
npm version minor -m "[skip ci] Upgrade to %s"

# Push new version to origin
git push

# Push new tag to origin
git push --tags

# Publish the new version to private NPM registry
npm publish
