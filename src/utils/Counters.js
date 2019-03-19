export function MilkCounter(milks) {
  try {
    debugger;
    var mundTotal = 0;
    var kgTotal = 0;
    var a = milks.reduce(function(total, milk) {
      if (milk.includes("Mund")) {
        if (milk.includes(".")) {
          var splitWholeValue = milk.split(/([0-9.]+)/);
          var splitKgMund = splitWholeValue[1].split(/([0-9]+)/);
          var mund = splitKgMund[1];
          var kg = splitKgMund[3];
          mundTotal = parseInt(mund) + mundTotal;
          kgTotal = parseInt(kg) + kgTotal;
          //
        } else if (!milk.includes(".")) {
          var splitWholeValueWOPoint = milk.split(/([0-9]+)/);
          var mundWithoutPoint = splitWholeValueWOPoint[1];
          mundTotal = parseInt(mundWithoutPoint) + mundTotal;
        }
      } else if (milk.includes("Kg")) {
        var splitWithKg = milk.split(/([0-9.]+)/);
        var kgWithOnly = splitWithKg[1];
        kgTotal = parseInt(kgWithOnly) + kgTotal;
      }
    }, 0);
    debugger;
    if (kgTotal > 40) {
      var kgCalc = kgTotal % 40;
      var mundCalc = kgTotal / 40;
      if (!Number.isInteger(mundCalc)) {
        var d = Math.floor(mundCalc);
        mundTotal += d;
        kgTotal = kgCalc;
      }
    }
    return mundTotal + "." + kgTotal;
  } catch (err) {
    console.log(err);
  }
}
