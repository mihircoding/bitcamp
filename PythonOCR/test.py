from PIL import Image, ImageFilter
import pytesseract
import numpy as np
import xlsxwriter
import cv2
from cv2 import *
from matplotlib import pyplot as plt
from array import *
import os

pytesseract.pytesseract.tesseract_cmd = r'C:/Program Files/Tesseract-OCR/tesseract.exe'

directory = r'C:/Users/sshma/BitCamp/bitcamp/screenshots'
workbook = xlsxwriter.Workbook('data.xlsx')
images = []


#Takes pictures and stores them in a folder until user stops
def take_picture():
    cam_port = 0
    cam = cv2.VideoCapture(cam_port)
    ctr = 0
    while(True):
        os.chdir(directory)
        _ , frame = cam.read()
        cv2.imshow('frame', frame)
        k = cv2.waitKey(1)
        if k%256 == 27:
            print('escape hit, closing the app')
            cv2.destroyAllWindows()
            break
        elif k%256 == 32:
            picture = cv2.imwrite("captured" + str(ctr) + ".jpg", frame)
            print('Screenshot taken')
            ctr += 1
        elif k%256 == 114: #removes the last picture taken
            os.remove(os.path.join(directory, "captured" + str(ctr - 1) + ".jpg"))
            ctr -= 1

#Displays all the images taken
def display():
    images = [cv2.imread(file) for file in os.listdir(directory)]
    i = 0
    while True:
        cv2.imshow("IMG" + str(i), images[i])
        k = cv2.waitKey(1)
        if k%256 == 27:
            print('escape hit, closing the app')
            cv2.destroyAllWindows()
            break
        elif k%256 == 32:
            cv2.destroyWindow("IMG" + str(i))
            if not i == len(images) - 1:
                i += 1
                cv2.imshow("IMG" + str(i), images[i])

#Scans all the images that was taken
def scan(images):
    for image in images:
        scan(image)
        

def scan(image):
    if (0):
        h, w, _ = full.shape
        full = full[int(h/5):int(h/2), 0:w]
        full = cv2.resize(full, dsize = (800, 800), interpolation = cv2. INTER_LINEAR)
        full = clear(full)
        full = Image.fromarray(full, "RGB")
    full = test(full)

    cv2.imshow('image',full)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

def read(image, workbook):
    worksheet = data_init(workbook)
    cost = workbook.add_format({'num_format': '$##.##'})
    cost0 = workbook.add_format({'num_format': '$##.00'})
    text = pytesseract.image_to_string(image)
    if text == "":
        print("Unable to Read Text. Please retake this image")
    else:
        text = text.replace('\n', ' ')
    
    index = 0
    item_number = 1
    row = 2
    item = ''

    print(text)
    
    split = text.split()
    
    for i in split:
        if i.isalpha() or not "." in i:
            item += i + ' '
        elif "." in i:
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
    
def test(image):
    if(1):
        _ , image = cv2.threshold(image, 160, 255, cv2.THRESH_BINARY)
        if(0):
            image = cv2.adaptiveThreshold(image, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 11, 2)
            image = cv2.adaptiveThreshold(image, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
    return image

#Initializes the excel sheet that holds the scanned data
def data_init(workbook):
    worksheet = workbook.add_worksheet()
    worksheet.write('A1', 'Item #')
    worksheet.write('B1', 'Item Name')
    worksheet.write('C1', 'Price')
    worksheet.write('D1', 'Item Type') #user input?
    return worksheet

#Deletes all the photos taken
def finish():
    workbook.close()
    for image in os.listdir(directory):
        os.remove(os.path.join(directory, image))
        
def main():
    data_init(workbook)
    take_picture()
    display()
    finish()

main()