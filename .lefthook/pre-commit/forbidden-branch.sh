#!/bin/bash

branch="$(git rev-parse --abbrev-ref HEAD)"
if [ "$branch" = "production" ]; then
    echo "You can't commit directly to production branch"
    exit 1
fi
