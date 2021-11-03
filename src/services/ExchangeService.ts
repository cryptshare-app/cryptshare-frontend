export default class ExchangeService {
  static eurToIota(
    latestPrice,
    exchangeRateEurUsd,
    priceInEuro: string
  ) {
    if (latestPrice > 0 && exchangeRateEurUsd > 0) {
      priceInEuro = priceInEuro.replace(",", ".");
      let priceInDollar = parseFloat(priceInEuro) * exchangeRateEurUsd;
      let OneDollarInIota = 1000000 / latestPrice;
      let amountIota = priceInDollar * OneDollarInIota;
      return amountIota.toFixed(0);
    } else {
      return '';
    }
  }

  static iotaToEur(latestPrice, exchangeRateEurUsd, amountIota: number) {
    if (latestPrice > 0 && exchangeRateEurUsd > 0) {

      let currentPriceMIOTA = latestPrice / exchangeRateEurUsd;
      let amountMIOTA = amountIota / 1000000;
      return (amountMIOTA*currentPriceMIOTA).toFixed(8);

      // let amountMIOTA = amountIota / 1000000;
      // let amountInDollar = amountMIOTA * latestPrice;
      // let amountInEuro = amountInDollar * exchangeRateEurUsd;
      // return amountInEuro.toFixed(8);
    } else {
      return -1;
    }
  }

  static iotaToString(amountIota: number): string {
    if (amountIota < 1000) {
      return amountIota + " i";
    } else if (amountIota < 1000000) {
      return (amountIota / 1000).toFixed(1) + " Ki";
    } else if (amountIota < 1000000000) {
      return (amountIota / 1000000).toFixed(1) + " Mi";
    } else if (amountIota < 1000000000000) {
      return (amountIota / 1000000000).toFixed(1) + " Gi";
    } else if (amountIota < 1000000000000000) {
      return (amountIota / 1000000000000).toFixed(1) + " Pi";
    }
    return "";
  }
}
