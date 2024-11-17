let web3;
let contract;
const contractAddress = "0xCd3b1DBC8bCAD0640C3d7BDE9357dd10e1559636"; // Replace with deployed contract address
const abi = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "batchNumber",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "deliveryAddress",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "deliveryDate",
				"type": "string"
			}
		],
		"name": "confirmDelivery",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "batchNumber",
				"type": "string"
			}
		],
		"name": "createMedicine",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "batchNumber",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "newHolder",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "transferDate",
				"type": "string"
			}
		],
		"name": "transferMedicine",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "batchNumber",
				"type": "string"
			}
		],
		"name": "getMedicine",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

let actionStatus = {
    create: "Pending",
    transfer: "Pending",
    delivery: "Pending"
};

// Connect to MetaMask and contract
async function connect() {
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        await ethereum.request({ method: 'eth_requestAccounts' });
        contract = new web3.eth.Contract(abi, contractAddress);
        console.log("Connected to MetaMask and Contract.");
    } else {
        alert("MetaMask not installed!");
    }
}

// Show Popup
function showPopup(title, message, statusMessage) {
    const popup = document.getElementById("popup");
    const popupTitle = document.getElementById("popupTitle");
    const popupMessage = document.getElementById("popupMessage");

    popupTitle.textContent = title;
    popupMessage.innerHTML = `${message}<br><br><strong>Status:</strong><br>${statusMessage}`;

    popup.classList.remove("hidden");
}

// Close Popup
function closePopup() {
    const popup = document.getElementById("popup");
    popup.classList.add("hidden");
}

// Update Action Status and Show Popup
function updateStatus(action, status) {
    actionStatus[action] = status;
    const statusMessage = `
        Create: ${actionStatus.create}<br>
        Transfer: ${actionStatus.transfer}<br>
        Delivery: ${actionStatus.delivery}
    `;
    showPopup("Action Status Updated", "All Actions Status", statusMessage);
}

// Create Medicine
async function createMedicine() {
    const medicineName = document.getElementById("medicineName").value;
    const batchNumber = document.getElementById("batchNumber").value;

    const accounts = await web3.eth.getAccounts();
    try {
        await contract.methods.createMedicine(medicineName, batchNumber).send({ from: accounts[0] });
        actionStatus.create = "Succeeded";
        updateStatus("create", "Succeeded");
    } catch (error) {
        actionStatus.create = "Failed";
        updateStatus("create", `Failed: ${error.message}`);
    }
}

// Transfer Medicine
async function transferMedicine() {
    const batchNumber = document.getElementById("transferBatch").value;
    const newHolder = document.getElementById("newHolder").value;
    const transferDate = document.getElementById("transferDate").value;

    const accounts = await web3.eth.getAccounts();
    try {
        await contract.methods.transferMedicine(batchNumber, newHolder, transferDate).send({ from: accounts[0] });
        actionStatus.transfer = "Succeeded";
        updateStatus("transfer", "Succeeded");
    } catch (error) {
        actionStatus.transfer = "Failed";
        updateStatus("transfer", `Failed: ${error.message}`);
    }
}

// Confirm Delivery
async function confirmDelivery() {
    const batchNumber = document.getElementById("deliveryBatch").value;
    const deliveryAddress = document.getElementById("deliveryAddress").value;
    const deliveryDate = document.getElementById("deliveryDate").value;

    const accounts = await web3.eth.getAccounts();
    try {
        await contract.methods.confirmDelivery(batchNumber, deliveryAddress, deliveryDate).send({ from: accounts[0] });
        actionStatus.delivery = "Succeeded";
        updateStatus("delivery", "Succeeded");
    } catch (error) {
        actionStatus.delivery = "Failed";
        updateStatus("delivery", `Failed: ${error.message}`);
    }
}

// Show Details of Medicine
async function showDetails() {
    const batchNumber = document.getElementById("queryBatchNumber").value;
    try {
        const medicine = await contract.methods.getMedicine(batchNumber).call();
        const detailsOutput = document.getElementById("detailsOutput");
        detailsOutput.innerHTML = `
            <strong>Name:</strong> ${medicine[0]}<br>
            <strong>Manufacturer:</strong> ${medicine[1]}<br>
            <strong>Current Holder:</strong> ${medicine[2]}<br>
            <strong>Delivered:</strong> ${medicine[3] ? "Yes" : "No"}<br>
            <strong>Transfer Date:</strong> ${medicine[4]}<br>
            <strong>Delivery Address:</strong> ${medicine[5]}<br>
            <strong>Delivery Date:</strong> ${medicine[6]}<br>
        `;
    } catch (error) {
        showPopup('Error', 'Failed to Fetch Medicine Details.', error.message);
    }
}

// Wait for DOM to be loaded before running the code
document.addEventListener("DOMContentLoaded", async () => {
    await connect();
});
