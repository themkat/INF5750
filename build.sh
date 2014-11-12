#!/bin/env bash

PROJECT_DIRECTORY="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CURRENT_DIRECTORY=$(pwd)
SOURCE_DIRECTORY="$PROJECT_DIRECTORY/src/"
PACKAGE_PATH="$CURRENT_DIRECTORY/quiz.zip"

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

cd "$CURRENT_DIRECTORY"
