function mergeTokensWithCacheTokens(tokensFromCache, allTokens) {
    tokensFromCache = [{ symbol: 'SUI' }, {symbol: 'USD' }]
    allTokens = [{ symbol: 'USDT' }, { symbol: 'ETH' }, { symbol: 'SUI' }, { symbol: 'DEGEN' }, { symbol: 'USD' }]
    
    let mergedArray = tokensFromCache.concat(allTokens);
    
    mergedArray = mergedArray.filter((value, index, self) =>
      index === self.findIndex((t) => t.symbol === value.symbol)
  );
    console.log(mergedArray)
}
    
mergeTokensWithCacheTokens()