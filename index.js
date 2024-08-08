const supportedChainId = "0x773";
const chainIdNumber = 1907;
const currency = "BITCI";
const rpc = "https://rpc.bitci.com";
const explorer = "https://v3.bitciexplorer.com/";

var web3,contract, getContract,isConnectedVar;
var getWeb3 = new Web3("https://rpc.bitci.com")
var contractAddress = "0x3c8823C9bEBAC854A0D05DA4ea283D7bC25293E4"
var abi = [
    {
        "inputs": [
            {
                "internalType": "contract IERC20",
                "name": "_stakingToken",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_apr",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "oldAPR",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "newAPR",
                "type": "uint256"
            }
        ],
        "name": "APRChanged",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "oldAdmin",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newAdmin",
                "type": "address"
            }
        ],
        "name": "AdminChanged",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "Claimed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "admin",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "etherAmount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "tokenAmount",
                "type": "uint256"
            }
        ],
        "name": "FundsWithdrawn",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "duration",
                "type": "uint256"
            }
        ],
        "name": "Staked",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "contract IERC20",
                "name": "oldToken",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "contract IERC20",
                "name": "newToken",
                "type": "address"
            }
        ],
        "name": "TokenChanged",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "reward",
                "type": "uint256"
            }
        ],
        "name": "Unstaked",
        "type": "event"
    },
    {
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "etherAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "tokenAmount",
                "type": "uint256"
            }
        ],
        "name": "adminWithdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "apr",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "duration",
                "type": "uint256"
            }
        ],
        "name": "calculateEstimatedReward",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "calculateEstimatedRewardOneMonth",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "calculateEstimatedRewardOneWeek",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "calculateEstimatedRewardThreeMonths",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "duration",
                "type": "uint256"
            }
        ],
        "name": "calculateReward",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "getStakes",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "duration",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "claimed",
                        "type": "bool"
                    }
                ],
                "internalType": "struct StakingContract.Stake[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTotalStakedOneMonth",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTotalStakedOneWeek",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTotalStakedThreeMonths",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "newAPR",
                "type": "uint256"
            }
        ],
        "name": "setAPR",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newAdmin",
                "type": "address"
            }
        ],
        "name": "setAdmin",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract IERC20",
                "name": "newToken",
                "type": "address"
            }
        ],
        "name": "setStakingToken",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "stakeOneMonth",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "stakeOneWeek",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "stakeThreeMonths",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "stakes",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "duration",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "claimed",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "stakingToken",
        "outputs": [
            {
                "internalType": "contract IERC20",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalStakedOneMonth",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalStakedOneWeek",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalStakedThreeMonths",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "stakeIndex",
                "type": "uint256"
            }
        ],
        "name": "unstake",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "stateMutability": "payable",
        "type": "receive"
    }
]
var tokenId = "0xa8a06219e731e067f43f4c2e541b109c3d10ccd7"

var abierc20 = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "burn",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "burnFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "subtractedValue",
                "type": "uint256"
            }
        ],
        "name": "decreaseAllowance",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "addedValue",
                "type": "uint256"
            }
        ],
        "name": "increaseAllowance",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

$(window).on("load",async ()=>{
    if(window.ethereum!=undefined){
        web3 = new Web3(window.ethereum)
        contract = new web3.eth.Contract(abi,contractAddress)
        if(isConnected()){
            var st = await getTotalStake(window.ethereum.selectedAddress)
            $("#stake30days #totalStaked").text(st.total30days/10**18 + " Micron")
            $("#stake7days #totalStaked").text(st.total7days/10**18 + " Micron")
            $("#stake90days #totalStaked").text(st.total90days/10**18 + " Micron")
        }
    }else{
        Toast.fire({title:"Tanımlanamayan MetaMask!", html:`MetaMask'i <a href="https://metamask.io/">https://metamask.io/</a> adresinden indirerek yükleyin.`,icon:"warning"})
    }
    init()
    getContract = new getWeb3.eth.Contract(abi,contractAddress)

    $("#stake90days #totalReward, #stake7days #totalReward, #stake30days #totalReward").text((await getBalance(contractAddress))+" Bitci")
})

async function getBalance(address) {
    try {
        // Obtenha o saldo em Wei
        const balanceWei = await getWeb3.eth.getBalance(address);
        
        // Converta o saldo para Ether
        const balanceEther = getWeb3.utils.fromWei(balanceWei, 'ether');
        
        console.log(`Saldo do endereço ${address}: ${balanceEther} ETH`);
        return balanceEther
    } catch (error) {
        console.error('Erro ao obter saldo:', error);
        return 0;
    }
}

