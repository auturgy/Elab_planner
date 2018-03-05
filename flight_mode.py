from dronekit import connect, VehicleMode
from flask import Response
import mavhughes

# Connect to UDP endpoint.
vehicle = connect('/dev/serial/by-id/usb-3D_Robotics_PX4_FMU_v2.x_0-if00', wait_ready=True, rate=10, baud=57600)
# Use returned Vehicle object to query device state - e.g. to get the mode:

#Callback to print the location in global frame

def get_heading():
        b = 'GPS_INJECT_TO'
        done = 100
        param_set(GPS_INJECT_TO,120)
        print "done: %s" % done       
get_heading()

#Add observer for the vehicle's current location
#vehicle.add_attribute_listener('heading', location_callback)
