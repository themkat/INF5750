#!/bin/env bash

# Project settings.
PACKAGE_NAME="quiz"

# Discover main project directory.
# See http://stackoverflow.com/a/246128
PROJECT_DIRECTORY="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Discover related project paths.
CURRENT_DIRECTORY=$(pwd)
PACKAGE_PATH="$CURRENT_DIRECTORY/$PACKAGE_NAME.zip"
SOURCE_DIRECTORY="$PROJECT_DIRECTORY/src/"

# Temporarily switch to the source directory.
cd "$SOURCE_DIRECTORY"

# Remove previously generated zip archive.
if [ -f "$PACKAGE_PATH" ];
then
	MESSAGE=$(printf "Removing package %s" "$PACKAGE_PATH")
	printf "[ .. ] $MESSAGE"
	rm -f "$PACKAGE_PATH"
	printf "\r[ ok ] $MESSAGE\n"
fi

# Build zip archive.
MESSAGE=$(printf "Building package %s" "$PACKAGE_PATH")
printf "[ .. ] $MESSAGE"
zip -r "$PACKAGE_PATH" ./* > /dev/null 2>&1
printf "\r[ ok ] $MESSAGE\n"

# Return to working directory.
cd "$CURRENT_DIRECTORY"