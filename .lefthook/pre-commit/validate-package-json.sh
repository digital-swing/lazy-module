#!/bin/bash

stagedPackageJson=$(git diff --diff-filter=d --cached --name-only | grep "package\.\(json\|lock\)" || true)
if [ -n "$stagedPackageJson" ]; then # at least one file is staged
    for packageJson in $stagedPackageJson; do
        pnpm --prefix "$(dirname "$packageJson")" ls
    done
fi
