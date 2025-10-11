#!/bin/sh

for file in $(git diff --cached --name-only | grep -E '\.circleci\/(config|continue-config)\.yml$'); do
	# If validation fails, tell Git to stop and provide error message. Otherwise, continue.

	if ! eMSG=$(circleci config validate --org-slug github/digital-swing .circleci/config.yml --token "$CIRCLE_TOKEN"); then
		echo "CircleCI Configuration Failed Validation for $file."
		echo "$eMSG"
		exit 1
	fi
done
