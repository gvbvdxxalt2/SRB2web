const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

class NetBin {
  /**
   * Encodes a list of items and an optional binary attachment into a single packet.
   * @param {Array|Object} items - The metadata/game events.
   * @param {Uint8Array} [attachBin] - (Optional) Binary data to append.
   */
  static encode(items, attachBin) {
    // 1. Serialize items
    const jsonStr = JSON.stringify(items);
    const jsonBytes = textEncoder.encode(jsonStr);

    const jsonLen = jsonBytes.length;
    const binLen = attachBin ? attachBin.byteLength : 0;

    // 2. Allocate Buffer
    const totalSize = 4 + jsonLen + binLen;
    const buffer = new Uint8Array(totalSize);

    // 3. Write Header (UInt32 Little Endian)
    // We use a DataView to ensure correct Endianness implementation
    const view = new DataView(buffer.buffer);
    view.setUint32(0, jsonLen, true); // true = Little Endian

    // 4. Write JSON
    buffer.set(jsonBytes, 4);

    // 5. Write Binary
    if (attachBin) {
      buffer.set(attachBin, 4 + jsonLen);
    }

    return buffer;
  }

  static decode(data) {
    // FIX 1: Handle if data is not a Uint8Array yet
    if (!(data instanceof Uint8Array)) {
      if (data instanceof ArrayBuffer) {
        data = new Uint8Array(data);
      } else {
        // If this throws, you forgot to set binaryType = 'arraybuffer'
        throw new Error(
          `NetBin decode received invalid type: ${data.constructor.name}. Expected Uint8Array or ArrayBuffer.`,
        );
      }
    }

    // FIX 2: Use DataView to safely read the Unsigned Integer length
    const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    const jsonLen = view.getUint32(0, true); // true = Little Endian

    // Safety Check: If jsonLen is larger than the packet, the data is corrupt
    if (jsonLen > data.byteLength - 4) {
      /*console.error("Packet Correction Detected!", {
        jsonLen,
        totalLen: data.byteLength,
      });*/
      return { items: {}, bin: new Uint8Array(0) };
    }

    // 3. Decode JSON
    const jsonBytes = data.subarray(4, 4 + jsonLen);
    const jsonStr = textDecoder.decode(jsonBytes);

    try {
      const items = JSON.parse(jsonStr);
      const bin = data.subarray(4 + jsonLen);
      return { items, bin };
    } catch (e) {
      //console.error("NetBin JSON Parse Error. Raw String:", jsonStr);
      throw e;
    }
  }
}

module.exports = NetBin;
