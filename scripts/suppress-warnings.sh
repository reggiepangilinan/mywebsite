#!/bin/bash

# Suppress Node.js deprecation warnings from third-party dependencies
# This specifically addresses the url.parse() deprecation warning from Contentful SDK
export NODE_OPTIONS="--no-deprecation"

# Run the command passed as arguments
exec "$@"
