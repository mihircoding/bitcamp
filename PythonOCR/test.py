from PIL import Image, ImageFilter
from scipy import ndimage
import pytesseract
import numpy as np
import xlsxwriter
import cv2
from cv2 import *
from matplotlib import pyplot as plt
from array import *

pytesseract.pytesseract.tesseract_cmd = r'C:/Program Files/Tesseract-OCR/tesseract.exe'

images = array('i', [])
cam_port = 0
cam = cv2.VideoCapture(cam_port)
ctr = 0
while(True):
    _ , frame = cam.read()
    cv2.imshow('frame', frame)
    k = cv2.waitKey(1)
    if k%256 == 27:
        print('escape hit, closing the app')
        cv2.destroyAllWindows()
        break
    elif k%256 == 32:
        picture = cv2.imwrite("captured" + str(ctr) + ".jpg", frame)
        images.append(picture)
        print('Screenshot taken')
        ctr += 1
        
while True:
    i = 0
    display = cv2.imread(str(images[i]))
    display = cv2.imshow('image', images[i])
    cv2.waitKey(0)
    k = cv2.waitKey(1)
    if k%256 == 37:
        if i == 0:
            break
        i -= 1
        cv2.imshow('image', images[i])
    if k%256 == 39:
        if i == len(images):
            break
        i += 1
        cv2.imshow('image', images[i])
    if k%256 == 27:
        print('escape hit, closing the app')
        cam.destroyAllWindows()
        break
        

def clear(image):
    kernel = np.array([[-1, -1, -1], [-1, 9, -1], [-1, -1, -1]])
    return cv2.filter2D(image, -1, kernel)
    
    
filename2 = 'full.jpg'
filename3 = 'receipt1.jpg'
full = cv2.imread(filename3, cv2.IMREAD_GRAYSCALE)
if (0):
    h, w, _ = full.shape
    full = full[int(h/5):int(h/2), 0:w]
    full = cv2.resize(full, dsize = (800, 800), interpolation = cv2. INTER_LINEAR)
    full = clear(full)
    full = Image.fromarray(full, "RGB")

def test(image):
    if(1):
        _ , image = cv2.threshold(image, 160, 255, cv2.THRESH_BINARY)
        if(0):
            image = cv2.adaptiveThreshold(image, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 11, 2)
            image = cv2.adaptiveThreshold(image, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
    return image
    
full = test(full)

cv2.imshow('image',full)
cv2.waitKey(0)
cv2.destroyAllWindows()

scanned = pytesseract.image_to_string(full)
if scanned == "":
    print("Please take a clearer image")
else:
    scanned = scanned.replace('\n', ' ')

print(scanned)
index = 0
item_number = 1
row = 2
item = ''

workbook = xlsxwriter.Workbook('hello.xlsx')
worksheet = workbook.add_worksheet()
worksheet.write('A1', 'Item #')
worksheet.write('B1', 'Item Name')
worksheet.write('C1', 'Price')
worksheet.write('D1', 'Item Type') #user input?

cost = workbook.add_format({'num_format': '$##.##'})
cost0 = workbook.add_format({'num_format': '$##.00'})
split = scanned.split()
for i in split:
    if i.isalpha() or not "." in i:
        item += i + ' '
    if "." in i:
        dec = i.find('.')
        price = int(i[:dec]) + (int(i[dec + 1:])/100)
        worksheet.write(row, 0, item_number)
        worksheet.write(row, 1, item)
        if (int(i[dec + 1:])/100) == 0:
            worksheet.write(row, 2, price, cost0)
        else:
            worksheet.write(row, 2, price, cost)
        item = ''
        row += 1
        item_number += 1
workbook.close()
