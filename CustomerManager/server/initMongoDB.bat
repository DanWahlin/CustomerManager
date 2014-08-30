@ECHO off
c:\mongodb\bin\mongo.exe %CD%\initMongoData.js

ECHO -
ECHO Your data is loaded
pause