#!/bin/bash
source ./load-emsdk.sh

# Get absolute path for the project root
ROOT_DIR=$(pwd)

# Define toolchain and vcpkg paths
EM_TOOLCHAIN="$ROOT_DIR/emsdk/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake"
VCPKG_INC="$ROOT_DIR/vcpkg_installed/wasm32-emscripten/include"
VCPKG_LIB="$ROOT_DIR/vcpkg_installed/wasm32-emscripten/lib"

mkdir -p build-wasm
cd build-wasm

emcmake cmake .. -DCMAKE_BUILD_TYPE=Release \
    -DUSE_GME=1 -DUSE_OPENMPT=1 -DUSE_UPNP=0 -DUSE_SDL2_NET=1 -DUSE_PHYSFS=0 -DUSE_ZLIB=1 -DUSE_LIBPNG=1 -DUSE_CURL=0 \
    "-DCMAKE_C_FLAGS=-DEMSCRIPTEN -s USE_SDL=2 -s USE_SDL_IMAGE=2 -s USE_SDL_MIXER=2 -s USE_SDL_TTF=2 -s USE_ZLIB=1 -s USE_LIBPNG=1 -I$VCPKG_INC" \
    "-DCMAKE_CXX_FLAGS=-DEMSCRIPTEN -I$VCPKG_INC" \
    "-DCMAKE_EXE_LINKER_FLAGS=-DEMSCRIPTEN -s STACK_SIZE=5242880 -s INITIAL_MEMORY=268435456 -s ALLOW_TABLE_GROWTH=1 -s USE_SDL=2 -s USE_SDL_IMAGE=2 -s USE_SDL_MIXER=2 -s USE_SDL_TTF=2 -s USE_ZLIB=1 -s USE_LIBPNG=1 -s ALLOW_MEMORY_GROWTH=1 -s EXPORTED_RUNTIME_METHODS=['ccall','cwrap','UTF8ToString','stringToUTF8','lengthBytesUTF8','allocate','intArrayFromString','FS','NODEFS','stackAlloc','callMain'] -s ENVIRONMENT=web,node -L$VCPKG_LIB" \
    -DZLIB_FOUND=TRUE -DZLIB_INCLUDE_DIR="$ROOT_DIR/emsdk/upstream/emscripten/cache/sysroot/include" -DZLIB_LIBRARY=zlib \
    -DPNG_FOUND=TRUE -DPNG_PNG_INCLUDE_DIR="$ROOT_DIR/emsdk/upstream/emscripten/cache/sysroot/include" -DPNG_LIBRARY=png \
    -DSDL2_FOUND=TRUE -DSDL2_LIBRARIES=SDL2 -DSDL2_DIR="$ROOT_DIR/emsdk/upstream/emscripten/cache/sysroot/lib/cmake/SDL2" \
    -DSDL2_CONFIG_INCLUDE_DIR="$ROOT_DIR/emsdk/upstream/emscripten/cache/sysroot/include" \
    -DCMAKE_TOOLCHAIN_FILE="$EM_TOOLCHAIN" \
    -DCMAKE_CROSSCOMPILING_EMULATOR="$ROOT_DIR/emsdk/node/22.16.0_64bit/bin/node"

emmake make -j$(nproc)