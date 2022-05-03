sudo certbot certonly --standalone
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Please enter the domain name(s) you would like on your certificate (comma and/or
space separated) (Enter 'c' to cancel): dbs.aidatapipes.com
Requesting a certificate for dbs.aidatapipes.com

Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/dbs.aidatapipes.com/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/dbs.aidatapipes.com/privkey.pem
This certificate expires on 2022-07-30.
These files will be updated when the certificate renews.
Certbot has set up a scheduled task to automatically renew this certificate in the background.

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
If you like Certbot, please consider supporting our work by:
 * Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
 * Donating to EFF:                    https://eff.org/donate-le
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
roberto@ubuntuserver:~$ 

// Create group with root and specific node user as members
$ sudo addgroup nodecert
$ sudo adduser <nodeuser> nodecert
$ sudo adduser root nodecert

// Make the relevant letsencrypt folders owned by said group.
$ sudo chgrp -R nodecert /etc/letsencrypt/live
$ sudo chgrp -R nodecert /etc/letsencrypt/archive

// Allow group to open relevant folders
$ sudo chmod -R 750 /etc/letsencrypt/live
$ sudo chmod -R 750 /etc/letsencrypt/archive

