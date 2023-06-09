#!/usr/bin/bash

green='\033[1;32m'
red='\e[31m'
clear='\033[0m'

TXID=$(curl --silent --request POST --data-binary @imagegallery.bas http://127.0.0.1:30000/install_sc | sed 's/{"txid":"//;s/"}//')

if [[ $TXID == "" ]]; then
    printf "${red}Could not install the smart contract. Did you start the DERO simulator?\n${clear}"
    exit 0
fi;

OUTPUTFILES=("src/scid.js")

CONTENT="const scid = '$TXID'; export default scid;"

for ((i = 0; i < ${#OUTPUTFILES[@]}; ++i)); do
    OUTPUTFILE="${OUTPUTFILES[$i]}"
    echo $CONTENT > $OUTPUTFILE
done

printf "${green}The smart contract was installed.${clear}\n"
printf "The TXID $TXID was saved to the following files:\n"
for ((i = 0; i < ${#OUTPUTFILES[@]}; ++i)); do
    echo "${OUTPUTFILES[$i]}"
done