function connectWallet(){
    if(web3 != undefined){
        main()
    }else{
        Toast.fire({title:"Tanımlanamayan MetaMask!", html:`MetaMask'i <a href="https://metamask.io/">https://metamask.io/</a> adresinden indirerek yükleyin.`,icon:"warning"})
    }
}

const init = async () => {
    console.log(typeof window.ethereum !== 'undefined');
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
        monitorMetaMaskEvents()
        initUser();
    } else {
        Toast.fire("MetaMask yüklü değil. Lütfen https://metamask.io/ adresinden MetaMask'i yükleyin.",'','warning');
    }
};


function monitorMetaMaskEvents() {
    ethereum.on('accountsChanged', (accounts) => {
        document.location.reload(true)
    });

    ethereum.on('chainChanged', (chainId) => {
        document.location.reload(true)
    });

    ethereum.on('disconnect', (error) => {
        console.log("Metamask disconnected")
    });

    // Não há evento específico para desinstalação, mas podemos monitorar a ausência do provedor
    var a = setInterval(() => {
        if (typeof window.ethereum === 'undefined') {
            console.log("metamask não identificada")
            clearInterval(a)
        }
    }, 1000);
}


const initUser = async () => {
    var isS = await isConnected()
    var accounts = isS.accounts
    if(isS.isConnected && sessionStorage.getItem("isConnected") != undefined){
        $('[onclick="connectWallet()"]').text(accounts[0].substr(0,6)+"..."+accounts[0].substr((accounts[0]).length-6,(accounts[0]).length))
        $('[onclick="connectWallet()"]').attr("onclick", "seedetails('"+explorer+"address/"+accounts[0]+"')")
        isConnectedVar = true;
    }
};

function seedetails(a){
    Swal.fire({title: "Account",showConfirmButton:false,html:`<div id="seedetails"><p>Address: <a href="${a}">${window.ethereum.selectedAddress.substr(0,8)}...${window.ethereum.selectedAddress.substr(-8)}</a></p><button onclick="disconnect()">Disconnect</button></div>`})
    setInterval(() => {
        $("body").attr("class", "");
    }, 200);
}

function disconnect(a){
    sessionStorage.removeItem("isConnected")
    document.location.reload(true)
}

async function isConnected(){
    if(!window.ethereum){
        return false
    }
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    return {isConnected: accounts.length != 0,accounts: accounts};
}


async function main() {
    if (await checkMetaMask()) {
        const accounts = await checkMetaMaskUnlocked();
        if (accounts.length > 0) {
            const connectedAccounts = await connectMetaMask();
            if (connectedAccounts.length > 0 && await checkChain()) {
                init();
                monitorMetaMaskEvents();
            }
        }
    }
}

async function checkMetaMask() {
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask está instalada!');
        return true;
    } else {
        return false;
    }
}

// Função para verificar se MetaMask está desbloqueada e conectar
async function checkMetaMaskUnlocked() {
    try {
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
            console.log('MetaMask está desbloqueada!');
            return accounts;
        } else {
            Toast.fire("MetaMask kilitli. Lütfen MetaMask'i kilidini açın.",'','info')
            const newAccounts = await ethereum.request({ method: 'eth_requestAccounts' });
            return newAccounts;
        }
    } catch (error) {
        return [];
    }
}


async function connectMetaMask() {
    try {
        const accounts = await ethereum.request({
            method: 'eth_requestAccounts',
            params: [{ eth_accounts: {} }]
        });
        sessionStorage.setItem("isConnected","true")
        console.log('Conectado com sucesso!', accounts);
        return accounts;
    } catch (error) {
        return [];
    }
}


// Função para verificar a chain ID
async function checkChain() {
    const chainId = await ethereum.request({ method: 'eth_chainId' });
    if (chainId === supportedChainId) {
        console.log('Chain correta!');
        return true;
    } else {
        Toast.fire('Incorrect string. Please change to a supported string.','','info')
        try {
            await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: supportedChainId }]
            });
            return true;
        } catch (error) {
            if (error.code === 4902) {
                console.log('Chain não está na lista de chains da MetaMask.');
            }
            return false;
        }
    }
}

async function stake30days() {
    var text= $("#stakeinput30").val()
    if(text == ""){
        Toast.fire("Gerekli tüm alanları doldurun.","","error")
    }else{
        var allowance = await getAllowanceToken(window.ethereum.selectedAddress,contractAddress,tokenId)
        if(allowance != 0){
            if((allowance/10**18) >= text){
                await stakeTx("30", window.ethereum.selectedAddress, text)
            }else{
                Toast.fire("İzin değeri, stake edilecek istenen değerden daha düşük. Lütfen izin değerinizi artırın, MetaMask'i kontrol edin.","","info")
                await sendAllowance(window.ethereum.selectedAddress,contractAddress,tokenId,text)
            }
        }else{
            Toast.fire("İlk kez stake yapmadan önce, sözleşme için izin vermek gereklidir. Lütfen MetaMask'inizi kontrol edin.","","info")
            await sendAllowance(window.ethereum.selectedAddress,contractAddress,tokenId,text)
        }
    }
}

