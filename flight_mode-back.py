from dronekit import connect, VehicleMode

# Connect to UDP endpoint.
vehicle = connect('/dev/ttyACM0', wait_ready=True, rate=10, baud=57600)
# Use returned Vehicle object to query device state - e.g. to get the mode:




last_rangefinder_distance=0

@vehicle.on_attribute('heading')
def rangefinder_callback(self,attr_name):
     #attr_name not used here.
     global last_rangefinder_distance
     if last_rangefinder_distance == round(self.heading, 1):
         return
     last_rangefinder_distance = round(self.heading, 1)
     print " Rangefinder (metres): %s" % last_rangefinder_distance

#Callback to print the location in global frame
#@vehicle.on_attribute('attitude')
#def attitude_listener(self, name, msg):
    #print '%s attribute is: %s' % (name, msg)
 #   yield msg
#Add observer for the vehicle's current location
#vehicle.add_attribute_listener('heading', location_callback)
