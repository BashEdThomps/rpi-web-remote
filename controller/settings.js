PiApp.controller('Settings',
['$state','$stateParams','$controller','$cookies','$http','$scope','$rootScope' ,
function($state, $stateParams, $controller, $cookies, $http, $scope, $rootScope)
{
	$controller('PiApp', {$scope: $scope});
	$scope.REMOVE_GPIO_DEFAULT = "Select Pin";
	$scope.REMOVE_CMD_DEFAULT = "Select Command";

  // Client function definitions -----------------------------------------------

	$scope.addSerialCommand = function()
	{
		var name = $scope.serialCommandNameAdd;
		var cmd = $scope.serialCommandAdd;

		$scope.addSerialCommandApi(name,cmd,function(res)
		{
			if (res)
			{
				$scope.serialCommandList.push({name: name, cmd: cmd});
				$scope.addAlert({ type: 'success', msg: 'Added command \"' + name + '\"' });
			}
			else
			{
				console.log("Error adding serial command",name,cmd);
				$scope.addAlert({ type: 'danger', msg: 'Error adding command \"' + name + '\"' });
			}
		});
	};

	$scope.removeSerialCommand = function()
	{
		var name = $scope.serialCommandRemove;

		$scope.removeSerialCommandApi(name,function(resp)
		{
				if (resp)
				{
					$scope.getSerialCommandIndexByName(name, function (index)
					{
						if (index > -1)
						{
							$scope.serialCommandList.splice(index,1);
						}
						else
					  {
							console.log("Cannot remove, index of ",name," command not found");
						}
					});
					$scope.addAlert({ type: 'success', msg: 'Removed command \"' + name + '\"' });
					$scope.serialCommandRemove = $scope.REMOVE_CMD_DEFAULT;
				}
				else
				{
					console.log("Error removing serial command",name);
					$scope.addAlert({ type: 'danger', msg: 'Error removing command \"' + name + '\"' });
				}
		});
	};

	$scope.saveSettings = function()
	{
		$scope.setDeviceSerialPathApi($scope.selectedSerialPort,function(result)
		{
			if (result)
			{
				$scope.setDeviceSerialBaudrateApi($scope.selectedBaudrate,function(result)
				{
					if (result)
					{
						$scope.configSaveApi(function(result)
						{
								if (result)
								{
									$scope.deviceSerialRestartApi(function(result)
									{
										if (result)
										{
											console.log("Settings saved successfuly");
											$scope.addAlert({ type: 'success', msg: 'Serial settings have been saved!.' });
										}
										else
										{
											console.log("Error restarting serial device");
											$scope.addAlert({ type: 'danger', msg: 'Error restarting serial device. Please try again!.' });
										}
									});
								}
								else
								{
									console.log("Error saving settings");
									$scope.addAlert({ type: 'danger', msg: 'Error saving Settings. Please try again!.' });
								}
						});
					}
					else
					{
						console.log("Error setting serial device baudrate");
						$scope.addAlert({ type: 'danger', msg: 'Error saving baudrate. Please try again!.' });
					}
				});
			}
			else
			{
				console.log("Error setting serial device path");
				$scope.addAlert({ type: 'danger', msg: 'Error saving device path. Please try again!.' });
			}
		});
	};

  // Get the index of a command by name
	$scope.getSerialCommandIndexByName = function(name,callback)
	{
		$scope.getSerialCommandByName(name, function(cmd)
	  {
			callback($scope.serialCommandList.indexOf(cmd));
		});
	};

	// Get a serial command by name
	$scope.getSerialCommandByName = function(name,callback)
	{
		var nCommands = $scope.serialCommandList.length;
	  for (var i = 0; i < nCommands; i++)
	  {
	    var next = $scope.serialCommandList[i];

	    if (next.name == name)
	    {
	      callback(next);
				break;
	    }
	  }
	};

	$scope.addGpioPin = function()
	{
		var name = $scope.gpioPinAddName;
		var num = $scope.gpioPinAddNum;
		var io = $scope.gpioPinAddIo;
		var state = $scope.gpioPinAddState;

		$scope.addGpioPinApi(name,num,io,state,function(res)
		{
			if (res)
			{
				$scope.addAlert({ type: 'success', msg: 'Pin '+name+' added successfuly.' });
				$scope.pinList.push({name:name, num:num, io:io, state:state});
			}
			else
			{
				$scope.addAlert({ type: 'danger', msg: 'Error adding pin '+name+'. Please try again!.' });
			}
		});
	};

	// Remove GPIO pin
	$scope.removeGpioPin = function()
	{
		var pin = $scope.gpioPinRemove;
		console.log("Removing gpio pin",pin);
		$scope.removeGpioPinApi(pin,function(res)
		{
			if (res)
			{
				$scope.addAlert({ type: 'success', msg: 'Pin '+pin+' removed successfuly.' });
				$scope.getPinByName($scope.pinList,pin,function(pinObj)
				{
					var index = $scope.pinList.indexOf(pinObj);
					$scope.pinList.splice(index,1);
				});
			}
			else
			{
				$scope.addAlert({ type: 'danger', msg: 'Error removing pin '+pin+'. Please try again!.' });
			}
		});
	};

	$scope.serialEnabledCheckboxChanged = function()
	{
		$scope.setDeviceSerialEnabledApi($scope.ui.serialEnabled,function(resp)
		{
			if ($scope.ui.serialEnabled)
			{
				$scope.getDeviceSeriaData();
				$scope.addAlert({ type: 'success', msg: 'Serial has been enabled.' });
			}
			else
			{
				$scope.getDeviceSeriaData();
				$scope.addAlert({ type: 'warning', msg: 'Serial has been disabled.' });
			}
		});
	};
}
]);