async function stake90days() {
    var text= $("#stakeinput90").val()
    if(text == ""){
        Toast.fire("Gerekli tüm alanları doldurun.","","error")
    }else{
        var allowance = await getAllowanceToken(window.ethereum.selectedAddress,contractAddress,tokenId)
        if(allowance != 0){
            if((allowance/10**18) >= text){
                await stakeTx("90", window.ethereum.selectedAddress, text)
            }else{
                Toast.fire("İzin değeri, stake edilecek istenen değerden daha düşük. Lütfen izin değerinizi artırın, MetaMask'i kontrol edin.","","info")
                await sendAllowance(window.ethereum.selectedAddress,contractAddress,tokenId,text)
            }
        }else{
            Toast.fire("İlk kez stake yapmadan önce, sözleşme için izin vermek gereklidir. Lütfen MetaMask'inizi kontrol edin.","","info")
            await sendAllowance(window.ethereum.selectedAddress,contractAddress,tokenId,text)
        }
    }
}

async function stake7days() {
    var text= $("#stakeinput7").val()
    if(text == ""){
        Toast.fire("Gerekli tüm alanları doldurun.","","error")
    }else{
        var allowance = await getAllowanceToken(window.ethereum.selectedAddress,contractAddress,tokenId)
        if(allowance != 0){
            if((allowance/10**18) >= text){
                await stakeTx("7", window.ethereum.selectedAddress, text)
            }else{
                Toast.fire("İzin değeri, stake edilecek istenen değerden daha düşük. Lütfen izin değerinizi artırın, MetaMask'i kontrol edin.","","info")
                await sendAllowance(window.ethereum.selectedAddress,contractAddress,tokenId,text)
            }
        }else{
            Toast.fire("İlk kez stake yapmadan önce, sözleşme için izin vermek gereklidir. Lütfen MetaMask'inizi kontrol edin.","","info")
            await sendAllowance(window.ethereum.selectedAddress,contractAddress,tokenId,text)
        }
    }
}

async function getTotalStake(address) {
    var stakes = await contract.methods.getStakes(address).call();
    var total7days=0
    var total30days=0
    var total90days=0;
    for (let i = 0; i < stakes.length; i++) {
        if(stakes[i].duration / (60 * 60 * 24) == 7){
            total7days+=stakes[i].amount
        }
        if(stakes[i].duration / (60 * 60 * 24) == 30){
            total30days+=stakes[i].amount
        }
        if(stakes[i].duration / (60 * 60 * 24) == 90){
            total90days +=stakes[i].amount
        }
    }
    return{total30days:total30days,total7days:total7days,total90days:total90days}
}

async function unstake(params) {
    var stakes = await contract.methods.getStakes(window.ethereum.selectedAddress).call();
    if (stakes.length > 0) {
        Swal.fire({ title: "Unstake", html: "<div id='toUnstake'></div>", showConfirmButton: false });
        setInterval(() => {
            $("body").attr("class", "");
        }, 200);
        
        for (let i = 0; i < stakes.length; i++) {
            console.log(stakes[i]);
            if (stakes[i].duration / (60 * 60 * 24) == params) {
                const timestamp = stakes[i].timestamp;
                const date = new Date(timestamp * 1000);
                
                const passeddaysResult = await passeddays(timestamp*1000, params);
                
                $("#toUnstake").append(`
                    <div>
                        <p>Index ${i}</p>
                        <p>Toplam Stake Edilen: <span>${stakes[i].amount / 10 ** 18} Micron</span></p>
                        <p>Süre: <span>${stakes[i].duration / (60 * 60 * 24)} Gün</span></p>
                        <p>Tarih: <span>${date.toISOString()}</span></p>
                        <p>Kilidi Açmaya Kalan Gün: <span>${passeddaysResult.dayscurent.remainingDays} Gün</span></p>
                        <p>Tahmini Nihai Ödüller: <span>${await getContract.methods.calculateEstimatedReward(BigInt(stakes[i].amount),BigInt(stakes[i].duration)).call()/10e18} Bitci</span></p>
                        ${passeddaysResult.hasPassedDays ? `<button onclick='unstakeFunction(${i})'>Unstake and Claim</button>` : ""}
                    </div>
                `);
            }
        }
        if($("#toUnstake").html()==""){
            $("#toUnstake").html("<p>Stake geçmişi yok.</p>")
        }
    } else {
        Toast.fire("Stake edilmiş varlığınız yok.", "", "info");
    }
}

