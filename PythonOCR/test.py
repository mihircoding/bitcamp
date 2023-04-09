from PIL import Image
import pytesseract
import numpy as np
import xlsxwriter
import cv2
from cv2 import *
import os
import pandas as pd
from flask import Flask, render_template

app = Flask(__name__)

pytesseract.pytesseract.tesseract_cmd = r'C:/Program Files/Tesseract-OCR/tesseract.exe'

directory = r'C:/Users/sshma/BitCamp/bitcamp/screenshots'
workbook = xlsxwriter.Workbook(r'C:/Users/sshma/BitCamp/bitcamp/data/data.xlsx')
images = []

@app.route('/take-picture', methods = ['first'])
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
            elif i == len(images) - 1:
                cv2.destroyAllWindows()
                break
    return images

def read(image, workbook):
    worksheet = data_init(workbook)
    cost = workbook.add_format({'num_format': '$##.##'})
    cost0 = workbook.add_format({'num_format': '$##.00'})
    cost1 = workbook.add_format({'num_format': '$##.#0'})
    text = pytesseract.image_to_string(image)
    if text == "":
        print("Unable to Read Text. Please retake this image")
    else:
        text = text.replace('\n', ' ')
    
    item_number = 1
    row = 1
    
    print(text)
    
    split = text.split()
    item = ''
    
    for i in split:
        if i.isalpha() or not "." in i:
            item += i + ' '
        elif '.' in i:
            dec = i.find('.')
            if '$' in i:
                price = int(i[1:dec]) + (int(i[dec + 1:]))/100
            else:
                price = int(i[:dec]) + (int(i[dec + 1:]))/100
            if int((i[dec + 1:]))/100 == 0:
                worksheet.write(row, 3, price, cost0)
            elif int(int((i[dec + 1:]))/100) % 10 == 0:
                worksheet.write(row, 3, price, cost1)
            else:
                worksheet.write(row, 3, price, cost)
            worksheet.write(row, 0, item)
            item = ''
            item_number += 1
            row += 1

#Initializes the excel sheet that holds the scanned data
def data_init(workbook):
    worksheet = workbook.add_worksheet()
    worksheet.write('A1', 'Item Name')
    worksheet.write('B1', 'Quantity')
    worksheet.write('C1', 'Cost Per Item')
    worksheet.write('D1', 'Total Price')
    return worksheet


def gen_dict(df, title):
    return {'title': title,
            'table': df.to_html(classes = 'itemTable')}

@app.route('/data')
def display_data():
    df = pd.read_excel(r'C:/Users/sshma/BitCamp/bitcamp/data/data.xlsx', sheet_name = ['Sheet1', 'Sheet2', 'Sheet3'])
    first = df.get('Sheet1')
    second = df.get('Sheet2')
    last = df.get('Sheet3')
    frames = [first, second, last]
    result = pd.concat(frames)
    return result
    
    
#Deletes all the photos taken
def finish():
    for image in os.listdir(directory):
        os.remove(os.path.join(directory, image))
        
@app.route('/')
def main():
    result = display_data()
    d = {'df1': gen_dict(result, 'Scanned Item Details')}
    return render_template('test.html', **d)

    
def rest():
    take_picture()
    images = display()
    for image in images:
        read(image, workbook)
    display_data()
    workbook.close()

@app.route("/test")
def test():
    return render_template('test.html')

if __name__ == '__main__':
    app.run(debug = True)