#!/bin/bash
cd "$(dirname "$0")"

git checkout package-lock.json
git pull origin release
npm install
npm run build
