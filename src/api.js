'use strict';

const TYPECAST = true
const ENDPOINT = 'https://influenced-backend.herokuapp.com'

async function send_creator_APICall(payload){
  console.log("Sending POST request with payload: ", payload);
  const response = await fetch(`${ENDPOINT}/sendCreatorData`, {
    method: 'POST',
    headers: {
      'Content-type': `application/json`
    },
    body: JSON.stringify(payload),
  });
}
async function send_brand_APICall(payload){
  console.log("Sending POST request with payload: ", payload);
  const response = await fetch(`${ENDPOINT}/sendBrandData`, {
    method: 'POST',
    headers: {
      'Content-type': `application/json`
    },
    body: JSON.stringify(payload),
  });
}

async function authenticateLogin(key, brand, url){
  let verified = false;
  // Fetch data from airtable
  let response = await fetch(`${ENDPOINT}/authenticate`, {
    method: 'GET',
    headers: { 
      'content-type': 'application/json', 
    },
  });

  const data = await response.text();
  var json = JSON.parse(data);

  // Determine if creator request exists in table
  for (const x of json['records']) {
    if(x['fields']['Authentication Key'] == key && x['fields']['Brand'] == brand){
      console.log("Successfully Authenticated")
      closeLogin()
      openIntro();
      getUser(url);
      verified = true
      break;
    }
  }
  if(verified == false){display_login_message()}
}

async function get_APICreator(){
  console.log("Fetching creator request message");
  const response = await fetch(`${ENDPOINT}/getCreatorVerification`, {
    method: 'GET',
    headers: {
      'Content-type': `application/json`
    },
  });
  const data = await response.json();
  const creatorURL = data.creatorURL;
  const status = data.status;
  return [creatorURL, status]
}

function send_request(){
    var brand = document.getElementById('brand').value;
    var ugc = document.getElementById('UGC').checked;
    var igReel = document.getElementById('ig-reel').checked;
    var adAccess = document.getElementById('ad-access').checked;
    var paidCollab = document.getElementById('paid-collab').checked;
    var gifting = document.getElementById('gifting').checked;
    var other = document.getElementById('other').checked;
    var affiliate = document.getElementById('affiliate').checked;
    var reason = getTextArea();
    let requestID = self.crypto.randomUUID();
    const type = 'creatorData'
    let contentRequest = {
      "UGC" : ugc,
      "IG Reel" : igReel,
      "Ad Access (30 Days)" : adAccess
    }
    let engagementType = {
      "Paid Collab" : paidCollab,
      "Gifting" : gifting,
      "Other" : other,
      "Affiliate/Ambassador" : affiliate
    }

    for(var key in contentRequest) {
      var value = contentRequest[key];
      if(value != true){
        delete contentRequest[key];
      }
    }

    for(var key in engagementType) {
      var value = engagementType[key];
      if(value != true){
        delete engagementType[key];
      }
    }
    var contentArray = Object.keys(contentRequest)
    var engagementArray = Object.keys(engagementType)
    const payload = {
      "fields" : {
        "RequestID": requestID,
        "Creator URL": CREATOR_URL_GLOBAL,
        "Brand": brand,
        "Content Request": contentArray,
        "Engagement Type": engagementArray,
        "Reason": reason
      },
      "typecast" : TYPECAST
      };

    if(brand == ''){
      display_setting_reminder()
    }
    else{
      send_creator_APICall(payload)
      get_DisplayMessage()
    }
}

async function get_DisplayMessage(){
  var data = await get_APICreator()
  display_request_message(data[0], data[1])
}

function send_brand_settings(){
  var brand = document.getElementById('brand').value;
  var company = document.getElementById('company').value;
  var ugcBudget = document.getElementById('ugcBudget').value;
  var adBudget = document.getElementById('adBudget').value;
  var igBudget = document.getElementById('igBudget').value;
  const type = 'brandData'
  const payload = {
    "fields" : {
      "Brand": brand,
      "Max Budget for UGC": ugcBudget,
      "Max Budget for Ad Access": adBudget,
      "Max Budget for (1) IG Reel": igBudget
    },
    "typecast" : TYPECAST
  };

  send_brand_APICall(payload)
}

function getTextArea(){
  var reasonText = document.querySelector('.reason-textarea');
  if (reasonText != null) {
    var textareaValue = reasonText.value;
    return textareaValue;
  }
}

function receiveCreatorURL(url) {
  CREATOR_URL_GLOBAL = url;
}

function JSON_to_URLEncoded(element,key,list){
  var list = list || [];
  if(typeof(element)=='object'){
    for (var idx in element)
      JSON_to_URLEncoded(element[idx],key?key+'['+idx+']':idx,list);
  } else {
    list.push(key+'='+encodeURIComponent(element));
  }
  return list.join('&');
}


// async function response_message(response){
//   if (response.ok) {
//     // The request was successful, no further action is needed
//     return;
//   } else {
//     // There was an error with the request, inspect the response
//     console.log("Received error response: ", response);

//     // Access the error message from the response body
//     const responseBody = await response.json();
//     console.log("Error message: ", responseBody.error);

//     // Access the error details from the response headers
//     const responseHeaders = response.headers;
//     console.log("Error details: ", responseHeaders.get("X-Error-Detail"));
//   }
// }