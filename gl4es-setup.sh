#!/bin/bash
set -e
source ./load-emsdk.sh

ROOT_DIR=$(pwd)

rm -rf "$ROOT_DIR/libs/gl4es"
mkdir -p "$ROOT_DIR/libs"

cd "$ROOT_DIR/libs"
git clone https://github.com/ptitSeb/gl4es.git
cd gl4es
mkdir -p build && cd build

emcmake cmake .. \
  -DCMAKE_BUILD_TYPE=RelWithDebInfo \
  -DNOX11=ON \
  -DNOEGL=ON \
  -DSTATICLIB=ON \
  -DDEFAULT_ES=2 \
  -DBROWSER=ON \
  -DCMAKE_C_FLAGS="-DBROWSER=1 -msimd128 -mbulk-memory"

emmake make -j$(nproc)

# Ensure libGL.a is in libs/gl4es/lib/ where SRB2 links it
mkdir -p "$ROOT_DIR/libs/gl4es/lib"
find . -name "libGL.a" -exec cp {} "$ROOT_DIR/libs/gl4es/lib/libGL.a" \;

cd "$ROOT_DIR"