mkdri src/jsx/locales
Set-Location src/jsx/locales
New-Item -Path ./da.json -ItemType SymbolicLink -Value ../../locales/da.json
New-Item -Path ./de.json -ItemType SymbolicLink -Value ../../locales/de.json
New-Item -Path ./en.json -ItemType SymbolicLink -Value ../../locales/en.json
New-Item -Path ./es.json -ItemType SymbolicLink -Value ../../locales/es.json
New-Item -Path ./fr.json -ItemType SymbolicLink -Value ../../locales/fr.json

Set-Location ../../..