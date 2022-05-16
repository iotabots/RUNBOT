// Hey there 👋 If your read this - you're very welcome in our lovely community! https://iotabots.io/community

console.log("Beep Boop!");

let locked = true;

const lock = function () {
  locked = true;
  console.log("lock!");
  // lockingFunction()
  alert(
    "Sorry - You need a RUNBOT NFT to play the Game! More Info: https://iotabots.io/runbots"
  );
  location.reload();
};

var functionCallbacks = [];
var lockingFunction = function (callback) {
  if (locked) {
    functionCallbacks.push(callback);
  } else {
    $.longRunning(function (response) {
      while (functionCallbacks.length) {
        var thisCallback = functionCallbacks.pop();
        thisCallback(response);
      }
    });
  }
};

const applyAccessFor = function (address) {
  // what MetaMask injects as window.ethereum into each page
  console.log("window.ethereum", window.ethereum);

  if (window.ethereum == undefined) {
    console.log("Please install MetaMask!");
    lock();
    return;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  console.log("provider", provider);

  try {
    // provider.getNetwork().then((network) => {

    //   console.log("chainId is:", network.chainId)
    //   if (network.chainId !== 1074) {
    //     alert("Please connect to IOTA EVM Testnet");
    //     lock()
    //   }
    // }).catch((error) => {
    //   console.log("error getNetwork:", error)
    //   lock()
    // })

    provider
      .send("eth_requestAccounts", [])
      .then((account) => {
        // The MetaMask plugin also allows signing transactions to
        // send ether and pay to change state within the blockchain.
        // For this, you need the account signer...
        const signer = provider.getSigner();
        console.log("signer", signer);
        signer
          .getAddress()
          .then((account) => {
            console.log("account", account);

            // let contract = new ethers.Contract(
            //   address,
            //   SPACEBOTS_ABI,
            //   provider
            // );
            // console.log("contract", contract);
            console.log("soon");
            console.log("soon", window.soon);
            window.soon
              .getNftsByEthAddress(account)
              .then((obj) => {
                console.log("NFTs owned by ETH Address");
                console.log(obj);
                const filteredBots = obj.filter(
                  (e) =>
                    e.collection ===
                    "0xeb47806ef8d4c908179bd05eeabc20bc3de8c81a"
                );
                console.log("filteredBots", filteredBots);
                if (filteredBots.length > 0) {
                  console.log("Success, you have the game! Have fun!");
                } else {
                  console.log("Error, you dont have the game!");
                  lock();
                }
              })
              .catch((e) => {
                console.log("Error while loading game collection:", e);
                lock();
              });
          })
          .catch((error) => {
            console.log("error getAddress:", error);
            lock();
          });
      })
      .catch((error) => {
        console.log("error eth_requestAccounts:", error);
        lock();
      });
  } catch (error) {
    console.log("Something wrent wrong!");
    lock();
  }
};

document.onreadystatechange = function (e) {
  // document.onload = function (e) {
  console.log("Beep!");
  applyAccessFor("");
};
