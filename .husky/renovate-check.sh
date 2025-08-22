#!/bin/sh

if git diff --cached --name-only | grep -q "renovate.json"; then
	# If validation fails, tell Git to stop and provide error message. Otherwise, continue.
	if ! eMSG=$(npx --yes --package renovate -- renovate-config-validator); then
		echo "renovate.json Failed Validation."
		echo "$eMSG"
		exit 1
	fi
fi
