#!/bin/sh

# If validation fails, tell Git to stop and provide error message. Otherwise, continue.
if ! eMSG=$(renovate-config-validator); then
	echo "renovate.json Failed Validation."
	echo "$eMSG"
	exit 1
fi