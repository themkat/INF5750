#!/bin/env bash

PACKAGE="quiz.zip"
printf "[ .. ] Cleaning environment"
rm -f "$PACKAGE"
printf "\r%s\n" "[ ok ]"
printf "[ .. ] Building application package %s" "$PACKAGE"
zip -r "$PACKAGE" ./src/* > /dev/null 2>&1
printf "\r%s\n" "[ ok ]"
