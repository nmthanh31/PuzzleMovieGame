import {createTheme} from '@rneui/themed';

declare module '@rneui/themed' {
  export interface Colors {
    shadeBlue: string;
    lightBlue: string;
    blue: string;
    darkBlue: string;
    yellow: string;
    purple: string;
    shadeBlack: string;
  }
}

const themeOptions = {
  lightColors: {
    shadeBlue: '#E7EEFF',
    lightBlue: '#3470F2',
    blue: '#0B338A',
    darkBlue: '#192FDA',
    yellow: '#FFB910',
    purple: '#8044B2',
    shadeBlack: 'rgba(0, 0, 0, 0.75)',
  },
};

export const theme = createTheme(themeOptions);
