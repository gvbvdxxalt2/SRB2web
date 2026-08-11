@echo off
call load-emsdk.bat

if not exist "build-wasm" mkdir build-wasm
cd build-wasm

emcmake cmake .. -DCMAKE_BUILD_TYPE=Release ^
    -DUSE_GME=0 -DUSE_OPENMPT=0 -DUSE_UPNP=0 -DUSE_SDL2_NET=0 -DUSE_PHYSFS=0 -DUSE_ZLIB=1 -DUSE_LIBPNG=1 -DUSE_CURL=0 ^
    -DCMAKE_C_FLAGS="-s USE_SDL=2 -s USE_SDL_IMAGE=2 -s USE_SDL_MIXER=2 -s USE_SDL_TTF=2 -s USE_ZLIB=1 -s USE_LIBPNG=1 -s ASYNCIFY=1" ^
    -DCMAKE_EXE_LINKER_FLAGS="-s USE_SDL=2 -s USE_SDL_IMAGE=2 -s USE_SDL_MIXER=2 -s USE_SDL_TTF=2 -s USE_ZLIB=1 -s USE_LIBPNG=1 -s ASYNCIFY=1 -s ALLOW_MEMORY_GROWTH=1 -s EXPORTED_RUNTIME_METHODS=['ccall','cwrap','UTF8ToString','stringToUTF8','lengthBytesUTF8','allocate','intArrayFromString', 'FS', 'NODEFS','stackAlloc','callMain'] -s ENVIRONMENT=web,node" ^
    -DZLIB_FOUND=TRUE -DZLIB_INCLUDE_DIR=../emsdk/upstream/emscripten/cache/sysroot/include -DZLIB_LIBRARY=zlib ^
    -DPNG_FOUND=TRUE -DPNG_PNG_INCLUDE_DIR=../emsdk/upstream/emscripten/cache/sysroot/include -DPNG_LIBRARY=png ^
    -DCURL_FOUND=TRUE -DCURL_INCLUDE_DIR=../libs/curl/include -DCURL_LIBRARY=curl ^
    -DSDL2_FOUND=TRUE -DSDL2_LIBRARIES=SDL2 -DSDL2_DIR=../emsdk/upstream/emscripten/cache/sysroot/lib/cmake/SDL2 ^
    -DSDL2_CONFIG_INCLUDE_DIR=../emsdk/upstream/emscripten/cache/sysroot/include ^
    -DCMAKE_TOOLCHAIN_FILE=../emsdk/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake

emmake make -j%NUMBER_OF_PROCESSORS%
cd ..
