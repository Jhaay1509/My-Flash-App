document.addEventListener("deviceready", onDeviceReady, false);
// document.addEventListener(
//   "deviceready",
//   document.getElementById("submit").addEventListener("click", BasicOBP),
//   false
// );
// document.getElementById("getbanks").addEventListener("click", getBanks);
// document.getElementById("getaccount").addEventListener("click", getAccounts);
// document
//   .getElementById("gettransactions")
//   .addEventListener("click", getTransactions);
// document.getElementById("getatms").addEventListener("click", getAtms);
// document
//   .getElementById("getcurrencies")
//   .addEventListener("click", getCurrencies);
// const back = document.querySelectorAll(".back");

function onDeviceReady() {
  console.log("Running cordova-" + cordova.platformId + "@" + cordova.version);
  document.getElementById("deviceready").classList.add("ready");
  document.getElementById("submit").addEventListener("click", BasicOBP);
  document.getElementById("getbanks").addEventListener("click", getBanks);
  document.getElementById("getaccount").addEventListener("click", getAccounts);
  document
    .getElementById("gettransactions")
    .addEventListener("click", getTransactions);
  document.getElementById("getatms").addEventListener("click", getAtms);
  document
    .getElementById("getcurrencies")
    .addEventListener("click", getCurrencies);
}

// Declaring the variables for the back and logout buttons
var back = document.querySelectorAll(".back");
var logout = document.querySelectorAll(".logout");

// The event handler for the back and logout buttons
logout.forEach((el) => {
  el.addEventListener("click", function () {
    window.location.href = "/";
  });
});

back.forEach((el) => {
  el.addEventListener("click", function () {
    window.history.back();
  });
});

var token;

// This function handles the user login
function BasicOBP() {
  console.log("in login");
  document.getElementById("checker").innerHTML = "cruising in";
  username = document.getElementById("uname").value;
  password = document.getElementById("pwd").value;

  // Getting the username from the email
  const userDetail = username.split(".")[0];

  // Capitalizing the first letter of the logged in user
  const loggedInUser = userDetail.charAt(0).toUpperCase() + userDetail.slice(1);
  console.log(loggedInUser);

  document.querySelectorAll(".user-name").forEach((el) => {
    el.innerText = loggedInUser;
  });

  $.ajax({
    url: "https://apisandbox.openbankproject.com/my/logins/direct",
    type: "POST",
    dataType: "json",
    crossDomain: true,
    cache: false,
    contentType: "application/json; charset=utf-8",
    xhrFields: {
      withCredentials: false,
    },

    // susan.uk.29@example.com

    // 2b78e8

    beforeSend: function (xhr) {
      xhr.setRequestHeader(
        "Authorization",
        'DirectLogin username="' +
          username +
          '",password="' +
          password +
          '", consumer_key="eolt301sf32z1hck4pnwvonl4jrgj0wklrncrpvr"'
      );
    },

    success: function (data, textStatus, jQxhr) {
      console.log("in success");
      window.location.href = "#page2";
      document.getElementById("checker").innerHTML =
        "Successful Login. Token=" + data.token;
      document.getElementById("checker").innerHTML = "";

      token = data.token;
    },

    error: function (jqXhr, textStatus, errorThrown) {
      console.log("in error");
      document.getElementById("checker").innerHTML = "Authentication failed";
    },
  });
}

// This function handles the GET request to fetch the bank data
function getBanks() {
  console.log("Retrieving");
  document.getElementById("checker2").innerHTML = "retrieving data";
  setTimeout(function () {
    // Clear the innerHTML content of the element after 3 seconds
    document.getElementById("checker2").innerHTML = "";
  }, 2000); // 2000 milliseconds = 2 seconds
  $.ajax({
    url: "https://apisandbox.openbankproject.com/obp/v4.0.0/banks",
    type: "GET",
    dataType: "json",
    crossDomain: true,
    contentType: "application/json; charset=utf-8",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", "DirectLogin token=" + token);
      xhr.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
    },
    success: function (data, textStatus, jQxhr) {
      console.log("Getting Banks");
      console.log(data);
      document.getElementById("tablebody").innerHTML = "";
      window.location.href = "#page3";
      // $("#tablebody").append("<tr><td>Full Name</td ><td>Short Name</td><td>Id</td></tr > ");
      data.banks.forEach(appendRow);
      // document.getElementById("checker2").innerHTML = JSON.stringify(data);
    },

    error: function (jqXhr, textStatus, errorThrown) {
      console.log("retrieving banks");
      document.getElementById("checker2").innerHTML = "Retrieving failed";
    },
  });
}

