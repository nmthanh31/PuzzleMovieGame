import {FFmpegKit, ReturnCode} from 'ffmpeg-kit-react-native';
import {Image} from 'react-native';
import RNFS from 'react-native-fs';

export const downloadImg = async (imageUrl: any) => {
  const outputDirectory = RNFS.DocumentDirectoryPath + '/' + 'split.img';
  const exist = await RNFS.exists(outputDirectory);

  if (!exist) await RNFS.mkdir(outputDirectory);
  else {
    await RNFS.unlink(outputDirectory);
    await RNFS.mkdir(outputDirectory);
  }

  const output =
    outputDirectory + '/' + 'external-image' + new Date().getTime() + '.jpg';
  try {
    const response = await RNFS.downloadFile({
      fromUrl: imageUrl,
      toFile: output,
    });
    if ((await response.promise).statusCode === 200) {
      console.log('Download Image Successfully');
      return output;
    } else {
      console.log('Download Image Failed');
      return undefined;
    }
  } catch (error) {
    console.error('Error when download image:', error);
    return undefined;
  }
};

const execute = async (iw: number, ih: number, size: number, input: string) => {
  const outputDirectory = RNFS.DocumentDirectoryPath + '/' + 'split.img';

  const exist = await RNFS.exists(outputDirectory);
  if (!exist) await RNFS.mkdir(outputDirectory);

  const w = iw / size;
  const h = ih / size;
  let map: any[] = [];
  for (let i = 0; i < size; i++) {
    let tmp = [];
    for (let j = 0; j < size; j++) {
      let x = j * w;
      let y = i * h;
      let output =
        outputDirectory +
        '/' +
        'split-img' +
        i +
        j +
        new Date().getTime() +
        '.jpg';

      let ffmpegCommand = `-y -i ${input} -frames:v 1 -vf "crop=${w}:${h}:${x}:${y}" "${output}"`;

      let session = await FFmpegKit.execute(ffmpegCommand);
      let returnCode = await session.getReturnCode();

      if (ReturnCode.isSuccess(returnCode)) {
        // SUCCESS
        console.log('Success');
        tmp.push('file:' + output);
      } else {
        // ERROR
        console.log('Error');
      }
    }
    map.push(tmp);
  }

  return map;
};

export const splitImg = async (url: string, size: number) => {
  const output: any = await downloadImg(url);

  let width = 500,
    height = 750;
  try {
    await Image.getSize(url, (w: number, h: number) => {
      width = w;
      height = h;
    });
  } catch (err) {
    console.log('Error when get size of image: ', err);
    width = 500;
    height = 750;
  }

  const map = await execute(width || 500, height || 750, size, output);
  return map;
};
