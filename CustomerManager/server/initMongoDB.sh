#! /bin/bash

scriptDir=$(dirname $0)

mongo ${scriptDir}/initMongoData.js

echo -
echo Your data is loaded
read -p "Press [Enter] to exit..."