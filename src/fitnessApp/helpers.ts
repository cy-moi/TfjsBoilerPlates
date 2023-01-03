function downloadObjectAsJson(exportObj: any, exportName: string){
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href",     dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

const askPermissionForDeviceMOtion = async() => {
  if ((DeviceOrientationEvent as any).requestPermission
    && typeof (DeviceMotionEvent as any).requestPermission === 'function') {
    // Handle iOS 13+ devices.
    let permission: PermissionState;
    try {

      permission = await (DeviceMotionEvent as any).requestPermission();
      if (permission !== 'granted') {
        console.log('Request to access the device orientation was rejected');
        return false;
      }

    } catch (err) {
      console.log(err);
      return false;
    }
  }

}

export {
  downloadObjectAsJson,
  askPermissionForDeviceMOtion
}