#!/bin/bash
cd "$(dirname "$0")"

git pull origin release
npm install
npm run build
