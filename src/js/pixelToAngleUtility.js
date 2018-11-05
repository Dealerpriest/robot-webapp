export default class pixelToAngleUtility {
  constructor(){

  };

  static angleToCoordinate( angle,  screenLength, fieldOfView){
    let viewplaneDistance = (0.5 * screenLength) / Math.tan(0.5 * fieldOfView);
    return Math.tan(angle) * viewplaneDistance - 0.5 * screenLength;
  }
}