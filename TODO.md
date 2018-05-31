* [ ] Login. Both anonymously for looking and with password for controlling robot
* [ ] Chat interface
* [x] Different views (routes) for robot and client
* [x] Connection to firebase?
* [x] Connection to serial port
* [x] Transform the camera repository to a ES6 module/modules!!
* [ ] Explore interaction models for looking around. Both with servo rig and 360.
* [ ] Perhaps separate route for admin, for using chat and view client camera stream
* [ ] Error recovery when no com port detected in websocket-to-serial
* [ ] Security for the robot route. Only the robot should be allowed (preferably possible to turn on off in heroku ENV)
* [ ] --> Require special token to acces robot route. (minor security measure that is far from pen proof!)
* [x] Fix bug that makes the key repeat itself!!!
* [ ] Visualization that shows offset when panning camera. If the servo is slower than the interaction
* [ ] Handle pitch & yaw better. We want a "preview" of movements at client side (keep track of pitch & yaw locally and show moving cross hair) and sent actual angles rather than changes to robot.
