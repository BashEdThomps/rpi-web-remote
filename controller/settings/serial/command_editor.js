/*
  Ash's RaspberryPI IO Remote.
  email: ashthompson06@gmail.command
  repo: https://github.com/BashEdThomps/IoT-RaspberryPI.git

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
App.controller('SerialCommandEditor', [
  'appApi','util','$scope','$state','$stateParams',
function(appApi,util, $scope, $state, $stateParams) {
    $scope.id = $stateParams.id;
    $scope.REMOVE_CMD_DEFAULT = "Select Command";
    $scope.alerts = [];
    $scope.ui = {};
    $scope.pageName = "Serial Command Editor";

    appApi.getDeviceName(function(name) {
		  $scope.deviceName = name;
	  });

    $scope.closeAlert = function(index) {
      util.closeAlert($scope.alerts,index);
    };

    if ($scope.id != "new") {
      appApi.getSerialCommand($scope.id, function(cmd) {
        $scope.cmd = cmd;
        console.log("Modifying command:", $scope.cmd);
      });
    } else {
      util.generateId(function(id){
        $scope.cmd = {
          id: id,
          name:"",
          cmd: ""
        };
        console.log("Modifying command:", $scope.cmd);
      });
    }

    $scope.deleteButton = function() {
      appApi.deleteSerialCommand($scope.cmd, function(success) {
        if (success) {
          util.addAlert($scope.alerts, {
            type: 'success',
            msg: 'Command '+$scope.cmd.name+' has been deleted!'
          });
          setTimeout(function() {
            $state.go("Settings");
          }, 3000);
        } else {
          util.addAlert($scope.alerts, {
            type: 'danger',
            msg: 'Error deleting '+$scope.cmd.name
          });
        }
      });
    };

    $scope.saveButton = function() {
      appApi.putSerialCommand($scope.cmd,function(success) {
        if (success) {
          util.addAlert($scope.alerts, {
            type: 'success',
            msg: 'Command '+$scope.cmd.name+' has been saved!'
          });
          setTimeout(function() {
            $state.go("Settings");
          }, 3000);
        } else {
          util.addAlert($scope.alerts, {
            type: 'danger',
            msg: 'Error saving '+$scope.cmd.name
          });
        }
      });
    };

    // API Calls -----------------------------------------------------------------

    appApi.getSerialPathList(function(serialList) {
  		$scope.serialPathList = serialList;
    });

    appApi.getSerialBaudrateList(function(baudList) {
  		$scope.serialBaudrateList = baudList;
    });

    appApi.getSerialCommandList(function(commandList) {
  	  $scope.serialCommandList = commandList;
    });

    appApi.getSerialPath(function(path) {
  	  $scope.serialPath = path;
    });

    appApi.getSerialBaudrate(function(baudrate) {
  	  $scope.selectedBaudrate = baudrate;
  	});
  }
]);
