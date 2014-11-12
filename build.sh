#!/bin/env bash

CURDIR=$(pwd)
SRCDIR="./src/"
PACKAGE="$CURDIR/quiz.zip"

cd "$SRCDIR"

printf "[ .. ] Cleaning environment"
rm -f "$PACKAGE"
printf "\r%s\n" "[ ok ]"
printf "[ .. ] Building application package %s" "$PACKAGE"
zip -r "$PACKAGE" ./* > /dev/null 2>&1
printf "\r%s\n" "[ ok ]"

cd "$CURDIR"
