let allData = {};
let base = {
    "routerContract": "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24",
    "quoterV2Address":"0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a",
    "token":{
        "WETH": "0x4200000000000000000000000000000000000006",
        "USDC": "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
        "wstETH": "0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452",
        "WBTC": "0x0555E30da8f98308EdB960aa94C0Db47230d2B9c",
        "weETH.base": "0x04c0599ae5a44757c0af6f9ec3b93da8976c150a",
        "USDS": "0x820c137fa70c8691f0e44dc420a5e53c168921dc",
        "USDe": "0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34",
        "DAI": "0x50c5725949a6f0c72e6c4a641f24049a917db0cb",
        "OM": "0x3992b27da26848c2b19cea6fd25ad5568b68ab98",
        "VIRTUAL": "0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b",
        "ENA": "0x58538e6A46E07434d7E7375Bc268D3cb839C0133",
        "cbBTC": "0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf",
        "rETH": "0xb6fe221fe9eef5aba221c348ba20a1bf5e73624c",
        "LBTC": "0xecac9c5f704e954931349da37f60e39f515c11c1",
        "PYTH": "0x4c5d8A75F3762c1561D96f177694f67378705E98",
        "CRV": "0x8Ee73c484A26e0A5df2Ee2a4960B789967dd0415",
        "ezETH": "0x2416092f143378750bb29b79ed961ab195cceea5",
        "AERO": "0x940181a94a35a4569e4529a3cdfb74e38fd98631",
        "PRIME": "0xfA980cEd6895AC314E7dE34Ef1bFAE90a5AdD21b",
        "W": "0xB0fFa8000886e57F86dd5264b9582b2Ad87b2b91",
        "MORPHO": "0xBAa5CC21fd487B8Fcc2F632f3F4E8D37262a0842",
        "PENDLE": "0xa99f6e6785da0f5d6fb42495fe424bce029eeb3e",
        "SNX": "0x22e6966b799c4d5b13be962e1d117b56327fda66",
        "cbETH": "0x2ae3f1ec7f1f5012cfeab0185bfc7aa3cf0dec22",
        "1INCH": "0xc5fecC3a29Fb57B5024eEc8a2239d4621e111CBE",
        "ZRO": "0x6985884C4392D348587B19cb9eAAf157F13271cd",
        "FAI": "0xb33ff54b9f7242ef1593d2c9bcd8f9df46c77935",
        "ETHFI": "0x6c240dda6b5c336df09a4d011139beaaa1ea2aa2",
        "superOETHb": "0xdbfefd2e8460a6ee4955a68582f85708baea60a3",
        "YFI": "0x9eaf8c1e34f05a589eda6bafdf391cf6ad3cb239",
        "PHA": "0x336c9297afb7798c292e9f80d8e566b947f291f0",
        "COW": "0xc694a91e6b071bf030a18bd3053a7fe09b6dae69",
        "BITCOIN": "0x2a06a17cbc6d0032cac2c6696da90f29d39a1a29",
        "DEGEN": "0x4ed4e862860bed51a9570b96d89af5e1b0efefed",
        "COOKIE": "0xc0041ef357b183448b235a8ea73ce4e4ec8c265f",
        "CFG": "0x2b51E2Ec9551F9B87B321f63b805871f1c81ba97",
        "SDEX": "0xfd4330b0312fdeec6d4225075b82e00493ff2e3f",
        "OSAK": "0xbFd5206962267c7b4b4A8B3D76AC2E1b2A5c4d5e",
        "SPEC": "0x96419929d7949d6a801a6909c145c8eef6a40431",
        "DOLA": "0x4621b7a9c75199271f773ebd9a499dbd165c3191",
        "KNC": "0x28fe69ff6864c1c218878bdca01482d36b9d57b1",
        "BTRST": "0xa7d68d155d17cb30e311367c2ef1e82ab6022b67",
        "AnzBond": "0xa87c9808c0ebe20a1427b5c769623c77201f6f4d",
        "USDz": "0x04D5ddf5f3a8939889F11E97f8c4BB48317F1938",
        "MAV": "0x64b88c73a5dfa78d1713fe1b4c69a22d7e0faaa7",
        "EURC": "0x60a3e35cc302bfa44cb288bc5a4f316fdb1adb42",
        "OGN": "0x7002458B1DF59EccB57387bC79fFc7C29E22e6f7",
        "LMWR": "0xe997017e0cb0ceb503565f181e9ea922cd979c35",
        "LUNA": "0x55cd6469f597452b5a7536e2cd98fde4c1247ee4",
        "HENLO": "0x23a96680ccde03bd4bdd9a3e9a0cb56a5d27f7c9"
    }    
};
let mainnet = {
    "routerContract": "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    "quoterAddress":'0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
    "quoterV2Address":"0x61fFE014bA17989E743c5F6cB21bF9697530B21e",
    "token": {
        "WETH": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        "USDT": "0xdac17f958d2ee523a2206206994597c13d831ec7",
        "USDC": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        "BNB": "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
        "stETH": "0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
        "LINK": "0x514910771af9ca656af840dff83e8264ecf986ca",
        "SHIB": "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
        "wstETH": "0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0",
        "TONCOIN": "0x582d872a1b094fc48f5de31d3b73f2d9be47def1",
        "WBTC": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
        "DOT": "0x21c2c96dbfa137e23946143c71ac8330f9b44001",
        "Blur Pool": "0x0000000000a39bb272e79075ade125fd351887ac",
        "LEO": "0x2af5d2ad76741191d15dfe7bf6ac92d4bd912ca3",
        "UNI": "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
        "BGB": "0x54D2252757e1672EEaD234D27B1270728fF90581",
        "PEPE": "0x6982508145454ce325ddbe47a25d4ec3d2311933",
        "weETH": "0xcd5fe23c85820f7b72d0926fc9b05b43e359b7ee",
        "NEAR": "0x85f17cf997934a597031b2e18a9ab6ebd4b9f6a4",
        "USDS": "0xdC035D45d973E3EC169d2276DDab16f1e407384F",
        "USDe": "0x4c9edd5852cd905f086c759e8383e09bff1e68b3",
        "AAVE": "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9",
        "stkAAVE": "0x4da27a545c0c5b758a6ba100e3a049001de870f5",
        "VEN": "0xd850942ef8811f2a866692a623011bde52a462c1",
        "POL": "0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6",
        "RNDR": "0x6de037ef9ad2725eb40118bb1702ebb27e4aeb24",
        "CRO": "0xa0b73e1ff0b80914ab6fe0444e65848c4c34450b",
        "MNT": "0x3c3a81e81dc49a522a592e7622a7e711c06bf354",
        "OM": "0x3593d125a4f7849a1b059e64f4517a86dd60c95d",
        "WFIL": "0x6e1A19F235bE7ED8E3369eF73b196C07257494DE",
        "FET": "0xaea46A60368A7bD060eec7DF8CBa43b7EF41Ad85",
        "OKB": "0x75231f58b43240c9718dd58b4967c5114342a86c",
        "DAI": "0x6b175474e89094c44da98b954eedeac495271d0f",
        "ARB": "0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1",
        "ENA": "0x57e114B691Db790C35207b2e685D4A43181e6061",
        "ATOM": "0x519ddeff5d142fc177d95f24952ef3d2ede530bc",
        "INJ": "0xe28b3B32B6c345A34Ff64674606124Dd5Aceca30",
        "THETA": "0x3883f5e181fccaf8410fa61e12b59bad963fb645",
        "IMX": "0xf57e7e7c23978c3caec3c3548e3d615c346e79ff",
        "BONK": "0x4aef9bd3fbb09d8f374436d9ec25711a1be9bacb",
        "VIRTUAL": "0x44ff8620b8cA30902395A7bD3F2407e1A091BF73",
        "GRT": "0xc944e90c64b2c07662a292be6244bdf05cda44a7",
        "cbBTC": "0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf",
        "MOVE": "0x3073f7aaa4db83f95e9fff17424f71d4751a3073",
        "WLD": "0x163f8c2467924be0ae7b5347228cabf260318753",
        "rsETH": "0xa1290d69c65a6fe4df752f95823fae25cb99e5a7",
        "WIF": "0xcf7e6742266ad5a76ee042e26d3f766c34195e5f",
        "FDUSD": "0xc5f0f7b66764F6ec8C8Dff7BA683102295E16409",
        "SEI": "0x013addc6512432304c055cec20bbb0f6aa5ed7d5",
        "LDO": "0x5a98fcbea516cf06857215779fd812ca3bef1b32"
    }
}

