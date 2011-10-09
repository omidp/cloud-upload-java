var UserInterface = {
  disableFileSelection: function() {
    $("#fileToUpload").attr("disabled", "disabled");
  },
  showStatusBar: function() {
    $("#progress").css("visibility", "visible");
  },
  updateStatusTo: function(percentage) {
    $("#status").html(percentage + "%");
  },
  enableDetailsButton: function() {
    $("#saveDetails").removeAttr("disabled");
  }
};

var Uploader = {
  uploadId: function() {
    return $("#uid").val();
  },
  statusUrl: function () {
    return "/cloud-upload-java/status";
  },
  performUpload: function() {
    var ui = UserInterface;
    var completed = false;
    var refreshTimeout;

    var refreshProgress = function() {
      $.ajax ({
        url: Uploader.statusUrl(),
        data: { "uid": Uploader.uploadId() },
        success: function(percentage) {
          percentage = percentage.completed;

          ui.updateStatusTo(percentage);
          completed = percentage >= 100;

          if (completed) {
            clearTimeout(refreshTimeout);
            ui.enableDetailsButton();
          }
        },
        error: function(ignore, message) {
          console.log("Error while requesting status: " + message);
        }
      });    
    }; 

    var checkProgress = function() {
      if (!completed) {    
        refreshTimeout = setTimeout(function() {
          console.log("Checking upload progress...");
          refreshProgress();
          checkProgress();
        }, 500);
      }
    };

    $("#uploadForm").submit();
    ui.disableFileSelection();
    ui.showStatusBar();

    checkProgress();
  }
};

$(document).ready(function() {
  $("#fileToUpload").change(Uploader.performUpload);
});