// Appending the bank data to the HTML
function appendRow(bank) {
  $("#tablebody").append(
    "<tr data-bank-id='" +
      bank.id +
      "'><td><button onclick=output_bank('" +
      bank.id +
      "')>" +
      bank.full_name +
      "</button></td><td>" +
      bank.short_name +
      "</td><td>" +
      bank.id +
      "</td></tr>"
  );
}

// Define a function to perform the search

var bankID;

function output_bank(a) {
  console.log("Bank ID: " + a);
  bankID = a;
  window.location.href = "#page2";
}

// Function to filter rows based on bank ID
function filterRowsByBankID(searchString) {
  // Convert the search string to lowercase for case-insensitive matching
  searchString = searchString.toLowerCase();

  console.log("Search string:", searchString);

  // Get all rows in the table body
  var rows = document.querySelectorAll("#tablebody tr");

  // Loop through each row
  rows.forEach(function (row) {
    // Get the bank ID stored in the row's data attribute
    var rowBankID = row.dataset.bankId;

    if (typeof rowBankID !== "undefined") {
      // Ensure rowBankID is defined before calling toLowerCase
      rowBankID = rowBankID.toLowerCase();

      console.log("Row bank ID:", rowBankID);

      // Check if the bank ID contains the search string
      if (rowBankID.includes(searchString) || searchString === "") {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    }
  });
}

// Function to handle input change event
function handleInputChange() {
  // Get the value of the search input
  var searchString = document.getElementById("bankSearchInput").value.trim();

  // Call the filtering function with the search input value
  filterRowsByBankID(searchString);
}

// Add event listener to the search input
document
  .getElementById("bankSearchInput")
  .addEventListener("input", handleInputChange);



  // This function handles the GET request to fetch the accounts data
function getAccounts() {
  console.log("Retrieving");
  if (bankID === undefined) alert("kindly select a bank to proceed");
  console.log(bankID);
  document.getElementById("checker2").innerHTML = "retrieving data";
  setTimeout(function () {
    // Clear the innerHTML content of the element after 3 seconds
    document.getElementById("checker2").innerHTML = "";
  }, 2000); // 2000 milliseconds = 2 seconds
  $.ajax({
    url:
      "https://apisandbox.openbankproject.com/obp/v4.0.0/banks/" +
      bankID +
      "/accounts/account_ids/private",
    type: "GET",
    dataType: "json",
    crossDomain: true,
    contentType: "application/json; charset=utf-8",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", "DirectLogin token=" + token);
      xhr.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
    },
    success: function (data, textStatus, jQxhr) {
      console.log("Getting accounts");
      console.log(data);
      document.getElementById("accountList").innerHTML = "";
      window.location.href = "#page4";
      $("#accountListhead").append("<h2>Accounts</h2>");
      data.accounts.forEach(appendRow2);
      // document.getElementById("checker2").innerHTML = JSON.stringify(data);
    },
    error: function (jqXhr, textStatus, errorThrown) {
      console.log("retrieving accountss");
      document.getElementById("checker2").innerHTML = "Retrieving failed";
    },
  });
}

// Appending the account data to the HTML
function appendRow2(account) {
  $("#accountList").append(
    "<li> <button onclick= output_account('" +
      account.id +
      "')>" +
      account.id +
      "</button></li>"
  );
}

var accountID;
function output_account(b) {
  console.log("Account ID: " + b);
  accountID = b;
  window.location.href = "#page2";
}

// This function handles the GET request to fetch the transactions data
function getTransactions() {
  console.log("Retrieving");
  if (accountID === undefined || bankID === undefined)
    alert("kindly select a bank and account to proceed");
  document.getElementById("checker2").innerHTML = "retrieving data";
  setTimeout(function () {
    // Clear the innerHTML content of the element after 3 seconds
    document.getElementById("checker2").innerHTML = "";
  }, 2000); // 2000 milliseconds = 2 seconds
  $.ajax({
    url:
      "https://apisandbox.openbankproject.com/obp/v4.0.0/my/banks/" +
      bankID +
      "/accounts/" +
      accountID +
      "/transactions",
    type: "GET",
    dataType: "json",
    crossDomain: true,
    contentType: "application/json; charset=utf-8",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", "DirectLogin token=" + token);
      xhr.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
    },
    success: function (data, textStatus, jQxhr) {
      console.log("julii");
      console.log(data);
      document.getElementById("transTableHeading").innerHTML="";
      document.getElementById("transactiontable").innerHTML="";
      window.location.href = "#page5";
      $("#transTableHeading").append(
        "<tr><th> DateTime(UTC)</th><th>Description</th><th>Currency</th><th>Amount</th><th>New Balance</th></tr>"
      );
      data.transactions.forEach(appendRow3);
      // document.getElementById("checker2").innerHTML = JSON.stringify(data);
    },
    error: function (jqXhr, textStatus, errorThrown) {
      console.log("retrieving accounts");
      document.getElementById("checker2").innerHTML = "Retrieving failed";
    },
  });
}

