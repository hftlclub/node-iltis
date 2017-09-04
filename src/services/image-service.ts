import * as gm from 'gm';

const imageMagick = gm.subClass({imageMagick: true});

export class ImageService {
    static squareResizeExtend(sourcePath: string, destPath: string, length: number = 400) {
        return new Promise((resolve, reject) => {
            imageMagick(sourcePath)
                .resize(length, length)
                .gravity('Center')
                .background('white')
                .extent(length, length)
                .write(destPath, err => {
                    if (err) { reject(err); }
                    resolve();
                });

                // alternative: crop from the middle and resize if smaller than dest size
                // .resize(`${length}^>`, `${length}^>`).gravity('Center').crop(length, length).background('white').extent(length, length)
        });
    }
}
