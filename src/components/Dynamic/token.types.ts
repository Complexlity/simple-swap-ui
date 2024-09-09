export interface List {
    name:      string;
    timestamp: Date;
    version:   Version;
    tags:      Tags;
    logoURI:   string;
    keywords:  string[];
    tokens:    Token[];
}

export interface Tags {
}

export interface Token {
    chainId:     number;
    address:     string;
    decimals:    number;
    name:        string;
    symbol:      string;
    logoURI:     string;
    tags?:       string[];
    extensions?: Extensions;
    priceUsd:    number;
}

export interface Extensions {
    coingeckoId: string;
}

export interface Version {
    major: number;
    minor: number;
    patch: number;
}
