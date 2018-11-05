export default class pixelToAngleUtility {
  constructor(){
    this.CAMERA_HEIGHT_ABOVE_GROUND = 160; // how high is the camera lens above ground?
    this.DEGREES_VERTICAL = 180; // how many degrees does the camera see up-down?
    this.DEGREES_HORIZONTAL = 360; // how many degrees is does the camera see left-right?
  }

  static angleToCoordinate( angle,  screenLength, fieldOfView){
    let viewplaneDistance = (0.5 * screenLength) / Math.tan(0.5 * fieldOfView);
    return Math.tan(angle) * viewplaneDistance - 0.5 * screenLength;
  }

  coordinatesToAngleDistance(posX, posY, video_width, video_height) {
    
            // vertAngle is the angle in the vertical plane, 
            // where 0 is looking to the horizon, -90 is looking at your feet 
            // and 90 is looking straight up at the sky
            let vertAngle = ((video_height - posY) - (video_height/2)) / (video_height / this.DEGREES_VERTICAL);
            // horAngle is the angle in the horizontal plane that we should rotate towards
            // 0 is forward, 90 is right, 180 is backwards, -90 is left
            let horAngle = (posX-video_width/2) / video_width * this.DEGREES_HORIZONTAL

            let distance = this.CAMERA_HEIGHT_ABOVE_GROUND * Math.tan((90+vertAngle) * (Math.PI/180));
            if(vertAngle >= 0) {
                // we clicked above the horizon, so drive forward forever!
                distance = 9999;
            }
            
            //log("vAngle:"+vertAngle);
            console.log(" hAngle:"+Math.round(horAngle));
            console.log(" distance:"+Math.round(distance));
            return {'angle':horAngle, distance};
  }
}