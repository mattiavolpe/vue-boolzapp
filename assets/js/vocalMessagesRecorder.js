const vocalMessagesRecorder = {
  mediaRecorder: null, // The instance of the recording process
  ongoingStream: null, // The stream that is capturing the audio
  audioSlices: [], // The array to save the slices of recorded audio

  /**
   * Asks the user to grant access to the microphone, starts a recording session and pushes the audio slices into a single array that will than joined in the "stop" function
   */
  start: function () {

    // Checks if the user browser is compatible with mediaDevices API and the getUserMedia method
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      return Promise.reject(new Error("Our recording audio system is not supported by this browser."));
    } else {

      // Asks the user to grant access to the microphone and, if yes, initializes a new recording session
      return navigator.mediaDevices.getUserMedia({audio: true})
      .then(stream => {
        vocalMessagesRecorder.ongoingStream = stream;
        vocalMessagesRecorder.mediaRecorder = new MediaRecorder(stream);
        vocalMessagesRecorder.audioSlices = [];
        vocalMessagesRecorder.mediaRecorder.addEventListener("dataavailable", event => {
          vocalMessagesRecorder.audioSlices.push(event.data);
        });
        vocalMessagesRecorder.mediaRecorder.start();
      });
    }
  },

  /**
   * Stops the recording session and returns the joined slices of audio of the URL of the recording
   */
  stop: function () {
    return new Promise(resolve => {
      let mimeType = vocalMessagesRecorder.mediaRecorder.mimeType;
      vocalMessagesRecorder.mediaRecorder.addEventListener("stop", () => {
        let audioBlob = new Blob(vocalMessagesRecorder.audioSlices, { type: mimeType });
        resolve(audioBlob);
      });
      vocalMessagesRecorder.cancel();
    });
  },


  cancel: function () {
    vocalMessagesRecorder.mediaRecorder.stop();
    vocalMessagesRecorder.stopStream();
    vocalMessagesRecorder.resetRecordingProperties();
  },
  stopStream: function () {
    vocalMessagesRecorder.ongoingStream.getTracks().forEach(track => track.stop());
  },
  resetRecordingProperties: function () {
    vocalMessagesRecorder.mediaRecorder = null;
    vocalMessagesRecorder.ongoingStream = null;
  }
}