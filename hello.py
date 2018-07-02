from flask import Flask, render_template, jsonify, request
import time,sys,argparse, math, json, threading
from importlib import import_module
from dronekit import connect, VehicleMode
from pymavlink import mavutil
from Queue import Queue
from flask import Flask, render_template, jsonify, Response, request
import time
import decimal
import urllib
import atexit
import os
import sys
import socket
from threading import Thread
from subprocess import Popen
from datetime import datetime
from flask_triangle import Triangle




def sse_encode(obj, id=None):
    return "data: %s\n\n" % json.dumps(obj)

def state_msg():
    if vehicle.location.global_relative_frame.lat == None:
        raise Exception('no position info')
    if vehicle.armed == None:
        raise Exception('no armed info')
    return {
        "armed": vehicle.armed,
        "alt": vehicle.location.global_relative_frame.alt,
        "throttle": vehicle.channels['1'],
        "mode": vehicle.mode.name,
        "heading": vehicle.heading or 0,
        "lat": vehicle.location.global_relative_frame.lat,
        "lon": vehicle.location.global_relative_frame.lon,
        "airspeed": vehicle.airspeed,
        "roll": vehicle.attitude.roll,
        "pitch": vehicle.attitude.pitch,
        "yaw": vehicle.attitude.yaw,
    }

    

app = Flask(__name__)

vehicle = connect('/dev/serial/by-id/usb-3D_Robotics_PX4_FMU_v2.x_0-if00', wait_ready=True, baud=9600)

#vehicle = connect('/dev/ttyAMA0', wait_ready=True, baud=9600)

listeners_location = []
listeners_location

def tcount():
    while True:
        time.sleep(2)
        try:
            msg = state_msg()
            for x in listeners_location:
                x.put(msg)
        except Exception as e:
            pass
        lat_test = vehicle.location.global_relative_frame.lat
        lon_test = vehicle.location.global_relative_frame.lon
        d = {
            'drone_position': {
            'latitude': lat_test,
            'longitude': lon_test,
            },
    }        
        with open('/home/pi/Desktop/Elab_planner/static/js/helloworld.json', 'w') as f:
            json.dump(d, f)

            
t = Thread(target=tcount)
t.daemon = True
t.start()

@app.route("/api/sse/state")
def api_sse_location():
    def gen():
        q = Queue()
        listeners_location.append(q)
        try:
            while True:
                result = q.get()
                ev = sse_encode(result)
                yield ev.encode()
        except GeneratorExit: # Or maybe use flask signals
            listeners_location.remove(q)

    return Response(gen(), mimetype="text/event-stream")


@app.route('/_add_numbers')
def add_numbers():
    return jsonify(result=vehicle.location.global_frame.alt)
    #return json.dump(result=vehicle.gps_0,)
    #return vehicle.mode.name

@app.route('/_change_value')
def change_value():
    a = request.args.get('a', 0)
    b = request.args.get('b', 0)
    vehicle.parameters[str(b)]=float(a)
    return jsonify(result=a)


@app.route('/simple_goto')
def simple_goto():
    a = request.args.get('a', 0)
    b = request.args.get('b', 0)
    return jsonify(result=b)

@app.route('/land')
def land():
    vehicle.mode = VehicleMode("LAND")
    return jsonify(result=vehicle.mode.name)
    
@app.route('/navbar')
def navbar():
    return render_template('navbar.html')

@app.route('/parameters.html')
def parameters():
    param = vehicle.parameters
    return render_template('parameters.html',test=param)

@app.route('/about.html')
def about():
    return render_template('about.html')


@app.route('/_rc_override', methods=['GET','POST'])
def rc_override():
    data = {}
    data['throttle'] = request.json['throttle']
    data['yaw'] = request.json['yaw']
    #throttle = float(data['throttle'])
    vehicle.channels.overrides = {'1':int(data['yaw']), '3':int(data['throttle'])}
    #type(data['yaw'])
    print(int(data['yaw']))
    #print(float(data['throttle']))
    #print(float(data['pitch']))
    return jsonify(data)

@app.route('/clear_override', methods=['GET','POST'])
def clear_override():
    data = {}
    data['test1'] = request.json['test1']
    #data['yaw'] = request.json['yaw']
    #vehicle.channels.overrides = {'1':1500, '3':1500}
    vehicle.channels.overrides = {}
    #print(int(data['yaw']))
    return jsonify(data)


@app.route('/missions.html')
def cards():
    return render_template('missions.html')

@app.route('/')
def index():
    msg = vehicle.mode.name
    return render_template('index.html',version1=msg)

    
if __name__ == '__main__':
    app.run(host = '0.0.0.0', threaded=True, debug=False)
