#!/bin/bash

head -n1 "$1" | npx commitlint --color