function appendRow3(transactions) {
  // Creating a new date object with the date data from transactions
  var dateTime = new Date(transactions.details.completed);

  // Formating the Date to localeString which is easily understandable to everyone
  var formattedDateTime = dateTime.toLocaleString("en-US", {
    timeZone: "UTC",
  });

  // Appending the transaction data to the HTML
  $("#transactiontable").append(
    "<tr><td>" +
      formattedDateTime +
      "</td><td>" +
      transactions.details.description +
      "</td><td>" +
      transactions.details.value.currency +
      "</td><td>" +
      transactions.details.value.amount +
      "</td><td>" +
      transactions.details.new_balance.amount +
      "</td></tr>"
  );
}

// This function handles the GET request to fetch the ATM data
function getAtms() {
  console.log("Retrieving");
  if (bankID === undefined) alert("Kindly select a bank to proceed");
  document.getElementById("checker2").innerHTML = "retrieving data";
  setTimeout(function () {
    // Clear the innerHTML content of the element after 3 seconds
    document.getElementById("checker2").innerHTML = "";
  }, 2000); // 2000 milliseconds = 2 seconds
  $.ajax({
    url:
      "https://apisandbox.openbankproject.com/obp/v5.1.0/banks/" +
      bankID +
      "/atms",
    type: "GET",
    dataType: "json",
    crossDomain: true,
    contentType: "application/json; charset=utf-8",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", "DirectLogin token=" + token);
      xhr.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
    },
    success: function (data, textStatus, jQxhr) {
      console.log("julii");
      console.log(data);
      document.getElementById("atmTableHeading").innerHTML="";
      document.getElementById("atmtable").innerHTML="";
      window.location.href = "#page6";
      $("#atmTableHeading").append(
        "<tr><th> Street</th><th> City</th><th>" +
          "State</th><th>Longitude</th><th>Latitude</th><th>Opening Times</th><th>Closing Times</th></tr>"
      );
      data.atms.forEach(appendRow4);
    },
    error: function (jqXhr, textStatus, errorThrown) {
      console.log("retrieving failed");
      document.getElementById("checker2").innerHTML = "Retrieving failed";
    },
  });
}

// Appending the atm data to the HTML
function appendRow4(atm) {
  $("#atmtable").append(
    "<tr><td>" +
      atm.address.line_1 +
      "</td><td>" +
      atm.address.city +
      "</td><td>" +
      atm.address.state +
      "</td><td>" +
      atm.location.longitude +
      "</td><td>" +
      atm.location.latitude +
      "</td><td>" +
      atm.monday.opening_time +
      "</td><td>" +
      atm.monday.closing_time +
      "</td></tr>"
  );
}

// This function handles the GET request to fetch the currency data
function getCurrencies() {
  console.log("Retrieving");
  if (bankID === undefined) alert("Kindly select a bank to proceed");
  document.getElementById("checker2").innerHTML = "retrieving data";
  setTimeout(function () {
    // Clear the innerHTML content of the element after 3 seconds
    document.getElementById("checker2").innerHTML = "";
  }, 2000); // 2000 milliseconds = 2 seconds
  $.ajax({
    url:
      "https://apisandbox.openbankproject.com/obp/v5.1.0/banks/" +
      bankID +
      "/currencies",
    type: "GET",
    dataType: "json",
    crossDomain: true,
    contentType: "application/json; charset=utf-8",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", "DirectLogin token=" + token);
      xhr.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
    },
    success: function (data, textStatus, jQxhr) {
      console.log("julii");
      console.log(data);
      document.getElementById("currencyTableHeading").innerHTML="";
      document.getElementById("currencytable").innerHTML="";
      window.location.href = "#page7";
      $("#currencyTableHeading").append("<tr><th> Currencies</th></tr>");
      data.currencies.forEach(appendRow5);
    },
    error: function (jqXhr, textStatus, errorThrown) {
      console.log("retrieving failed");
      document.getElementById("checker2").innerHTML = "Retrieving failed";
    },
  });
}

// Appending the currency data to the HTML
function appendRow5(currencies) {
  $("#currencytable").append(
    "<tr><td>" + currencies.alphanumeric_code + "</td></tr>"
  );
}
