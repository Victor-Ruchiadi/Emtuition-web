import { Injectable } from '@angular/core';
import * as Excel from 'exceljs/dist/exceljs.min.js';

@Injectable({ providedIn: 'root' })
export class ExcelService {
    readFile(event): any {
        const workbook = new Excel.Workbook();
        const target: DataTransfer = (event.target) as DataTransfer;
        if (target.files.length !== 1) {
            throw new Error('Cannot use multiple files');
        }

        /**
         * Final Solution For Importing the Excel FILE
         */

        const arryBuffer = new Response(target.files[0]).arrayBuffer();
        arryBuffer.then((data) => {
            workbook.xlsx.load(data)
                .then(() => {

                    // play with workbook and worksheet now
                    console.log('workbook', workbook);
                    workbook.views = [
                        {
                            x: 0, y: 0, width: 10000, height: 20000,
                            firstSheet: 0, activeTab: 1, visibility: 'visible'
                        }
                    ];
                    console.log(workbook);
                    // const worksheet = workbook.getWorksheet(1);
                    // console.log(worksheet);
                    // console.log('rowCount: ', worksheet.rowCount);
                    // worksheet.eachRow((row, rowNumber) => {
                    //     console.log('Row: ' + rowNumber + ' Value: ' + row.values);
                    // });

                });
        });
    }
}

