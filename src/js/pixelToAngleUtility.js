export default class pixelToAngleUtility {

  constructor(cameraHeight = 1.49, fovXDegrees = 360, fovYDegrees = 180, fovXStartsAt = 90){
    this.cameraHeight = cameraHeight; // how high is the camera lens above ground?
    this.fovXDegrees = fovXDegrees; // how many degrees does the camera see up-down?
    this.fovYDegrees = fovYDegrees; // how many degrees is does the camera see left-right?
    this.fovXStartsAt = fovXStartsAt; // how many degrees is the angle of the highest row of pixels?
  }

  static angleToCoordinate( angle,  screenLength, fieldOfView){
    let viewplaneDistance = (0.5 * screenLength) / Math.tan(0.5 * fieldOfView);
    return Math.tan(angle) * viewplaneDistance - 0.5 * screenLength;
  }


  coordinatesToAngleDistance(posX, posY, video_width, video_height) {
    // vertAngle is the angle in the vertical plane, 
    // where 0 is looking to the horizon, -90 is looking at your feet 
    // and 90 is looking straight up at the sky
    
    let vertAngle = this.fovXStartsAt - (posY * (this.fovYDegrees / video_height))
    
    // horAngle is the angle in the horizontal plane that we should rotate towards
    // 0 is forward, 90 is right, 180 is backwards, -90 is left
    let horAngle = (posX-video_width/2) / video_width * this.fovXDegrees

    let distance = this.cameraHeight * Math.tan((90+vertAngle) * (Math.PI/180));
    if(vertAngle >= 0) {
        // we clicked above the horizon, so drive forward forever!
        distance = 9999;
    }
    
    // don't drive if the click is close to the bottom
    if(distance < 1)
    {
      distance = 0;
    }

    console.log("coordinatesToAngleDistance vAngle:"+vertAngle);
    console.log("coordinatesToAngleDistance hAngle:"+Math.round(horAngle));
    console.log("coordinatesToAngleDistance distance:"+Math.round(distance));
    return {'angle':horAngle, distance};
  }
}