cd /opt/janus/bin

gst-launch-1.0 -v v4l2src device="/dev/video0" ! video/x-raw,width=1280,height=720 ! videoconvert ! x264enc tune=zerolatency speed-preset=ultrafast qp-min=18 pass=5 quantizer=21 bitrate=5000 aud=false ! h264parse ! rtph264pay config-interval=1 pt=96 ! udpsink host=192.168.2.64 port=8004 &

#gst-launch-1.0 -v v4l2src device="/dev/video1" ! video/x-raw,width=800,height=600 ! videoconvert ! x264enc tune=zerolatency speed-preset=ultrafast qp-min=18 pass=5 quantizer=21 bitrate=5000 aud=false ! h264parse ! rtph264pay config-interval=1 pt=96 ! udpsink host=192.168.2.107 port=8005 &

./janus -F /opt/janus/etc/janus/
