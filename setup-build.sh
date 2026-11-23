#!/bin/bash
set -e

# 1. Setup vcpkg folder
if [ -d "libs/vcpkg/.git" ]; then
    echo "vcpkg folder exists."
else
    git clone https://github.com/microsoft/vcpkg libs/vcpkg
fi

# 2. Setup EMSDK
chmod +x ./load-emsdk.sh
source ./load-emsdk.sh

# 3. Run the specialized vcpkg setup
chmod +x ./vcpkg-setup.sh
./vcpkg-setup.sh

chmod +x ./gl4es-setup.sh
./gl4es-setup.sh

# 4. Build the game
chmod +x ./build-wasm.sh
./build-wasm.sh
