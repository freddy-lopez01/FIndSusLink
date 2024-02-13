# FindSusLink

## Overview

FindSusLimk is a Chrome Extension that when excecuted by the user, performs a validation of the link of the webpage that the user is currenly on. It will compare the URL of the page against a large Database of known malicous websites. If it find the current URL within that database, the extension will return a warning to the user. If it doesnt, it will let the user know that it was not able to find it and to proceed with caution. 

Due to many malicous sites containing embedded popups that redirect users without their consent, this extension will catch the GET request instigated by the malicous popup which will prevent the user from being redirected and then it will scan teh html file of the website and remove the code that is responsible for the popup within the lifetime that the user is on the webpage.
