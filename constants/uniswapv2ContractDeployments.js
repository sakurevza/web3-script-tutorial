let uniswapv2ContractDeployments = [
    {
        "name": "mainnet",
        "factoryContractAddress": "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
        "V2Router02ContractAddress": "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
    },
    {
        "name": "sepolia",
        "factoryContractAddress": "0xF62c03E08ada871A0bEb309762E260a7a6a880E6",
        "V2Router02ContractAddress": "0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3"
    },
    {
        "name": "arbitrum",
        "factoryContractAddress": "0xf1D7CC64Fb4452F05c498126312eBE29f30Fbcf9",
        "V2Router02ContractAddress": "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24"
    },
    {
        "name": "avalanche",
        "factoryContractAddress": "0x9e5A52f57b3038F1B8EeE45F28b3C1967e22799C",
        "V2Router02ContractAddress": "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24"
    },
    {
        "name": "bnb",
        "factoryContractAddress": "0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6",
        "V2Router02ContractAddress": "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24"
    },
    {
        "name": "base",
        "factoryContractAddress": "0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6",
        "V2Router02ContractAddress": "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24"
    },
    {
        "name": "optimism",
        "factoryContractAddress": "0x0c3c1c532F1e39EdF36BE9Fe0bE1410313E074Bf",
        "V2Router02ContractAddress": "0x4A7b5Da61326A6379179b40d00F57E5bbDC962c2"
    },
    {
        "name": "polygon",
        "factoryContractAddress": "0x9e5A52f57b3038F1B8EeE45F28b3C1967e22799C",
        "V2Router02ContractAddress": "0xedf6066a2b290C185783862C7F4776A2C8077AD1"
    },
    {
        "name": "blast",
        "factoryContractAddress": "0x5C346464d33F90bABaf70dB6388507CC889C1070",
        "V2Router02ContractAddress": "0xBB66Eb1c5e875933D44DAe661dbD80e5D9B03035"
    },
    {
        "name": "zora",
        "factoryContractAddress": "0x0F797dC7efaEA995bB916f268D919d0a1950eE3C",
        "V2Router02ContractAddress": "0xa00F34A632630EFd15223B1968358bA4845bEEC7"
    },
    {
        "name": "world",
        "factoryContractAddress": "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
        "V2Router02ContractAddress": "0x541aB7c31A119441eF3575F6973277DE0eF460bd"
    }
]





// let uniswapv2ContractDeploymentsObj = []

// let dom = document.getElementsByClassName('theme-doc-markdown markdown')
// let trs = dom[0].getElementsByTagName("tr");
// for (let i = 1; i < trs.length; i++) {
//     let tds = trs[i].getElementsByTagName("td");
//     let name = tds[0].innerText.toLowerCase();
//     let obj = {}
//     obj.name =tds[0].innerText.toLowerCase();
//     obj.factoryContractAddress = tds[1].innerText;
//     obj.V2Router02ContractAddress = tds[2].innerText;
//     uniswapv2ContractDeploymentsObj.push(obj);
// }
// console.log('uniswapv2ContractDeploymentsObj',uniswapv2ContractDeploymentsObj)