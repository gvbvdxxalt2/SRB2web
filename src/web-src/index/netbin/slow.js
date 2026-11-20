class NetBin {
  //Large binary end byte.
  static BINARY_END_BYTE = 4;

  //String start byte.
  static STRING_BYTE = 5;
  //String chunk byte.
  static STRING_BYTE_CONCAT = 6;

  //Boolean true byte.
  static BOOL_TRUE_BYTE = 7;
  //Boolean false byte.
  static BOOL_FALSE_BYTE = 8;

  //Small number byte.
  static SMALL_NUM_BYTE = 9;
  //Large/decimal number byte.
  static NUM_BYTE = 10;
  //Infinity byte.
  static INFINITE_BYTE = 11;
  //NaN byte.
  static NAN_BYTE = 12;

  //Number bytes
  static NUMBER_BYTES = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    e: 10,
    ".": 11,
    end: 255,
  };

  //Used to split strings.
  static _chunkStringLoop(str, n) {
    const result = [];
    for (let i = 0; i < str.length; i += n) {
      result.push(str.slice(i, i + n));
    }
    return result;
  }

  //Used to encode websocket packets for sending.
  static encode(items, attachBin) {
    var {
      _chunkStringLoop,
      STRING_BYTE,
      STRING_BYTE_CONCAT,
      BOOL_TRUE_BYTE,
      BOOL_FALSE_BYTE,
      SMALL_NUM_BYTE,
      NUM_BYTE,
      INFINITE_BYTE,
      NAN_BYTE,
      NUMBER_BYTES,
      BINARY_END_BYTE,
    } = NetBin;
    var outputBytes = [];
    for (var item of items) {
      //Strings
      if (typeof item == "string") {
        var i = 0;
        var split = _chunkStringLoop(item, 255);
        while (i < split.length) {
          var chunk = split[i];
          if (i == 0) {
            outputBytes.push(STRING_BYTE);
          } else {
            outputBytes.push(STRING_BYTE_CONCAT);
          }
          outputBytes.push(chunk.length);
          outputBytes = outputBytes.concat(
            chunk.split("").map((s) => s.charCodeAt()),
          );
          i += 1;
        }
      } else if (typeof item == "boolean" && item == true) {
        outputBytes.push(BOOL_TRUE_BYTE);
      } else if (typeof item == "boolean" && item == false) {
        outputBytes.push(BOOL_FALSE_BYTE);
      } else if (typeof item == "number") {
        //Number handling.
        if (isNaN(item)) {
          outputBytes.push(NAN_BYTE);
        } else if (item == Infinity) {
          outputBytes.push(INFINITE_BYTE);
        } else if (item < 256 && item == Math.round(item)) {
          outputBytes.push(SMALL_NUM_BYTE);
          outputBytes.push(item);
        } else {
          outputBytes.push(NUM_BYTE);
          var i = 0;
          var str = "" + item;
          while (i < str.length) {
            outputBytes.push(NUMBER_BYTES[str[i]]);
            i += 1;
          }
          outputBytes.push(NUMBER_BYTES.end);
        }
      } else {
        throw new Error("Invalid encoding type " + typeof item);
      }
    }

    if (attachBin) {
      outputBytes.push(BINARY_END_BYTE);
      outputBytes = outputBytes.concat(Array.from(attachBin));
    }

    return Uint8Array.from(outputBytes);
  }
  //Used to decode websocket packets for recieving.
  static decode(data) {
    var {
      STRING_BYTE,
      STRING_BYTE_CONCAT,
      BOOL_TRUE_BYTE,
      BOOL_FALSE_BYTE,
      SMALL_NUM_BYTE,
      NUM_BYTE,
      INFINITE_BYTE,
      NAN_BYTE,
      NUMBER_BYTES,
      BINARY_END_BYTE,
    } = NetBin;
    var array = Array.from(data);
    var outputArray = [];
    var outputBinary = [];
    var i = 0;
    while (i < array.length) {
      if (array[i] == STRING_BYTE || array[i] == STRING_BYTE_CONCAT) {
        var isConcat = array[i] == STRING_BYTE_CONCAT;
        i += 1;
        var len = array[i];
        i += 1;
        var i2 = 0;
        var str = "";
        while (i2 < len) {
          if (i > array.length) {
            throw new Error(
              "String section length doesn't match up with binary data. Is it corrupt?",
            );
          }
          str += String.fromCharCode(array[i]);
          i += 1;
          i2 += 1;
        }
        i -= 1;
        if (isConcat && outputArray.length > 0) {
          var last = outputArray[outputArray.length - 1];
          if (typeof last == "string") {
            outputArray[outputArray.length - 1] += str;
          }
        } else {
          outputArray.push(str);
        }
      } else if (array[i] == BOOL_TRUE_BYTE) {
        outputArray.push(true);
      } else if (array[i] == BOOL_FALSE_BYTE) {
        outputArray.push(false);
      } else if (array[i] == SMALL_NUM_BYTE) {
        i += 1;
        outputArray.push(array[i]);
      } else if (array[i] == INFINITE_BYTE) {
        outputArray.push(Infinity);
      } else if (array[i] == NAN_BYTE) {
        outputArray.push(NaN);
      } else if (array[i] == NUM_BYTE) {
        var numberStr = "";
        i += 1;
        while (array[i] !== NUMBER_BYTES.end) {
          if (i > array.length) {
            throw new Error(
              "Number section length doesn't match up with binary data. Is it corrupt?",
            );
            return;
          }
          for (var num of Object.keys(NUMBER_BYTES)) {
            if (NUMBER_BYTES[num] == array[i]) {
              numberStr += "" + num;
            }
          }
          i += 1;
        }
        outputArray.push(+numberStr);
      } else if (array[i] == BINARY_END_BYTE) {
        i += 1;
        outputBinary = array.slice(i, array.length);
        break;
      }
      i += 1;
    }

    return {
      bin: Uint8Array.from(outputBinary),
      items: outputArray,
    };
  }
}

module.exports = NetBin;
