FindSusLink
-----------
Authors: Maxwell Hermens, Freddy Lopez, Simon Zhao
Created: January-March 2024 for CS 433 Winter '24 Project

Overview
--------

FindSusLink is a Chrome Extension that when executed by the user, performs a validation of the link of the webpage that the user is currently on. It will compare the URL of the page against a large Database of known malicious websites. If it finds the current URL within that database, the extension will return a warning to the user. If it doesn't, it will let the user know that it was not able to find it and to proceed with caution. 

Due to many malicious sites containing embedded popups that redirect users without their consent, this extension will catch the GET request instigated by the malicious popup which will prevent the user from being redirected and then it will scan the html file of the website and remove the code that is responsible for the popup within the lifetime that the user is on the webpage. Additional ad-blocking features are also implemented within this extension.

Running Instructions:
--------------------

To run this extension;
1. Download the entire directory: https://github.com/freddy-lopez01/FIndSusLink
2. Naviagte to your chrome extension manager and turn on 'Developer mode'
3. Click on 'Load unpacked' and choose this directory (FindSusLink)
4. Turn on the extension and enjoy!

NOTE: Ad-blocking and security features may not be functional while other extensions are active. For testing purposes please only activate SusGuard in your extension manager.