let arbitrum = {
    "routerContract": "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24",
    "quoterAddress":'0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
    "quoterV2Address":"0x61fFE014bA17989E743c5F6cB21bF9697530B21e",
    "token":{
        "USDT": "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
        "USDC.e": "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
        "USDC": "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
        "LINK": "0xf97f4df75117a78c1a5a0dbb814af92458539fb4",
        "wstETH": "0x0fBcbaEA96Ce0cF7Ee00A8c19c3ab6f5Dc8E1921",
        "WBTC": "0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f",
        "WETH": "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
        "UNI": "0xfa7f8980b0f1e64a2062791cc3b0871572f1f7f0",
        "PEPE": "0x25d887ce7a35172c62febfd67a1856f20faebb00",
        "USDe": "0x5d3a1ff2b6bab83b63cd9ad0787074081a52ef34",
        "DAI": "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
        "ARB": "0x912ce59144191c1204e64559fe8253a0e49e6548",
        "ENA": "0x58538e6a46e07434d7e7375bc268d3cb839c0133",
        "cbBTC": "0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf",
        "GRT": "0x9623063377ad1b27544c965ccd7342f7ea7e88c7",
        "LDO": "0x13ad51ed4f1b7e9dc168d8a00cb3f4ddd85efa60",
        "USD0": "0x35f1C5cB7Fb977E669fD244C567Da99d8a3a6850",
        "PYTH": "0xE4D5c6aE46ADFAF04313081e8C0052A30b6Dd724",
        "CRV": "0x11cdb42b0eb46d95f990bedd4695a6e3fa034978",
        "ezETH": "0x2416092f143378750bb29b79ed961ab195cceea5",
        "weETH": "0x35751007a407ca6feffe80b3cb397736d2cf4dbe",
        "USDD": "0x680447595e8b7b3aa1b43beb9f6098c79ac2ab3f",
        "APE": "0x7f9fbf9bdd3f4105c478b996b648fe6e828a1e98",
        "COMP": "0x354a6da3fcde098f8389cad84b0182725c6c91de",
        "FRAX": "0x17fc002b466eec40dae837fc4be5c67993ddbd6f",
        "W": "0xb0ffa8000886e57f86dd5264b9582b2ad87b2b91",
        "USDX": "0xf3527ef8de265eaa3716fb312c12847bfba66cef",
        "Cake": "0x1b896893dfc86bb67Cf57767298b9073D2c1bA2c",
        "GNO": "0xa0b862f60edef4452f25b4160f177db44deb6cf1",
        "PENDLE": "0x0c880f6761f1af8d9aa9c466984b80dab9a8c9e8",
        "AXL": "0x23ee2343b892b1bb63503a4fabc840e0e2c6810f",
        "TUSD": "0x4d15a3a2286d883af0aa1b3f21367843fac63e07",
        "frxETH": "0x178412e79c25968a32e89b11f63b33f733770c2a",
        "tBTC": "0x6c84a8f1c29108F47a79964b5Fe888D4f4D0dE40",
        "LPT": "0x289ba1701c2f088cf0faf8b3705246331cb8a839",
        "LUNC": "0x1A4dA80967373fd929961e976b4b53ceeC063a15",
        "1INCH": "0x6314c31a7a1652ce482cffe247e9cb7c3f4bb9af",
        "ZRO": "0x6985884c4392d348587b19cb9eaaf157f13271cd",
        "USDY": "0x35e050d3C0eC2d29D269a8EcEa763a183bDF9A9D",
        "ETHFI": "0x7189fb5b6504bbff6a852b13b7b82a3c118fdc27",
        "OHM": "0x6e6a3d8f1affac703b1aef1f43b8d2321be40043",
        "ATH": "0xc87B37a581ec3257B734886d9d3a581F5A9d056c",
        "sfrxETH": "0x95ab45875cffdba1e5f451b950bc2e42c0053f39",
        "WOO": "0xcafcd85d8ca7ad1e1c6f82f651fa15e33aefd07b",
        "CELO": "0x4e51ac49bc5e2d87e0ef713e9e5ab2d71ef4f336",
        "YFI": "0x82e3a8f066a6989666b031d916c43672085b1582",
        "SUSHI": "0xd4d42f0b6def4ce0383636770ef773390d85c61a",
        "FXS": "0x9d2f299715d94d8a7e6f5eaa8e654e8c74a988a7",
        "GMX": "0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a",
        "LRC": "0x46d0ce7de6247b0a95f67b43b589b4041bae7fbe"
    }
}

allData.base = base;
allData.mainnet = mainnet;
allData.arbitrum = arbitrum;

let getTokenAndRouter = function(network, token0, token1, token2) {
    let infoObject = allData[network];
    let routerContract = infoObject?.routerContract;
    let quoterV2Address = infoObject?.quoterV2Address;
    let token0Contract = infoObject?.token?.[token0];
    let token1Contract = infoObject?.token?.[token1];
    let token2Contract = infoObject?.token?.[token2];
    return {
        token0Contract,
        token1Contract,
        token2Contract,
        routerContract,
        quoterV2Address
    }
}
function main() {
    let { token0Contract:token0, token1Contract:token1,routerContract,quoterV2Address} = getTokenAndRouter("base","WBTC","USDC");
    console.log(routerContract, token0, token1);
}


module.exports = {
    getTokenAndRouter: getTokenAndRouter,
    allData: allData
}

// quoterV2Address 地址https://docs.uniswap.org/contracts/v3/reference/deployments/arbitrum-deployments
// routerContract 地址https://docs.uniswap.org/contracts/v2/reference/smart-contracts/v2-deployments


// arb  weth-usdc getPair
// https://arbiscan.io/address/0xF64Dfe17C8b87F012FCf50FbDA1D62bfA148366a