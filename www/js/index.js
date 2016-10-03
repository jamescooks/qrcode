/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var resultDiv, inAppBRef;

document.addEventListener("deviceready", init, false);

function init() {
    document.querySelector("#startScan").addEventListener("touchend", startScan, false);
    resultDiv = document.querySelector("#results");
}

function startScan() {
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            /*var s = "Result: <a href='" + result.text + "' onClick='OpenLink(this);return false;'> " + result.text + "</a> <br/>" +
            "Format: " + result.format + "<br/>" +
            "Cancelled: " + result.cancelled;
            resultDiv.innerHTML = s;*/
            
            var conState = checkConnection(); //alert(conState);
            
            if (conState == Connection.NONE)
            {
                //window.location="no_con.html";
                alert('This app requires an internet connection to continue.');
            }
            else
            {
                OpenLink (result.text);
            }
        },
        function (error) {
            alert("Scanning failed: " + error);
        }
    );
}

function OpenLink (durl)
{
    //alert(durl);
    //window.open(encodeURI(durl), '_self', 'location=no,hidden=yes,closebuttoncaption=Done,toolbar=no');
    
    inAppBRef = window.open(encodeURI(durl), '_blank', 'location=no');
    
    inAppBRef.addEventListener('loadstart', inAppBLoadStart);
    inAppBRef.addEventListener('loadstop', inAppBLoadStop);
    inAppBRef.addEventListener('loaderror', inAppBLoadError);
    inAppBRef.addEventListener('exit', inAppBClose);
}

function checkConnection()
{
   var networkState = navigator.network.connection.type;
   var states = {};
   states[Connection.UNKNOWN]  = 'Unknown connection';
   states[Connection.ETHERNET] = 'Ethernet connection';
   states[Connection.WIFI]     = 'WiFi connection';
   states[Connection.CELL_2G]  = 'Cell 2G connection';
   states[Connection.CELL_3G]  = 'Cell 3G connection';
   states[Connection.CELL_4G]  = 'Cell 4G connection';
   states[Connection.NONE]     = 'No network connection';
  
   return networkState;
}


function inAppBLoadStart(event)
{
    navigator.notification.activityStart("Please Wait", "Its loading....");
}

function inAppBLoadStop(event)
{
	 navigator.notification.activityStop();
}

function inAppBLoadError(event)
{
     navigator.notification.activityStop();
}

function inAppBClose(event)
{
     inAppBRef.removeEventListener('loadstart', inAppBLoadStart);
     inAppBRef.removeEventListener('loadstop', inAppBLoadStop);
     inAppBRef.removeEventListener('loaderror', inAppBLoadError);
     inAppBRef.removeEventListener('exit', inAppBClose);
}
