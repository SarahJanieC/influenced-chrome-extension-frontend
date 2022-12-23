'use strict';
let CREATOR_URL_GLOBAL = '';

var openLogin = function () {
    sub.classList.add("hidden");
    warning.classList.add("hidden");
    login.classList.remove("hidden");
  };

var closeLogin = function () {
    // sub.classList.remove("hidden");
    // warning.classList.remove("hidden");
    login.classList.add("hidden");
  };

// Make Intro Available
var openIntro = function () {
  sub.classList.remove("hidden");
  warning.classList.add("hidden");
};

// Make Intro Unavailable
var closeIntro = function () {
  sub.classList.add("hidden");
  warning.classList.remove("hidden");
};

var openRequestTab = function () {
  // Show the specific tab content
  brandTab.classList.add("hidden");
  requestTab.classList.remove("hidden");
//   influencerTab.classList.add("hidden");
};
var openBrandDetailsTab = function () {
  // Show the specific tab content
  brandTab.classList.remove("hidden");
  requestTab.classList.add("hidden");
//   influencerTab.classList.add("hidden");
};
// var openInfluencerdDetailsTab = function () {
//     // Show the specific tab content
//     brandTab.classList.add("hidden");
//     requestTab.classList.add("hidden");
//     // influencerTab.classList.remove("hidden");
//   };


function check_url(url) {
    const websites = ["www.tiktok.com/", "www.instagram.com/", "www.facebook.com/"];
    let length = websites.length;
    let result = false;
    var profile = url.split("/")[3];
    while(length--){
      if(url.includes(websites[length])){
        result = true;
      }
    }
    if(profile.length === 0){
      result = false
    }
    return result;
}

// Saves options to chrome.storage
function save_options() {
    var brand = document.getElementById('brand').value;
    var company = document.getElementById('company').value;
    var ugcBudget = document.getElementById('ugcBudget').value;
    var adBudget = document.getElementById('adBudget').value;
    var igBudget = document.getElementById('igBudget').value;
  
    chrome.storage.sync.set({
      brand: brand,
      company: company,
      ugcBudget: ugcBudget,
      adBudget: adBudget,
      igBudget: igBudget,
  
    }, function() {
      // Update status to let user know options were saved.
      var status = document.getElementById('status');
      // var status2 = document.getElementById('status2');
  
      status.textContent = 'Options Updated.';
      // status2.textContent = 'Request Sent.';
  
      setTimeout(function() {
        status.textContent = '';
        // status2.textContent = '';
      }, 700);
    });
}

function save_login() {
    var stayLogged = document.getElementById('stay-logged').checked;
    var authKey = document.getElementById('authKey').value;
    var brandLogin = document.getElementById('brand-login').value;

    if(stayLogged){
        chrome.storage.sync.set({
            authKey: authKey,
            brandLogin: brandLogin,
        });
    }
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    chrome.storage.sync.get({
      authKey: '--Enter Key--',
      brandLogin: '--Select Brand--',
      brand: '-- Brand --',
      company: '-- Company --',
      ugcBudget: '$0',
      adBudget: '$0',
      igBudget: '$0',
    }, function(items) {
      document.getElementById('authKey').value = items.authKey;
      document.getElementById('brand-login').value = items.brandLogin;
      document.getElementById('brand').value = items.brand;
      document.getElementById('company').value = items.company;
      document.getElementById('ugcBudget').value = items.ugcBudget;
      document.getElementById('adBudget').value = items.adBudget;
      document.getElementById('igBudget').value = items.igBudget;
    });
}
  
function getUser(url) {
    var profileName = url.split("/")[3];
    const text = `Woah! You're interested in ${profileName}.`;
    interestText.textContent = text;
}

function authentication(url){
    var brand = document.getElementById('brand-login').value;
    var key = document.getElementById('authKey').value;
    openLogin()
    document.getElementById('login-btn').addEventListener('click',authenticateLogin(key, brand, url));
}

function display_login_message(){
    var status = document.getElementById('status-login');
    status.textContent = 'Login Failed.';

    setTimeout(function() {
      status.textContent = '';
    }, 5000);
}

function display_request_message(url, status){
    var profileName = url.split("/")[3];
    if(status){
        let text = `Success! ${profileName} has been requested.`;
        interestText.textContent = text;
    }
    else{
        let text = `Uh-oh! You've already sent a request to ${profileName}.`;
        interestText.textContent = text;
    }
}

function display_setting_reminder(){
    let text = `Request Failed: Brand Settings Incomplete`;
    interestText.textContent = text;

    setTimeout(function() {
        interestText.textContent = 'Hint: Try again after saving your brand settings';
      }, 4000);
}

function display_brand(){
  var brand = document.getElementById('brand-login').value;
  const login_brand = document.getElementById("option-brand");
  login_brand.textContent = brand
  login_brand.value = brand
  login_brand.setAttribute('selected', true)
}

const warning = document.getElementById('warning')
const sub = document.getElementById('sub')
const brandTab = document.getElementById('brand-details')
const requestTab = document.getElementById('request-details')
// const influencerTab = document.getElementById('influencer-details')
const btns = document.getElementsByClassName("tablink");
const interestText = document.getElementById("interest-text");
const login = document.getElementById('login')

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',save_options);
document.getElementById('login-btn').addEventListener('click',save_login);
document.getElementById('save').addEventListener('click',send_brand_settings);
document.getElementById('save2').addEventListener('click',send_request);
document.getElementById('brand-btn').addEventListener('click',openBrandDetailsTab);
document.getElementById('request-btn').addEventListener('click',openRequestTab);
// document.getElementById('influencer-btn').addEventListener('click',openInfluencerdDetailsTab);

window.onload = function() {
    chrome.tabs.query({active: true, lastFocusedWindow: true, currentWindow: true}, tabs => {
      let url = tabs[0].url;
      receiveCreatorURL(url)
      let pageCheck = check_url(url);

      if(pageCheck){
        document.getElementById('login-btn').addEventListener("click", function(){
            authentication(url) 
            display_brand()
        });
        warning.classList.add("hidden");
      }
      else{
        closeIntro();
        closeLogin();
      }
    });
  };
  
  // Loop through the buttons and add the active class to the current/clicked button
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function() {
      var current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace(" active", "");
      this.className += " active";
    });
  }
  