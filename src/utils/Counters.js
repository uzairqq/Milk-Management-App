export function MilkCounter(milks) {
  try {
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

export function GrandTotalMilkCounter(morningMilk, afternoonMilk) {
  try {
    var mund = 0;
    var kg = 0;

    debugger;
    var splitWholeValueMorningMilk = morningMilk.split(/([0-9]+)/);
    var splitWholeValueAfternoonMilk = afternoonMilk.split(/([0-9]+)/);

    if (morningMilk.includes(".")) {
      mund += parseInt(splitWholeValueMorningMilk[1]);
      kg += parseInt(splitWholeValueMorningMilk[3]);
    } else if (!morningMilk.includes(".")) {
      mund = splitWholeValueMorningMilk[1];
    }

    if (afternoonMilk.includes(".")) {
      mund += parseInt(splitWholeValueAfternoonMilk[1]);
      kg += parseInt(splitWholeValueAfternoonMilk[3]);
    } else if (!morningMilk.includes(".")) {
      mund = splitWholeValueAfternoonMilk[1];
    }
    if (kg > 40) {
      var kgCalc = kg % 40;
      var mundCalc = kg / 40;
      if (!Number.isInteger(mundCalc)) {
        var d = Math.floor(mundCalc);
        mund += d;
        kg = kgCalc;
      }
    }
    return mund + "." + kg;
  } catch (err) {
    console.log(err);
  }
}
