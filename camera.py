import cv2
import pyyolo
import numpy as np
import sys

darknet_path = './darknet'
datacfg = 'cfg/coco.data'
cfgfile = 'cfg/yolo.cfg'
weightfile = '../yolo.weights'
filename = darknet_path + '/data/person.jpg'
thresh = 0.24
hier_thresh = 0.5

#pyyolo.init(darknet_path, datacfg, cfgfile, weightfile)


class VideoCamera(object):
    def __init__(self):
        # Using OpenCV to capture from device 0. If you have trouble capturing
        # from a webcam, comment the line below out and use a video file
        # instead.
        self.video = cv2.VideoCapture(0)
	self.video.set(cv2.cv.CV_CAP_PROP_FRAME_WIDTH, 1280)
	self.video.set(cv2.cv.CV_CAP_PROP_FRAME_HEIGHT, 720)
        self.video.set(cv2.cv.CV_CAP_PROP_FPS, 23)

        # If you decide to use video.mp4, you must have this file in the folder
        # as the main.py.
        # self.video = cv2.VideoCapture('video.mp4')
    
    def __del__(self):
        self.video.release()
    '''
    def get_frame(self):
        font = cv2.FONT_HERSHEY_SIMPLEX
        success, image = self.video.read()
        # We are using Motion JPEG, but OpenCV defaults to capture raw images,
        # so we must encode it into JPEG in order to correctly display the
        # video stream.
        img = image
        img = img.transpose(2,0,1)
        c, h, w = img.shape[0], img.shape[1], img.shape[2]
        data = img.ravel()/255.0
        data = np.ascontiguousarray(data, dtype=np.float32)
        
        outputs = pyyolo.detect(w, h, c, data, thresh, hier_thresh)
        for output in outputs:
                cv2.putText(image,output['class'],(output['left'],output['top']), font, 1,(255,255,255),2,cv2.CV_AA)
        ret, jpeg = cv2.imencode('.jpeg', image)
        for output in outputs:
            print(output) 
        return jpeg.tobytes()
'''
    def get_frame(self):
        success, image = self.video.read()
        # We are using Motion JPEG, but OpenCV defaults to capture raw images,
        # so we must encode it into JPEG in order to correctly display the
        # video stream.
        ret, jpeg = cv2.imencode('.jpeg', image)
        return jpeg.tobytes()