async function passeddays(timestamp, days) {
    timestamp=timestamp/1000
    const currentTime = Math.floor(Date.now() / 1000); // Obtém o timestamp atual em segundos
    const daysInSeconds = days * 24 * 60 * 60; // Número de segundos em `days` dias

    // Verifica se o timestamp fornecido é mais antigo do que o timestamp atual menos `days` dias
    const hasPassedDays = (currentTime - timestamp) > daysInSeconds;

    // Calcula o número de segundos passados desde o timestamp fornecido
    const timeDifference = currentTime - timestamp;
    
    // Calcula o número de dias passados
    const elapsedDays = Math.floor(timeDifference / (24 * 60 * 60));
    
    // Calcula o timestamp futuro para `days` dias a partir do timestamp fornecido
    const futureTimestamp = timestamp + daysInSeconds;
    
    // Calcula o número de segundos restantes até o futuro timestamp
    const secondsUntilFutureTimestamp = futureTimestamp - currentTime;
    const remainingDays = Math.max(Math.ceil(secondsUntilFutureTimestamp / (24 * 60 * 60)), 0); // Garantir que não retorne um valor negativo

    return {
        hasPassedDays,
        dayscurent: {
            elapsedDays,
            remainingDays
        }
    };
}


// Exemplo de uso
(async () => {
    const result = await passeddays(1723150651, 7);
    console.log(result);
})();


async function unstakeFunction(index) {
    var contract = new web3.eth.Contract(abi,contractAddress)
    const indexs = BigInt(index);
    await contract.methods.unstake(indexs).send({ from: window.ethereum.selectedAddress })
    .on('transactionHash', (hash) => {
        console.log('Transaction sent with hash:', hash);
        Toast.fire("Transaction sent, awaiting confirmation...","","info")
    })
    .on('confirmation', (confirmationNumber, receipt) => {
        console.log('Confirmation number:', confirmationNumber);
        console.log('Receipt:', receipt);
        if(confirmationNumber<1){
            Toast.fire("İşlem başarıyla onaylandı!","","success")
        }

    })
    .on('receipt', (receipt) => {
        console.log('Transaction receipt:', receipt);
    })
    .on('error', (error) => {
        console.error('Error:', error);
    });
}

async function getAllowanceToken(address,contract,token) {
    var erc20 = new web3.eth.Contract(abierc20,token)
    return (await erc20.methods.allowance(address,contract).call())
}

async function  sendAllowance(address,contract,token,amount) {
    var erc20 = new web3.eth.Contract(abierc20,token)
    await erc20.methods.approve(contract, amount)
    .send({ from: address })
    .on('transactionHash', (hash) => {
        console.log('Transaction sent with hash:', hash);
        Toast.fire("Transaction sent, awaiting confirmation...","","info")
    })
    .on('confirmation', (confirmationNumber, receipt) => {
        if(confirmationNumber<1){
            Toast.fire("İşlem başarıyla onaylandı!","","success")
        }
        console.log('Confirmation number:', confirmationNumber);
        console.log('Receipt:', receipt);

    })
    .on('receipt', (receipt) => {
        console.log('Transaction receipt:', receipt);
    })
    .on('error', (error) => {
        console.error('Error:', error);
    });
}

async function stakeTx(type,address,value) {
    var contract = new web3.eth.Contract(abi,contractAddress)
    const amountInWei = web3.utils.toWei(value, 'ether');
    var tx = (type=="7" ? contract.methods.stakeOneWeek(amountInWei) : (type == "30" ? contract.methods.stakeOneMonth(amountInWei) : ( type == "90" ? contract.methods.stakeThreeMonths(amountInWei) : contract.method.stakeOneWeek(amountInWei))))
    await tx.send({ from: address })
    .on('transactionHash', (hash) => {
        console.log('Transaction sent with hash:', hash);
        Toast.fire("Transaction sent, awaiting confirmation...","","info")
    })
    .on('confirmation', (confirmationNumber, receipt) => {
        console.log('Confirmation number:', confirmationNumber);
        console.log('Receipt:', receipt);
        if(confirmationNumber<1){
            Toast.fire("İşlem başarıyla onaylandı!","","success")
        }

    })
    .on('receipt', (receipt) => {
        console.log('Transaction receipt:', receipt);
    })
    .on('error', (error) => {
        console.error('Error:', error);
    });
}